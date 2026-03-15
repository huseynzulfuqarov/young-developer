package com.communitypulse.service;

import com.communitypulse.dto.response.StreakResponse;
import com.communitypulse.entity.CommunityMembership;
import com.communitypulse.entity.Streak;
import com.communitypulse.entity.User;
import com.communitypulse.enums.MemberStatus;
import com.communitypulse.exception.BadRequestException;
import com.communitypulse.exception.ResourceNotFoundException;
import com.communitypulse.repository.CommunityMembershipRepository;
import com.communitypulse.repository.CommunityRepository;
import com.communitypulse.repository.StreakRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Duolingo-style streak system with check-in logic,
 * streak continuation/reset, and member status management.
 */
@Service
@Slf4j
public class StreakService {

    private final StreakRepository streakRepository;
    private final CommunityMembershipRepository membershipRepository;
    private final CommunityRepository communityRepository;
    private final UserService userService;
    private final GamificationService gamificationService;

    public StreakService(StreakRepository streakRepository,
                        CommunityMembershipRepository membershipRepository,
                        CommunityRepository communityRepository,
                        UserService userService,
                        GamificationService gamificationService) {
        this.streakRepository = streakRepository;
        this.membershipRepository = membershipRepository;
        this.communityRepository = communityRepository;
        this.userService = userService;
        this.gamificationService = gamificationService;
    }

    /**
     * Performs a daily check-in for a user in a specific community.
     * Implements the Duolingo-style streak logic:
     * - If already checked in today → reject
     * - If last check-in was yesterday → streak continues
     * - If last check-in was older → streak resets to 1
     * - Awards points based on streak length
     *
     * @param communityId the community to check in to
     * @param username    the user performing the check-in
     * @return StreakResponse with updated streak data
     */
    @Transactional
    public StreakResponse checkIn(Long communityId, String username) {
        communityRepository.findById(communityId)
                .orElseThrow(() -> new ResourceNotFoundException("Community", "id", communityId));

        User user = userService.getUserByUsername(username);

        if (!membershipRepository.existsByUserIdAndCommunityId(user.getId(), communityId)) {
            throw new BadRequestException("You must be a member of this community to check in");
        }

        LocalDate today = LocalDate.now();
        Streak streak = streakRepository.findByUserIdAndCommunityId(user.getId(), communityId)
                .orElse(null);

        String message;

        if (streak == null) {
            // First ever check-in
            streak = Streak.builder()
                    .userId(user.getId())
                    .communityId(communityId)
                    .currentStreak(1)
                    .longestStreak(1)
                    .lastCheckInDate(today)
                    .streakStartDate(today)
                    .totalCheckIns(1)
                    .build();
            message = "🎉 Welcome! Your streak journey begins today!";
        } else if (streak.getLastCheckInDate() != null && streak.getLastCheckInDate().equals(today)) {
            // Already checked in today
            throw new BadRequestException("You have already checked in today!");
        } else if (streak.getLastCheckInDate() != null
                && streak.getLastCheckInDate().equals(today.minusDays(1))) {
            // Streak continues!
            streak.setCurrentStreak(streak.getCurrentStreak() + 1);
            streak.setLongestStreak(Math.max(streak.getLongestStreak(), streak.getCurrentStreak()));
            streak.setLastCheckInDate(today);
            streak.setTotalCheckIns(streak.getTotalCheckIns() + 1);
            message = "🔥 Streak continues! " + streak.getCurrentStreak() + " days strong!";
        } else {
            // Streak broken — reset
            streak.setCurrentStreak(1);
            streak.setStreakStartDate(today);
            streak.setLastCheckInDate(today);
            streak.setTotalCheckIns(streak.getTotalCheckIns() + 1);
            message = "💪 New streak started! Keep it going this time!";
        }

        Streak saved = streakRepository.save(streak);

        // Award points: 10 base + (streak * 2) bonus
        int points = 10 + (saved.getCurrentStreak() * 2);
        gamificationService.awardPoints(user.getId(), communityId, points);

        // Update member status based on recent activity
        updateMemberStatus(user.getId(), communityId);

        // Check badge eligibility
        gamificationService.checkStreakBadge(user.getId(), communityId, saved.getCurrentStreak());

        log.info("User '{}' checked in to community {}. Streak: {}, Points: +{}",
                username, communityId, saved.getCurrentStreak(), points);

        return toStreakResponse(saved, user.getUsername(), message);
    }

    /**
     * Gets the current streak for a user in a community.
     */
    public StreakResponse getStreak(Long communityId, String username) {
        User user = userService.getUserByUsername(username);
        Streak streak = streakRepository.findByUserIdAndCommunityId(user.getId(), communityId)
                .orElseThrow(() -> new ResourceNotFoundException("Streak", "communityId", communityId));
        return toStreakResponse(streak, user.getUsername(), null);
    }

    /**
     * Gets all streaks for a community (for leaderboard).
     */
    public List<StreakResponse> getAllStreaks(Long communityId) {
        return streakRepository.findByCommunityIdOrderByCurrentStreakDesc(communityId).stream()
                .map(streak -> {
                    User user = userService.getUserById(streak.getUserId());
                    return toStreakResponse(streak, user.getUsername(), null);
                })
                .collect(Collectors.toList());
    }

    /**
     * Updates a community member's status based on their check-in activity.
     * - CHAMPION: 3+ times in last 7 days
     * - ACTIVE: at least once in last 7 days  
     * - AT_RISK: last check-in 8-30 days ago
     * - CHURNED: last check-in 30+ days ago (or never)
     */
    private void updateMemberStatus(Long userId, Long communityId) {
        CommunityMembership membership = membershipRepository
                .findByUserIdAndCommunityId(userId, communityId)
                .orElse(null);

        if (membership == null) return;

        Streak streak = streakRepository.findByUserIdAndCommunityId(userId, communityId).orElse(null);

        if (streak == null || streak.getLastCheckInDate() == null) {
            membership.setStatus(MemberStatus.CHURNED);
        } else {
            long daysSinceLastCheckIn = ChronoUnit.DAYS.between(streak.getLastCheckInDate(), LocalDate.now());

            if (daysSinceLastCheckIn <= 7 && streak.getCurrentStreak() >= 3) {
                membership.setStatus(MemberStatus.CHAMPION);
            } else if (daysSinceLastCheckIn <= 7) {
                membership.setStatus(MemberStatus.ACTIVE);
            } else if (daysSinceLastCheckIn <= 30) {
                membership.setStatus(MemberStatus.AT_RISK);
            } else {
                membership.setStatus(MemberStatus.CHURNED);
            }
        }

        membership.setLastActiveAt(java.time.LocalDateTime.now());
        membershipRepository.save(membership);
    }

    private StreakResponse toStreakResponse(Streak streak, String username, String message) {
        return StreakResponse.builder()
                .id(streak.getId())
                .userId(streak.getUserId())
                .username(username)
                .communityId(streak.getCommunityId())
                .currentStreak(streak.getCurrentStreak())
                .longestStreak(streak.getLongestStreak())
                .lastCheckInDate(streak.getLastCheckInDate())
                .streakStartDate(streak.getStreakStartDate())
                .totalCheckIns(streak.getTotalCheckIns())
                .message(message)
                .build();
    }
}
