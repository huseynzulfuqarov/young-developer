package com.communitypulse.service;

import com.communitypulse.entity.Badge;
import com.communitypulse.entity.UserBadge;
import com.communitypulse.repository.BadgeRepository;
import com.communitypulse.repository.UserBadgeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service for badge retrieval and user badge lookups.
 */
@Service
@Slf4j
public class BadgeService {

    private final BadgeRepository badgeRepository;
    private final UserBadgeRepository userBadgeRepository;

    public BadgeService(BadgeRepository badgeRepository,
                        UserBadgeRepository userBadgeRepository) {
        this.badgeRepository = badgeRepository;
        this.userBadgeRepository = userBadgeRepository;
    }

    /**
     * Gets all available badges.
     */
    public List<Badge> getAllBadges() {
        return badgeRepository.findAll();
    }

    /**
     * Gets all badges earned by a user.
     */
    public List<UserBadge> getUserBadges(Long userId) {
        return userBadgeRepository.findByUserId(userId);
    }

    /**
     * Gets badges earned by a user in a specific community.
     */
    public List<UserBadge> getUserBadgesInCommunity(Long userId, Long communityId) {
        return userBadgeRepository.findByUserIdAndCommunityId(userId, communityId);
    }
}
