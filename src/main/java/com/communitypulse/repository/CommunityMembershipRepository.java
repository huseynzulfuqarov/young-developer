package com.communitypulse.repository;

import com.communitypulse.entity.CommunityMembership;
import com.communitypulse.enums.MemberStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CommunityMembershipRepository extends JpaRepository<CommunityMembership, Long> {

    Optional<CommunityMembership> findByUserIdAndCommunityId(Long userId, Long communityId);

    List<CommunityMembership> findByCommunityId(Long communityId);

    List<CommunityMembership> findByUserId(Long userId);

    List<CommunityMembership> findByCommunityIdAndStatus(Long communityId, MemberStatus status);

    boolean existsByUserIdAndCommunityId(Long userId, Long communityId);

    long countByCommunityId(Long communityId);

    long countByCommunityIdAndStatus(Long communityId, MemberStatus status);

    void deleteByUserIdAndCommunityId(Long userId, Long communityId);
}
