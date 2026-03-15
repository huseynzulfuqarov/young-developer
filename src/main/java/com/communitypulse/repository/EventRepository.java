package com.communitypulse.repository;

import com.communitypulse.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByCommunityIdOrderByEventDateDesc(Long communityId);

    long countByCommunityId(Long communityId);
}
