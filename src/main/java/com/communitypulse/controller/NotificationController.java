package com.communitypulse.controller;

import com.communitypulse.dto.response.NotificationResponse;
import com.communitypulse.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import com.communitypulse.enums.NotificationType;
import com.communitypulse.entity.User;
import com.communitypulse.service.UserService;

@RestController
@RequestMapping("/api/notifications")
@Slf4j
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    public NotificationController(NotificationService notificationService, UserService userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(Authentication authentication) {
        return ResponseEntity.ok(notificationService.getMyNotifications(authentication.getName()));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication authentication) {
        long count = notificationService.getUnreadCount(authentication.getName());
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id, Authentication authentication) {
        notificationService.markAsRead(id, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(Authentication authentication) {
        notificationService.markAllAsRead(authentication.getName());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/send")
    public ResponseEntity<Map<String, String>> sendNotification(
            @RequestBody Map<String, Object> payload,
            Authentication authentication) {
        String targetUsername = (String) payload.get("targetUsername");
        Long communityId = Long.valueOf(payload.get("communityId").toString());
        String title = (String) payload.get("title");
        String message = (String) payload.get("message");

        User targetUser = userService.getUserByUsername(targetUsername);

        notificationService.createNotification(
                targetUser.getId(), communityId, title, message,
                NotificationType.RE_ENGAGEMENT, true
        );

        log.info("AI notification sent to '{}' by '{}'", targetUsername, authentication.getName());
        return ResponseEntity.ok(Map.of("status", "sent", "targetUser", targetUsername));
    }
}
