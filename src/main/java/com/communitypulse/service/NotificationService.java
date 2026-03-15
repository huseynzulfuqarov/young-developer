package com.communitypulse.service;

import com.communitypulse.dto.response.NotificationResponse;
import com.communitypulse.entity.Notification;
import com.communitypulse.entity.User;
import com.communitypulse.enums.NotificationType;
import com.communitypulse.exception.ResourceNotFoundException;
import com.communitypulse.repository.NotificationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Manages user notifications: creation, retrieval, and read status.
 */
@Service
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserService userService;

    public NotificationService(NotificationRepository notificationRepository,
                               UserService userService) {
        this.notificationRepository = notificationRepository;
        this.userService = userService;
    }

    /**
     * Creates and saves a new notification.
     */
    @Transactional
    public Notification createNotification(Long userId, Long communityId, String title,
                                           String message, NotificationType type, boolean sentByAi) {
        Notification notification = Notification.builder()
                .userId(userId)
                .communityId(communityId)
                .title(title)
                .message(message)
                .type(type)
                .sentByAi(sentByAi)
                .build();

        Notification saved = notificationRepository.save(notification);
        log.debug("Notification created for user {}: {}", userId, title);
        return saved;
    }

    /**
     * Gets all notifications for the authenticated user.
     */
    public List<NotificationResponse> getMyNotifications(String username) {
        User user = userService.getUserByUsername(username);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::toNotificationResponse)
                .collect(Collectors.toList());
    }

    /**
     * Gets the unread notification count for the authenticated user.
     */
    public long getUnreadCount(String username) {
        User user = userService.getUserByUsername(username);
        return notificationRepository.countByUserIdAndIsReadFalse(user.getId());
    }

    /**
     * Marks a single notification as read.
     */
    @Transactional
    public void markAsRead(Long notificationId, String username) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));

        User user = userService.getUserByUsername(username);
        if (!notification.getUserId().equals(user.getId())) {
            throw new ResourceNotFoundException("Notification", "id", notificationId);
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    /**
     * Marks all notifications as read for the authenticated user.
     */
    @Transactional
    public void markAllAsRead(String username) {
        User user = userService.getUserByUsername(username);
        List<Notification> unread = notificationRepository
                .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(user.getId());
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
        log.info("Marked {} notifications as read for user '{}'", unread.size(), username);
    }

    /**
     * Gets recent notifications for a specific community (used in dashboard).
     */
    public List<NotificationResponse> getRecentByCommunity(Long communityId) {
        return notificationRepository.findByCommunityIdOrderByCreatedAtDesc(communityId).stream()
                .limit(10)
                .map(this::toNotificationResponse)
                .collect(Collectors.toList());
    }

    private NotificationResponse toNotificationResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .userId(notification.getUserId())
                .communityId(notification.getCommunityId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType().name())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .sentByAi(notification.isSentByAi())
                .build();
    }
}
