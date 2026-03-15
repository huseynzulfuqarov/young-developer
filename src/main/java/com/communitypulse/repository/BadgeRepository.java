package com.communitypulse.repository;

import com.communitypulse.entity.Badge;
import com.communitypulse.enums.BadgeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface BadgeRepository extends JpaRepository<Badge, Long> {

    Optional<Badge> findByBadgeType(BadgeType badgeType);

    Optional<Badge> findByName(String name);
}
