package com.communitypulse.controller;

import com.communitypulse.dto.response.DashboardResponse;
import com.communitypulse.service.AnalyticsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@Slf4j
public class DashboardController {

    private final AnalyticsService analyticsService;

    public DashboardController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/{communityId}")
    public ResponseEntity<DashboardResponse> getDashboard(@PathVariable Long communityId) {
        return ResponseEntity.ok(analyticsService.getDashboard(communityId));
    }
}
