package com.communitypulse.repository;

import com.communitypulse.entity.EventAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventAttendanceRepository extends JpaRepository<EventAttendance, Long> {

    List<EventAttendance> findByEventId(Long eventId);

    List<EventAttendance> findByUserId(Long userId);

    Optional<EventAttendance> findByEventIdAndUserId(Long eventId, Long userId);

    boolean existsByEventIdAndUserId(Long eventId, Long userId);

    long countByEventId(Long eventId);

    long countByUserIdAndAttendedTrue(Long userId);

    long countByEventIdAndAttendedTrue(Long eventId);
}
