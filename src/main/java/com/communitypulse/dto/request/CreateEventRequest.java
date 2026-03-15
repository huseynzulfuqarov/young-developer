package com.communitypulse.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateEventRequest {

    @NotNull(message = "Community ID is required")
    private Long communityId;

    @NotBlank(message = "Event title is required")
    private String title;

    private String description;

    @NotNull(message = "Event date is required")
    private LocalDateTime eventDate;

    @NotBlank(message = "Event type is required")
    private String eventType;

    private int maxAttendees;
}
