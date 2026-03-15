package com.communitypulse.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StreakResponse {

    private Long id;
    private Long userId;
    private String username;
    private Long communityId;
    private int currentStreak;
    private int longestStreak;
    private LocalDate lastCheckInDate;
    private LocalDate streakStartDate;
    private int totalCheckIns;
    private String message;
}
