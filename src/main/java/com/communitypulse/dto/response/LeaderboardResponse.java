package com.communitypulse.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaderboardResponse {

    private int rank;
    private Long userId;
    private String username;
    private String fullName;
    private int currentStreak;
    private int longestStreak;
    private int totalPoints;
    private int totalCheckIns;
}
