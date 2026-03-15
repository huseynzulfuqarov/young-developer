package com.communitypulse.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateAdvertisementRequest {

    @NotNull(message = "Community ID is required")
    private Long communityId;

    @NotBlank(message = "Ad title is required")
    private String title;

    @Size(max = 1000, message = "Description must be at most 1000 characters")
    private String description;

    private String targetSkills;

    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotBlank(message = "Contact email is required")
    @Email(message = "Contact email must be valid")
    private String contactEmail;

    @NotBlank(message = "Ad type is required")
    private String adType;

    private LocalDateTime expiresAt;
}
