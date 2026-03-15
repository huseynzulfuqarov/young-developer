package com.communitypulse.repository;

import com.communitypulse.entity.Community;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {

    List<Community> findByIsActiveTrue();

    List<Community> findByOwnerUserId(Long ownerUserId);

    boolean existsByName(String name);
}
