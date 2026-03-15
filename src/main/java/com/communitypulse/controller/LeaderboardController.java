package com.communitypulse.controller;

import com.communitypulse.dto.response.LeaderboardResponse;
import com.communitypulse.service.AnalyticsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@Slf4j
public class LeaderboardController {

    private final AnalyticsService analyticsService;

    public LeaderboardController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/{communityId}")
    public ResponseEntity<List<LeaderboardResponse>> getStreakLeaderboard(@PathVariable Long communityId) {
        return ResponseEntity.ok(analyticsService.buildStreakLeaderboard(communityId, 20));
    }

    @GetMapping("/{communityId}/points")
    public ResponseEntity<List<LeaderboardResponse>> getPointsLeaderboard(@PathVariable Long communityId) {
        return ResponseEntity.ok(analyticsService.buildPointsLeaderboard(communityId));
    }
}
