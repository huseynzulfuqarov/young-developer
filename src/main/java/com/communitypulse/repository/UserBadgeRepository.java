package com.communitypulse.repository;

import com.communitypulse.entity.UserBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserBadgeRepository extends JpaRepository<UserBadge, Long> {

    List<UserBadge> findByUserId(Long userId);

    List<UserBadge> findByUserIdAndCommunityId(Long userId, Long communityId);

    boolean existsByUserIdAndBadgeId(Long userId, Long badgeId);
}
