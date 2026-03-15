package com.communitypulse.controller;

import com.communitypulse.dto.request.CreateEventRequest;
import com.communitypulse.entity.Event;
import com.communitypulse.entity.EventAttendance;
import com.communitypulse.service.EventService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@Slf4j
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    public ResponseEntity<Event> createEvent(@Valid @RequestBody CreateEventRequest request,
                                              Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(eventService.createEvent(request, authentication.getName()));
    }

    @GetMapping("/community/{id}")
    public ResponseEntity<List<Event>> getEventsByCommunity(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventsByCommunity(id));
    }

    @PostMapping("/{id}/attend")
    public ResponseEntity<EventAttendance> attendEvent(@PathVariable Long id,
                                                        Authentication authentication) {
        return ResponseEntity.ok(eventService.attendEvent(id, authentication.getName()));
    }

    @GetMapping("/{id}/attendees")
    public ResponseEntity<List<EventAttendance>> getEventAttendees(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventAttendees(id));
    }

    @DeleteMapping("/{id}/unattend")
    public ResponseEntity<Void> unattendEvent(@PathVariable Long id, Authentication authentication) {
        eventService.unattendEvent(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/attendees/{userId}/confirm")
    public ResponseEntity<EventAttendance> confirmAttendance(@PathVariable Long id,
                                                              @PathVariable Long userId,
                                                              Authentication authentication) {
        return ResponseEntity.ok(eventService.confirmAttendance(id, userId, authentication.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id,
                                             @Valid @RequestBody CreateEventRequest request,
                                             Authentication authentication) {
        return ResponseEntity.ok(eventService.updateEvent(id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id, Authentication authentication) {
        eventService.deleteEvent(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
