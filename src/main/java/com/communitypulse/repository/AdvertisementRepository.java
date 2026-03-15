package com.communitypulse.repository;

import com.communitypulse.entity.Advertisement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AdvertisementRepository extends JpaRepository<Advertisement, Long> {

    List<Advertisement> findByCommunityIdAndIsActiveTrue(Long communityId);

    List<Advertisement> findByIsActiveTrue();

    List<Advertisement> findByIsActiveTrueOrderByCreatedAtDesc();
}
