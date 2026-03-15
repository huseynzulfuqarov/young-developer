package com.communitypulse.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiRecommendationResponse {

    private String overallAssessment;
    private List<Recommendation> recommendations;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Recommendation {
        private String priority;
        private String title;
        private String description;
        private String expectedImpact;
    }
}
