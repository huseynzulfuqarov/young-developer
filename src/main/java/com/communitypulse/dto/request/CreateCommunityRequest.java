package com.communitypulse.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateCommunityRequest {

    @NotBlank(message = "Community name is required")
    private String name;

    @Size(max = 1000, message = "Description must be at most 1000 characters")
    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    private String logoUrl;
}
