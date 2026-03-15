package com.communitypulse.service;

import com.communitypulse.dto.response.AiRecommendationResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;

/**
 * Integrates with Google Gemini 2.5 Flash API for:
 * - Community health recommendations
 * - Psychological notification generation
 * - Member engagement analysis
 *
 * Falls back to hardcoded responses if the API is unavailable.
 */
@Service
@Slf4j
public class GeminiAiService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String apiUrl;

    public GeminiAiService(WebClient webClient,
                           @Value("${gemini.api.key}") String apiKey,
                           @Value("${gemini.api.url}") String apiUrl) {
        this.webClient = webClient;
        this.objectMapper = new ObjectMapper();
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
    }

    /**
     * Gets AI-powered recommendations for improving community health.
     */
    public AiRecommendationResponse getRecommendations(String communityName, long totalMembers,
                                                        long activeMembers, long atRiskMembers,
                                                        long churnedMembers, double engagementRate,
                                                        double avgAttendance, int healthScore) {
        String prompt = String.format(
                "You are a community management expert. Analyze this tech community data and provide 5 specific, actionable recommendations to improve engagement:\n\n" +
                "Community: %s\nTotal Members: %d\nActive Members: %d\nAt Risk Members: %d\n" +
                "Churned Members: %d\nEngagement Rate: %.1f%%\nAverage Event Attendance: %.1f\n" +
                "Current Health Score: %d/100\n\n" +
                "Respond in JSON format:\n" +
                "{\"recommendations\": [{\"priority\": \"HIGH/MEDIUM/LOW\", \"title\": \"...\", \"description\": \"...\", \"expectedImpact\": \"...\"}], \"overallAssessment\": \"...\"}",
                communityName, totalMembers, activeMembers, atRiskMembers,
                churnedMembers, engagementRate, avgAttendance, healthScore
        );

        try {
            String response = callGeminiApi(prompt);
            return parseRecommendations(response);
        } catch (Exception e) {
            log.error("Gemini AI recommendation request failed, using fallback: {}", e.getMessage());
            return getFallbackRecommendations(healthScore);
        }
    }

    /**
     * Generates a personalized, emotionally compelling notification message
     * using psychological principles (Hooked framework).
     */
    public Map<String, String> generateNotification(String memberName, int daysInactive,
                                                     int previousStreak, String communityName,
                                                     int activeFriendsCount) {
        String prompt = String.format(
                "Generate a personalized, emotionally compelling push notification to re-engage a community member. " +
                "Use psychological principles from the book 'Hooked' by Nir Eyal (trigger → action → variable reward → investment cycle).\n\n" +
                "Member name: %s\nDays inactive: %d\nPrevious streak: %d\nCommunity name: %s\n" +
                "Active friends count: %d\n\n" +
                "Rules:\n- Max 2 sentences\n- Use emoji\n- Create urgency or FOMO\n- Make it personal\n- Do NOT be generic\n\n" +
                "Respond in JSON: {\"title\": \"...\", \"message\": \"...\", \"emotionalTrigger\": \"...\"}",
                memberName, daysInactive, previousStreak, communityName, activeFriendsCount
        );

        try {
            String response = callGeminiApi(prompt);
            return parseNotification(response);
        } catch (Exception e) {
            log.error("Gemini AI notification generation failed, using fallback: {}", e.getMessage());
            return getFallbackNotification(memberName, daysInactive, previousStreak);
        }
    }

    /**
     * Analyzes a specific member's engagement pattern.
     */
    public String analyzeMember(String memberName, int currentStreak, int longestStreak,
                                int totalPoints, int eventsAttended, String status) {
        String prompt = String.format(
                "Analyze this tech community member's engagement and suggest retention strategies:\n\n" +
                "Name: %s\nCurrent Streak: %d days\nLongest Streak: %d days\nTotal Points: %d\n" +
                "Events Attended: %d\nCurrent Status: %s\n\n" +
                "Provide a brief analysis (3-4 sentences) of their engagement pattern and 2-3 specific retention strategies.",
                memberName, currentStreak, longestStreak, totalPoints, eventsAttended, status
        );

        try {
            return callGeminiApi(prompt);
        } catch (Exception e) {
            log.error("Gemini AI member analysis failed: {}", e.getMessage());
            return String.format("Member %s is currently %s with a %d-day streak. " +
                    "Consider personalized outreach to boost engagement.", memberName, status, currentStreak);
        }
    }

    private String callGeminiApi(String prompt) {
        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> content = new HashMap<>();
        Map<String, String> part = new HashMap<>();
        part.put("text", prompt);
        content.put("parts", List.of(part));
        requestBody.put("contents", List.of(content));

        String fullUrl = apiUrl + "?key=" + apiKey;

        String responseBody = webClient.post()
                .uri(fullUrl)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && !candidates.isEmpty()) {
                return candidates.get(0).path("content").path("parts").get(0).path("text").asText();
            }
        } catch (Exception e) {
            log.error("Failed to parse Gemini response: {}", e.getMessage());
        }

        return responseBody;
    }

    private AiRecommendationResponse parseRecommendations(String response) {
        try {
            // Extract JSON from response (may be wrapped in markdown code blocks)
            String json = extractJson(response);
            JsonNode root = objectMapper.readTree(json);

            List<AiRecommendationResponse.Recommendation> recommendations = new ArrayList<>();
            JsonNode recsNode = root.path("recommendations");

            if (recsNode.isArray()) {
                for (JsonNode rec : recsNode) {
                    recommendations.add(AiRecommendationResponse.Recommendation.builder()
                            .priority(rec.path("priority").asText("MEDIUM"))
                            .title(rec.path("title").asText())
                            .description(rec.path("description").asText())
                            .expectedImpact(rec.path("expectedImpact").asText())
                            .build());
                }
            }

            return AiRecommendationResponse.builder()
                    .overallAssessment(root.path("overallAssessment").asText())
                    .recommendations(recommendations)
                    .build();
        } catch (Exception e) {
            log.error("Failed to parse AI recommendations: {}", e.getMessage());
            return getFallbackRecommendations(50);
        }
    }

    private Map<String, String> parseNotification(String response) {
        try {
            String json = extractJson(response);
            JsonNode root = objectMapper.readTree(json);
            Map<String, String> result = new HashMap<>();
            result.put("title", root.path("title").asText());
            result.put("message", root.path("message").asText());
            result.put("emotionalTrigger", root.path("emotionalTrigger").asText());
            return result;
        } catch (Exception e) {
            log.error("Failed to parse AI notification: {}", e.getMessage());
            return getFallbackNotification("User", 1, 0);
        }
    }

    private String extractJson(String text) {
        // Remove markdown code block markers if present
        String cleaned = text.trim();
        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.substring(7);
        } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.substring(3);
        }
        if (cleaned.endsWith("```")) {
            cleaned = cleaned.substring(0, cleaned.length() - 3);
        }
        return cleaned.trim();
    }

    private AiRecommendationResponse getFallbackRecommendations(int healthScore) {
        List<AiRecommendationResponse.Recommendation> recs = new ArrayList<>();

        recs.add(AiRecommendationResponse.Recommendation.builder()
                .priority("HIGH").title("Launch Weekly Challenges")
                .description("Create weekly themed challenges to drive daily engagement and streak building.")
                .expectedImpact("15-25% increase in daily active users").build());

        recs.add(AiRecommendationResponse.Recommendation.builder()
                .priority("HIGH").title("Re-engage At-Risk Members")
                .description("Send personalized messages to at-risk members highlighting what they've missed.")
                .expectedImpact("Recover 20-30% of at-risk members").build());

        recs.add(AiRecommendationResponse.Recommendation.builder()
                .priority("MEDIUM").title("Host More Events")
                .description("Increase event frequency to give members more reasons to participate.")
                .expectedImpact("10-15% engagement rate boost").build());

        recs.add(AiRecommendationResponse.Recommendation.builder()
                .priority("MEDIUM").title("Introduce Mentorship Program")
                .description("Pair champions with new members to build connections and retention.")
                .expectedImpact("Reduce churn by 15-20%").build());

        recs.add(AiRecommendationResponse.Recommendation.builder()
                .priority("LOW").title("Celebrate Milestones")
                .description("Publicly celebrate member achievements to boost morale and encourage participation.")
                .expectedImpact("5-10% increase in community satisfaction").build());

        return AiRecommendationResponse.builder()
                .overallAssessment(String.format("Community health score is %d/100. Focus on re-engagement strategies and increasing event frequency for maximum impact.", healthScore))
                .recommendations(recs)
                .build();
    }

    private Map<String, String> getFallbackNotification(String name, int daysInactive, int previousStreak) {
        Map<String, String> result = new HashMap<>();

        if (daysInactive <= 3) {
            result.put("title", "🔥 Don't break your streak!");
            result.put("message", String.format("Hey %s, your community misses you! Your %d-day streak is at risk. Come back and check in!", name, previousStreak));
            result.put("emotionalTrigger", "loss aversion");
        } else if (daysInactive <= 7) {
            result.put("title", "😢 We miss you, " + name + "!");
            result.put("message", String.format("It's been %d days since your last visit. Your friends are active — don't miss out!", daysInactive));
            result.put("emotionalTrigger", "FOMO");
        } else if (daysInactive <= 14) {
            result.put("title", "🚀 Look what you're missing!");
            result.put("message", String.format("%s, exciting things are happening in your community! Your %d-day streak was legendary. Start a new one?", name, previousStreak));
            result.put("emotionalTrigger", "curiosity + nostalgia");
        } else {
            result.put("title", "💔 Your streak was " + previousStreak + " days");
            result.put("message", String.format("%s, we haven't given up on you! Come back and show everyone what you're made of.", name));
            result.put("emotionalTrigger", "identity + social proof");
        }

        return result;
    }
}
