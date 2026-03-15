package com.communitypulse.service;

import com.communitypulse.dto.request.CreateEventRequest;
import com.communitypulse.entity.Event;
import com.communitypulse.entity.EventAttendance;
import com.communitypulse.entity.User;
import com.communitypulse.enums.Role;
import com.communitypulse.exception.BadRequestException;
import com.communitypulse.exception.ResourceNotFoundException;
import com.communitypulse.repository.CommunityRepository;
import com.communitypulse.repository.EventAttendanceRepository;
import com.communitypulse.repository.EventRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Manages community events: creation, listing, and attendance.
 */
@Service
@Slf4j
public class EventService {

    private final EventRepository eventRepository;
    private final EventAttendanceRepository attendanceRepository;
    private final CommunityRepository communityRepository;
    private final UserService userService;
    private final GamificationService gamificationService;

    public EventService(EventRepository eventRepository,
                        EventAttendanceRepository attendanceRepository,
                        CommunityRepository communityRepository,
                        UserService userService,
                        GamificationService gamificationService) {
        this.eventRepository = eventRepository;
        this.attendanceRepository = attendanceRepository;
        this.communityRepository = communityRepository;
        this.userService = userService;
        this.gamificationService = gamificationService;
    }

    /**
     * Creates a new community event and awards the creator 100 points.
     */
    @Transactional
    public Event createEvent(CreateEventRequest request, String username) {
        communityRepository.findById(request.getCommunityId())
                .orElseThrow(() -> new ResourceNotFoundException("Community", "id", request.getCommunityId()));

        User creator = userService.getUserByUsername(username);

        Event event = Event.builder()
                .communityId(request.getCommunityId())
                .title(request.getTitle())
                .description(request.getDescription())
                .eventDate(request.getEventDate())
                .eventType(request.getEventType())
                .maxAttendees(request.getMaxAttendees())
                .createdByUserId(creator.getId())
                .build();

        Event saved = eventRepository.save(event);

        // Award 100 points for first event creation
        gamificationService.awardPoints(creator.getId(), request.getCommunityId(), 100);

        log.info("Event '{}' created in community {} by '{}'", saved.getTitle(), request.getCommunityId(), username);
        return saved;
    }

    /**
     * Lists all events for a given community.
     */
    public List<Event> getEventsByCommunity(Long communityId) {
        communityRepository.findById(communityId)
                .orElseThrow(() -> new ResourceNotFoundException("Community", "id", communityId));
        return eventRepository.findByCommunityIdOrderByEventDateDesc(communityId);
    }

    /**
     * Registers a user for an event.
     */
    @Transactional
    public EventAttendance attendEvent(Long eventId, String username) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        User user = userService.getUserByUsername(username);

        if (attendanceRepository.existsByEventIdAndUserId(eventId, user.getId())) {
            throw new BadRequestException("You are already registered for this event");
        }

        long currentCount = attendanceRepository.countByEventId(eventId);
        if (event.getMaxAttendees() > 0 && currentCount >= event.getMaxAttendees()) {
            throw new BadRequestException("This event is already full");
        }

        EventAttendance attendance = EventAttendance.builder()
                .eventId(eventId)
                .userId(user.getId())
                .attended(true)
                .build();

        EventAttendance saved = attendanceRepository.save(attendance);

        // Award 50 points for event attendance
        gamificationService.awardPoints(user.getId(), event.getCommunityId(), 50);
        gamificationService.checkEventBadge(user.getId(), event.getCommunityId());

        log.info("User '{}' registered for event '{}'", username, event.getTitle());
        return saved;
    }

    /**
     * Lists all attendees of an event.
     */
    public List<EventAttendance> getEventAttendees(Long eventId) {
        eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));
        return attendanceRepository.findByEventId(eventId);
    }

    /**
     * Updates an event. Only the creator can update.
     */
    @Transactional
    public Event updateEvent(Long eventId, CreateEventRequest request, String username) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        User user = userService.getUserByUsername(username);
        if (!event.getCreatedByUserId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new BadRequestException("Only the event creator can update this event");
        }

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setEventDate(request.getEventDate());
        event.setEventType(request.getEventType());
        event.setMaxAttendees(request.getMaxAttendees());

        Event updated = eventRepository.save(event);
        log.info("Event '{}' updated by '{}'", updated.getTitle(), username);
        return updated;
    }

    /**
     * Deletes an event. Only the creator or an ADMIN can delete.
     */
    @Transactional
    public void deleteEvent(Long eventId, String username) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        User user = userService.getUserByUsername(username);
        if (!event.getCreatedByUserId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new BadRequestException("Only the event creator or an admin can delete this event");
        }

        attendanceRepository.deleteByEventId(eventId);
        eventRepository.delete(event);
        log.info("Event '{}' deleted by '{}'", event.getTitle(), username);
    }
}
