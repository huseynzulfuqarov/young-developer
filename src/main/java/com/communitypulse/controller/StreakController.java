package com.communitypulse.controller;

import com.communitypulse.dto.response.StreakResponse;
import com.communitypulse.service.StreakService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/streaks")
@Slf4j
public class StreakController {

    private final StreakService streakService;

    public StreakController(StreakService streakService) {
        this.streakService = streakService;
    }

    @PostMapping("/checkin/{communityId}")
    public ResponseEntity<StreakResponse> checkIn(@PathVariable Long communityId,
                                                   Authentication authentication) {
        return ResponseEntity.ok(streakService.checkIn(communityId, authentication.getName()));
    }

    @GetMapping("/{communityId}")
    public ResponseEntity<StreakResponse> getMyStreak(@PathVariable Long communityId,
                                                      Authentication authentication) {
        return ResponseEntity.ok(streakService.getStreak(communityId, authentication.getName()));
    }

    @GetMapping("/{communityId}/all")
    public ResponseEntity<List<StreakResponse>> getAllStreaks(@PathVariable Long communityId) {
        return ResponseEntity.ok(streakService.getAllStreaks(communityId));
    }
}
