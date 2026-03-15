package com.communitypulse.service;

import com.communitypulse.dto.response.DashboardResponse;
import com.communitypulse.dto.response.LeaderboardResponse;
import com.communitypulse.dto.response.NotificationResponse;
import com.communitypulse.entity.CommunityMembership;
import com.communitypulse.entity.Streak;
import com.communitypulse.entity.User;
import com.communitypulse.enums.MemberStatus;
import com.communitypulse.exception.ResourceNotFoundException;
import com.communitypulse.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Analytics service calculating community health scores
 * and aggregating dashboard data.
 *
 * Health Score Formula:
 *   (activeMembers / totalMembers * 40) +
 *   (avgEventAttendance / totalMembers * 20) +
 *   (avgStreak / 30 * 20) +
 *   (championMembers / totalMembers * 20)
 *   Clamped between 0-100.
 */
@Service
@Slf4j
public class AnalyticsService {

    private final CommunityMembershipRepository membershipRepository;
    private final CommunityRepository communityRepository;
    private final StreakRepository streakRepository;
    private final EventRepository eventRepository;
    private final EventAttendanceRepository attendanceRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    public AnalyticsService(CommunityMembershipRepository membershipRepository,
                            CommunityRepository communityRepository,
                            StreakRepository streakRepository,
                            EventRepository eventRepository,
                            EventAttendanceRepository attendanceRepository,
                            UserService userService,
                            NotificationService notificationService) {
        this.membershipRepository = membershipRepository;
        this.communityRepository = communityRepository;
        this.streakRepository = streakRepository;
        this.eventRepository = eventRepository;
        this.attendanceRepository = attendanceRepository;
        this.userService = userService;
        this.notificationService = notificationService;
    }

    /**
     * Builds a complete dashboard analytics response for a community.
     *
     * @param communityId target community
     * @return DashboardResponse with health score, member stats, leaderboard, etc.
     */
    public DashboardResponse getDashboard(Long communityId) {
        communityRepository.findById(communityId)
                .orElseThrow(() -> new ResourceNotFoundException("Community", "id", communityId));

        long totalMembers = membershipRepository.countByCommunityId(communityId);
        long activeMembers = membershipRepository.countByCommunityIdAndStatus(communityId, MemberStatus.ACTIVE)
                + membershipRepository.countByCommunityIdAndStatus(communityId, MemberStatus.CHAMPION);
        long atRiskMembers = membershipRepository.countByCommunityIdAndStatus(communityId, MemberStatus.AT_RISK);
        long churnedMembers = membershipRepository.countByCommunityIdAndStatus(communityId, MemberStatus.CHURNED);
        long championMembers = membershipRepository.countByCommunityIdAndStatus(communityId, MemberStatus.CHAMPION);

        long totalEvents = eventRepository.countByCommunityId(communityId);

        double avgEventAttendance = 0;
        if (totalEvents > 0) {
            List<com.communitypulse.entity.Event> events = eventRepository.findByCommunityIdOrderByEventDateDesc(communityId);
            long totalAttendees = events.stream()
                    .mapToLong(e -> attendanceRepository.countByEventId(e.getId()))
                    .sum();
            avgEventAttendance = (double) totalAttendees / totalEvents;
        }

        Double avgStreak = streakRepository.findAverageStreakByCommunityId(communityId);
        if (avgStreak == null) avgStreak = 0.0;

        double engagementRate = totalMembers > 0 ? ((double) activeMembers / totalMembers) * 100 : 0;

        int healthScore = calculateHealthScore(totalMembers, activeMembers, championMembers,
                avgEventAttendance, avgStreak);

        // Build streak leaderboard (top 10)
        List<LeaderboardResponse> leaderboard = buildStreakLeaderboard(communityId, 10);

        // Recent notifications
        List<NotificationResponse> recentNotifications = notificationService.getRecentByCommunity(communityId);

        return DashboardResponse.builder()
                .healthScore(healthScore)
                .totalMembers(totalMembers)
                .activeMembers(activeMembers)
                .atRiskMembers(atRiskMembers)
                .churnedMembers(churnedMembers)
                .championMembers(championMembers)
                .engagementRate(Math.round(engagementRate * 100.0) / 100.0)
                .totalEvents(totalEvents)
                .averageAttendance(Math.round(avgEventAttendance * 100.0) / 100.0)
                .streakLeaderboard(leaderboard)
                .recentNotifications(recentNotifications)
                .build();
    }

    /**
     * Builds a streak leaderboard for a community.
     */
    public List<LeaderboardResponse> buildStreakLeaderboard(Long communityId, int limit) {
        List<Streak> streaks = streakRepository.findByCommunityIdOrderByCurrentStreakDesc(communityId);
        List<LeaderboardResponse> leaderboard = new ArrayList<>();
        AtomicInteger rank = new AtomicInteger(1);

        streaks.stream().limit(limit).forEach(streak -> {
            User user = userService.getUserById(streak.getUserId());
            CommunityMembership membership = membershipRepository
                    .findByUserIdAndCommunityId(streak.getUserId(), communityId)
                    .orElse(null);

            int totalPoints = membership != null ? membership.getTotalPoints() : 0;

            leaderboard.add(LeaderboardResponse.builder()
                    .rank(rank.getAndIncrement())
                    .userId(user.getId())
                    .username(user.getUsername())
                    .fullName(user.getFullName())
                    .currentStreak(streak.getCurrentStreak())
                    .longestStreak(streak.getLongestStreak())
                    .totalPoints(totalPoints)
                    .totalCheckIns(streak.getTotalCheckIns())
                    .build());
        });

        return leaderboard;
    }

    /**
     * Builds a points leaderboard for a community.
     */
    public List<LeaderboardResponse> buildPointsLeaderboard(Long communityId) {
        List<CommunityMembership> memberships = membershipRepository.findByCommunityId(communityId);

        memberships.sort((a, b) -> Integer.compare(b.getTotalPoints(), a.getTotalPoints()));

        List<LeaderboardResponse> leaderboard = new ArrayList<>();
        AtomicInteger rank = new AtomicInteger(1);

        memberships.stream().limit(20).forEach(m -> {
            User user = userService.getUserById(m.getUserId());
            Streak streak = streakRepository.findByUserIdAndCommunityId(m.getUserId(), communityId).orElse(null);

            leaderboard.add(LeaderboardResponse.builder()
                    .rank(rank.getAndIncrement())
                    .userId(user.getId())
                    .username(user.getUsername())
                    .fullName(user.getFullName())
                    .currentStreak(streak != null ? streak.getCurrentStreak() : 0)
                    .longestStreak(streak != null ? streak.getLongestStreak() : 0)
                    .totalPoints(m.getTotalPoints())
                    .totalCheckIns(streak != null ? streak.getTotalCheckIns() : 0)
                    .build());
        });

        return leaderboard;
    }

    private int calculateHealthScore(long totalMembers, long activeMembers, long championMembers,
                                     double avgEventAttendance, double avgStreak) {
        if (totalMembers == 0) return 0;

        double activityScore = ((double) activeMembers / totalMembers) * 40;
        double eventScore = Math.min((avgEventAttendance / totalMembers) * 20, 20);
        double streakScore = Math.min((avgStreak / 30) * 20, 20);
        double championScore = ((double) championMembers / totalMembers) * 20;

        int score = (int) Math.round(activityScore + eventScore + streakScore + championScore);
        return Math.max(0, Math.min(100, score));
    }
}
