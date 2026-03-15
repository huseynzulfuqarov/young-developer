package com.communitypulse.repository;

import com.communitypulse.entity.Streak;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StreakRepository extends JpaRepository<Streak, Long> {

    Optional<Streak> findByUserIdAndCommunityId(Long userId, Long communityId);

    List<Streak> findByCommunityIdOrderByCurrentStreakDesc(Long communityId);

    List<Streak> findByUserId(Long userId);

    @Query("SELECT AVG(s.currentStreak) FROM Streak s WHERE s.communityId = :communityId")
    Double findAverageStreakByCommunityId(@Param("communityId") Long communityId);
}
