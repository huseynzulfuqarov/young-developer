package com.communitypulse.service;

import com.communitypulse.entity.Badge;
import com.communitypulse.entity.UserBadge;
import com.communitypulse.enums.BadgeType;
import com.communitypulse.repository.BadgeRepository;
import com.communitypulse.repository.CommunityMembershipRepository;
import com.communitypulse.repository.EventAttendanceRepository;
import com.communitypulse.repository.UserBadgeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Manages points system and badge awards.
 * Points: daily check-in (10), streak bonus (streak*2), event attendance (50), event creation (100).
 * Badges: STREAK_WARRIOR (7+ streak), EVENT_MASTER (5+ events), RISING_STAR (500+ points), CONNECTOR (3+ communities).
 */
@Service
@Slf4j
public class GamificationService {

    private final CommunityMembershipRepository membershipRepository;
    private final BadgeRepository badgeRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final EventAttendanceRepository eventAttendanceRepository;

    public GamificationService(CommunityMembershipRepository membershipRepository,
                               BadgeRepository badgeRepository,
                               UserBadgeRepository userBadgeRepository,
                               EventAttendanceRepository eventAttendanceRepository) {
        this.membershipRepository = membershipRepository;
        this.badgeRepository = badgeRepository;
        this.userBadgeRepository = userBadgeRepository;
        this.eventAttendanceRepository = eventAttendanceRepository;
    }

    /**
     * Awards points to a user's membership in a community.
     *
     * @param userId      the user to award points to
     * @param communityId the community context
     * @param points      number of points to add
     */
    @Transactional
    public void awardPoints(Long userId, Long communityId, int points) {
        membershipRepository.findByUserIdAndCommunityId(userId, communityId)
                .ifPresent(membership -> {
                    membership.setTotalPoints(membership.getTotalPoints() + points);
                    membershipRepository.save(membership);
                    log.debug("Awarded {} points to user {} in community {}", points, userId, communityId);

                    // Check RISING_STAR badge (500+ points)
                    if (membership.getTotalPoints() >= 500) {
                        awardBadge(userId, communityId, BadgeType.RISING_STAR);
                    }
                });
    }

    /**
     * Checks and awards the STREAK_WARRIOR badge if streak >= 7 days.
     */
    public void checkStreakBadge(Long userId, Long communityId, int currentStreak) {
        if (currentStreak >= 7) {
            awardBadge(userId, communityId, BadgeType.STREAK_WARRIOR);
        }
    }

    /**
     * Checks and awards the EVENT_MASTER badge if user attended 5+ events.
     */
    public void checkEventBadge(Long userId, Long communityId) {
        long eventsAttended = eventAttendanceRepository.countByUserIdAndAttendedTrue(userId);
        if (eventsAttended >= 5) {
            awardBadge(userId, communityId, BadgeType.EVENT_MASTER);
        }
    }

    /**
     * Awards the COMMUNITY_FOUNDER badge.
     */
    public void awardFounderBadge(Long userId, Long communityId) {
        awardBadge(userId, communityId, BadgeType.COMMUNITY_FOUNDER);
    }

    /**
     * Checks and awards the CONNECTOR badge if the user is in 3+ communities.
     */
    public void checkConnectorBadge(Long userId, Long communityId) {
        long communityCount = membershipRepository.findByUserId(userId).size();
        if (communityCount >= 3) {
            awardBadge(userId, communityId, BadgeType.CONNECTOR);
        }
    }

    /**
     * Awards a badge to a user if they don't already have it.
     */
    @Transactional
    public void awardBadge(Long userId, Long communityId, BadgeType badgeType) {
        Optional<Badge> badgeOpt = badgeRepository.findByBadgeType(badgeType);
        if (badgeOpt.isEmpty()) {
            log.warn("Badge type {} not found in database", badgeType);
            return;
        }

        Badge badge = badgeOpt.get();

        if (userBadgeRepository.existsByUserIdAndBadgeId(userId, badge.getId())) {
            return; // Already has this badge
        }

        UserBadge userBadge = UserBadge.builder()
                .userId(userId)
                .badgeId(badge.getId())
                .communityId(communityId)
                .build();

        userBadgeRepository.save(userBadge);
        log.info("Badge '{}' awarded to user {} in community {}", badge.getName(), userId, communityId);
    }
}
