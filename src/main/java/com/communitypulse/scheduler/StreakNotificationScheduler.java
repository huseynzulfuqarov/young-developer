package com.communitypulse.scheduler;

import com.communitypulse.entity.CommunityMembership;
import com.communitypulse.entity.Streak;
import com.communitypulse.entity.User;
import com.communitypulse.enums.MemberStatus;
import com.communitypulse.enums.NotificationType;
import com.communitypulse.repository.CommunityMembershipRepository;
import com.communitypulse.repository.CommunityRepository;
import com.communitypulse.repository.StreakRepository;
import com.communitypulse.repository.UserRepository;
import com.communitypulse.service.GeminiAiService;
import com.communitypulse.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Random;

/**
 * Scheduled task that runs daily at 20:00 to send psychological
 * retention notifications to community members based on their
 * activity patterns and streak status.
 *
 * Uses Gemini AI for personalized messages with hardcoded fallbacks.
 */
@Component
@Slf4j
public class StreakNotificationScheduler {

    private final CommunityRepository communityRepository;
    private final CommunityMembershipRepository membershipRepository;
    private final StreakRepository streakRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final GeminiAiService geminiAiService;
    private final Random random = new Random();

    private static final String[] STREAK_REMINDERS = {
            "🔥 %s, your %d-day streak is about to break! Don't let it die!",
            "😢 %s, your community hasn't seen you today... Your streak is at risk!",
            "💪 %s, champions don't skip days! Check in to keep your %d-day streak alive!",
            "🏆 You're building something amazing, %s! Keep your %d-day streak going!",
            "😭 Your community misses you, %s! Come back and say hi!"
    };

    private static final String[] RE_ENGAGEMENT_MESSAGES = {
            "👋 Hey %s, it's been %d days. Your community still remembers you!",
            "🤝 %s, members are active right now. They'd love to see you!",
            "🎯 %s, new events are happening in your community. Don't miss out!",
            "💔 Your %d-day streak was legendary, %s. Want to start a new one?",
            "🚀 %s, your skills are needed! The community has new discussions."
    };

    public StreakNotificationScheduler(CommunityRepository communityRepository,
                                       CommunityMembershipRepository membershipRepository,
                                       StreakRepository streakRepository,
                                       UserRepository userRepository,
                                       NotificationService notificationService,
                                       GeminiAiService geminiAiService) {
        this.communityRepository = communityRepository;
        this.membershipRepository = membershipRepository;
        this.streakRepository = streakRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.geminiAiService = geminiAiService;
    }

    /**
     * Runs every day at 20:00 to check member activity and send notifications.
     */
    @Scheduled(cron = "0 0 20 * * *")
    public void sendDailyNotifications() {
        log.info("Starting daily streak notification job...");

        communityRepository.findByIsActiveTrue().forEach(community -> {
            List<CommunityMembership> memberships = membershipRepository.findByCommunityId(community.getId());

            memberships.forEach(membership -> {
                userRepository.findById(membership.getUserId()).ifPresent(user -> {
                    Streak streak = streakRepository
                            .findByUserIdAndCommunityId(user.getId(), community.getId())
                            .orElse(null);

                    processNotificationForMember(user, community.getId(),
                            community.getName(), streak, membership);
                });
            });
        });

        log.info("Daily streak notification job completed.");
    }

    private void processNotificationForMember(User user, Long communityId,
                                               String communityName, Streak streak,
                                               CommunityMembership membership) {
        LocalDate today = LocalDate.now();

        // Skip if user already checked in today
        if (streak != null && streak.getLastCheckInDate() != null
                && streak.getLastCheckInDate().equals(today)) {
            return;
        }

        int previousStreak = streak != null ? streak.getCurrentStreak() : 0;
        long daysInactive = 0;

        if (streak != null && streak.getLastCheckInDate() != null) {
            daysInactive = ChronoUnit.DAYS.between(streak.getLastCheckInDate(), today);
        } else {
            daysInactive = 999; // Never checked in
        }

        if (daysInactive == 0) return; // Already handled above

        String title;
        String message;
        NotificationType type;

        if (daysInactive == 1 && previousStreak > 0) {
            // Streak at risk — missed today
            type = NotificationType.STREAK_REMINDER;
            try {
                long activeFriends = membershipRepository.findByCommunityId(communityId).stream()
                        .filter(m -> m.getStatus() == MemberStatus.ACTIVE || m.getStatus() == MemberStatus.CHAMPION)
                        .count();
                Map<String, String> aiNotif = geminiAiService.generateNotification(
                        user.getFullName(), (int) daysInactive, previousStreak,
                        communityName, (int) activeFriends);
                title = aiNotif.get("title");
                message = aiNotif.get("message");
            } catch (Exception e) {
                title = "🔥 Streak at risk!";
                message = String.format(STREAK_REMINDERS[random.nextInt(STREAK_REMINDERS.length)],
                        user.getFullName(), previousStreak);
            }
        } else if (daysInactive <= 7) {
            // Re-engagement (3-7 days)
            type = NotificationType.RE_ENGAGEMENT;
            title = "😢 We miss you!";
            message = String.format(RE_ENGAGEMENT_MESSAGES[random.nextInt(RE_ENGAGEMENT_MESSAGES.length)],
                    user.getFullName(), daysInactive);
        } else if (daysInactive <= 14) {
            // FOMO-based (7-14 days)
            type = NotificationType.RE_ENGAGEMENT;
            title = "🚀 Look what you're missing!";
            message = String.format("%s, exciting things happened while you were away! " +
                    "Your %d-day streak was epic. Come back and start a new one!", user.getFullName(), previousStreak);
        } else if (daysInactive <= 30) {
            // Last resort (14-30 days)
            type = NotificationType.RE_ENGAGEMENT;
            title = "💔 We haven't given up on you";
            message = String.format("%s, your %d-day streak made you a legend. " +
                    "Your friends are still here. Come back!", user.getFullName(), previousStreak);
        } else {
            // Churned (30+ days) — still try to re-engage
            type = NotificationType.RE_ENGAGEMENT;
            title = "👋 A fresh start awaits";
            message = String.format("Hey %s, it's been a while! Your community %s has grown. " +
                    "Come check it out!", user.getFullName(), communityName);
        }

        notificationService.createNotification(user.getId(), communityId, title, message, type,
                daysInactive == 1); // Mark as AI-sent only for streak reminders

        log.debug("Notification sent to '{}' ({}d inactive): {}", user.getUsername(), daysInactive, title);
    }
}
