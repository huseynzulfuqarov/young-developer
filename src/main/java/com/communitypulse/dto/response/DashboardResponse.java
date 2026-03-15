package com.communitypulse.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private int healthScore;
    private long totalMembers;
    private long activeMembers;
    private long atRiskMembers;
    private long churnedMembers;
    private long championMembers;
    private double engagementRate;
    private long totalEvents;
    private double averageAttendance;
    private List<LeaderboardResponse> streakLeaderboard;
    private List<NotificationResponse> recentNotifications;
}
