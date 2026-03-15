package com.communitypulse.controller;

import com.communitypulse.dto.response.AiRecommendationResponse;
import com.communitypulse.dto.response.DashboardResponse;
import com.communitypulse.dto.response.MemberAnalyticsResponse;
import com.communitypulse.entity.CommunityMembership;
import com.communitypulse.entity.Community;
import com.communitypulse.entity.Streak;
import com.communitypulse.entity.User;
import com.communitypulse.exception.ResourceNotFoundException;
import com.communitypulse.repository.*;
import com.communitypulse.service.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@Slf4j
public class AiController {

    private final GeminiAiService geminiAiService;
    private final AnalyticsService analyticsService;
    private final CommunityRepository communityRepository;
    private final CommunityMembershipRepository membershipRepository;
    private final StreakRepository streakRepository;
    private final UserService userService;
    private final NotificationService notificationService;
    private final UserBadgeRepository userBadgeRepository;
    private final EventAttendanceRepository eventAttendanceRepository;

    public AiController(GeminiAiService geminiAiService,
                        AnalyticsService analyticsService,
                        CommunityRepository communityRepository,
                        CommunityMembershipRepository membershipRepository,
                        StreakRepository streakRepository,
                        UserService userService,
                        NotificationService notificationService,
                        UserBadgeRepository userBadgeRepository,
                        EventAttendanceRepository eventAttendanceRepository) {
        this.geminiAiService = geminiAiService;
        this.analyticsService = analyticsService;
        this.communityRepository = communityRepository;
        this.membershipRepository = membershipRepository;
        this.streakRepository = streakRepository;
        this.userService = userService;
        this.notificationService = notificationService;
        this.userBadgeRepository = userBadgeRepository;
        this.eventAttendanceRepository = eventAttendanceRepository;
    }

    @PostMapping("/recommendations/{communityId}")
    public ResponseEntity<AiRecommendationResponse> getRecommendations(@PathVariable Long communityId) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new ResourceNotFoundException("Community", "id", communityId));

        DashboardResponse dashboard = analyticsService.getDashboard(communityId);

        AiRecommendationResponse response = geminiAiService.getRecommendations(
                community.getName(),
                dashboard.getTotalMembers(),
                dashboard.getActiveMembers(),
                dashboard.getAtRiskMembers(),
                dashboard.getChurnedMembers(),
                dashboard.getEngagementRate(),
                dashboard.getAverageAttendance(),
                dashboard.getHealthScore()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/generate-notification/{communityId}")
    public ResponseEntity<Map<String, String>> generateNotification(
            @PathVariable Long communityId,
            @RequestParam(defaultValue = "Member") String memberName,
            @RequestParam(defaultValue = "1") int daysInactive,
            @RequestParam(defaultValue = "0") int previousStreak) {

        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new ResourceNotFoundException("Community", "id", communityId));

        long activeFriends = membershipRepository.findByCommunityId(communityId).stream()
                .filter(m -> m.getStatus() == com.communitypulse.enums.MemberStatus.ACTIVE
                        || m.getStatus() == com.communitypulse.enums.MemberStatus.CHAMPION)
                .count();

        Map<String, String> notification = geminiAiService.generateNotification(
                memberName, daysInactive, previousStreak,
                community.getName(), (int) activeFriends
        );

        return ResponseEntity.ok(notification);
    }

    @PostMapping("/analyze-member/{communityId}/{userId}")
    public ResponseEntity<MemberAnalyticsResponse> analyzeMember(
            @PathVariable Long communityId, @PathVariable Long userId) {

        communityRepository.findById(communityId)
                .orElseThrow(() -> new ResourceNotFoundException("Community", "id", communityId));

        User user = userService.getUserById(userId);

        CommunityMembership membership = membershipRepository
                .findByUserIdAndCommunityId(userId, communityId)
                .orElseThrow(() -> new ResourceNotFoundException("Membership", "userId", userId));

        Streak streak = streakRepository.findByUserIdAndCommunityId(userId, communityId).orElse(null);

        int eventsAttended = (int) eventAttendanceRepository.countByUserIdAndAttendedTrue(userId);
        int badgesEarned = userBadgeRepository.findByUserIdAndCommunityId(userId, communityId).size();

        String aiAnalysis = geminiAiService.analyzeMember(
                user.getFullName(),
                streak != null ? streak.getCurrentStreak() : 0,
                streak != null ? streak.getLongestStreak() : 0,
                membership.getTotalPoints(),
                eventsAttended,
                membership.getStatus().name()
        );

        MemberAnalyticsResponse response = MemberAnalyticsResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .status(membership.getStatus().name())
                .currentStreak(streak != null ? streak.getCurrentStreak() : 0)
                .longestStreak(streak != null ? streak.getLongestStreak() : 0)
                .totalPoints(membership.getTotalPoints())
                .totalCheckIns(streak != null ? streak.getTotalCheckIns() : 0)
                .eventsAttended(eventsAttended)
                .badgesEarned(badgesEarned)
                .aiAnalysis(aiAnalysis)
                .build();

        return ResponseEntity.ok(response);
    }
}
