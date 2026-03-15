package com.communitypulse.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {

    private Long id;
    private Long userId;
    private Long communityId;
    private String title;
    private String message;
    private String type;
    private boolean isRead;
    private LocalDateTime createdAt;
    private boolean sentByAi;
}
