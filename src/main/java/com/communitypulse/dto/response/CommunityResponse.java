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
public class CommunityResponse {

    private Long id;
    private String name;
    private String description;
    private String category;
    private Long ownerUserId;
    private String ownerUsername;
    private String logoUrl;
    private LocalDateTime createdAt;
    private boolean isActive;
    private long memberCount;
}
