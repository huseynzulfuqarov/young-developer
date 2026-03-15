package com.communitypulse.seed;

import com.communitypulse.entity.*;
import com.communitypulse.enums.*;
import com.communitypulse.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Seeds initial data on application startup.
 * Creates 8 users, 2 communities, memberships, streaks,
 * events, badges, notifications, and advertisements.
 */
@Component
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;
    private final CommunityMembershipRepository membershipRepository;
    private final StreakRepository streakRepository;
    private final EventRepository eventRepository;
    private final EventAttendanceRepository attendanceRepository;
    private final BadgeRepository badgeRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final NotificationRepository notificationRepository;
    private final AdvertisementRepository advertisementRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      CommunityRepository communityRepository,
                      CommunityMembershipRepository membershipRepository,
                      StreakRepository streakRepository,
                      EventRepository eventRepository,
                      EventAttendanceRepository attendanceRepository,
                      BadgeRepository badgeRepository,
                      UserBadgeRepository userBadgeRepository,
                      NotificationRepository notificationRepository,
                      AdvertisementRepository advertisementRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.communityRepository = communityRepository;
        this.membershipRepository = membershipRepository;
        this.streakRepository = streakRepository;
        this.eventRepository = eventRepository;
        this.attendanceRepository = attendanceRepository;
        this.badgeRepository = badgeRepository;
        this.userBadgeRepository = userBadgeRepository;
        this.notificationRepository = notificationRepository;
        this.advertisementRepository = advertisementRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping.");
            return;
        }

        log.info("🌱 Seeding database...");

        // ========== USERS ==========
        User admin = createUser("admin", "admin@communitypulse.com", "Admin123!", "Admin User", Role.ADMIN, null);
        User shahriyar = createUser("shahriyar", "shahriyar@example.com", "User123!", "Shahriyar Mammadov", Role.ORGANIZER, null);
        User agshin = createUser("agshin", "agshin@example.com", "User123!", "Agshin Aliyev", Role.ORGANIZER, null);
        User lala = createUser("lala", "lala@example.com", "User123!", "Lala Hasanova", Role.MEMBER, "Investment,Finance");
        User tarlan = createUser("tarlan", "tarlan@example.com", "User123!", "Tarlan Huseynov", Role.MEMBER, "DevOps,AWS,Cloud");
        User ali = createUser("ali", "ali@example.com", "User123!", "Ali Rzayev", Role.MEMBER, "AI,Cursor,Startup");
        User kamal = createUser("kamal", "kamal@example.com", "User123!", "Kamal Ismayilov", Role.MEMBER, "Java,Spring Boot,Backend");
        User kamran = createUser("kamran", "kamran@example.com", "User123!", "Kamran Najafov", Role.MEMBER, "AI,ML,Python");

        // ========== COMMUNITIES ==========
        Community techCommunity = communityRepository.save(Community.builder()
                .name("Azerbaijan Tech Community")
                .description("The largest tech community in Azerbaijan, connecting developers, designers, and tech enthusiasts.")
                .category("TECH")
                .ownerUserId(shahriyar.getId())
                .build());

        Community aiHub = communityRepository.save(Community.builder()
                .name("Baku AI Hub")
                .description("AI and Machine Learning enthusiasts in Baku. Meetups, workshops, and knowledge sharing.")
                .category("AI")
                .ownerUserId(agshin.getId())
                .build());

        // ========== MEMBERSHIPS ==========
        // All users in Azerbaijan Tech Community
        createMembership(admin.getId(), techCommunity.getId(), MemberStatus.ACTIVE, 50);
        createMembership(shahriyar.getId(), techCommunity.getId(), MemberStatus.CHAMPION, 350);
        createMembership(agshin.getId(), techCommunity.getId(), MemberStatus.CHAMPION, 280);
        createMembership(lala.getId(), techCommunity.getId(), MemberStatus.ACTIVE, 180);
        createMembership(tarlan.getId(), techCommunity.getId(), MemberStatus.ACTIVE, 120);
        createMembership(ali.getId(), techCommunity.getId(), MemberStatus.CHAMPION, 520);
        createMembership(kamal.getId(), techCommunity.getId(), MemberStatus.CHURNED, 60);
        createMembership(kamran.getId(), techCommunity.getId(), MemberStatus.ACTIVE, 90);

        // Some users in Baku AI Hub
        createMembership(agshin.getId(), aiHub.getId(), MemberStatus.CHAMPION, 300);
        createMembership(kamran.getId(), aiHub.getId(), MemberStatus.ACTIVE, 150);
        createMembership(ali.getId(), aiHub.getId(), MemberStatus.ACTIVE, 200);
        createMembership(tarlan.getId(), aiHub.getId(), MemberStatus.ACTIVE, 100);

        // ========== STREAKS ==========
        createStreak(shahriyar.getId(), techCommunity.getId(), 15, 20, 0, 45);
        createStreak(lala.getId(), techCommunity.getId(), 8, 12, 0, 30);
        createStreak(tarlan.getId(), techCommunity.getId(), 3, 10, 0, 18);
        createStreak(ali.getId(), techCommunity.getId(), 22, 22, 0, 55);
        createStreak(kamal.getId(), techCommunity.getId(), 0, 7, 35, 15);
        createStreak(kamran.getId(), techCommunity.getId(), 1, 5, 0, 12);
        createStreak(agshin.getId(), techCommunity.getId(), 10, 15, 0, 35);

        createStreak(agshin.getId(), aiHub.getId(), 12, 18, 0, 40);
        createStreak(kamran.getId(), aiHub.getId(), 5, 8, 0, 20);
        createStreak(ali.getId(), aiHub.getId(), 8, 14, 0, 25);

        // ========== BADGES ==========
        Badge streakWarrior = badgeRepository.save(Badge.builder()
                .name("Streak Warrior").description("Maintained a 7+ day streak").iconUrl("🔥")
                .badgeType(BadgeType.STREAK_WARRIOR).requiredPoints(0).build());
        badgeRepository.save(Badge.builder()
                .name("Event Master").description("Attended 5+ events").iconUrl("🎪")
                .badgeType(BadgeType.EVENT_MASTER).requiredPoints(0).build());
        Badge communityFounder = badgeRepository.save(Badge.builder()
                .name("Community Founder").description("Created a community").iconUrl("🏗️")
                .badgeType(BadgeType.COMMUNITY_FOUNDER).requiredPoints(0).build());
        Badge risingStar = badgeRepository.save(Badge.builder()
                .name("Rising Star").description("Earned 500+ total points").iconUrl("⭐")
                .badgeType(BadgeType.RISING_STAR).requiredPoints(500).build());
        badgeRepository.save(Badge.builder()
                .name("Connector").description("Member of 3+ communities").iconUrl("🤝")
                .badgeType(BadgeType.CONNECTOR).requiredPoints(0).build());

        // Award badges to appropriate users
        awardBadge(shahriyar.getId(), communityFounder.getId(), techCommunity.getId());
        awardBadge(agshin.getId(), communityFounder.getId(), aiHub.getId());
        awardBadge(ali.getId(), streakWarrior.getId(), techCommunity.getId());
        awardBadge(ali.getId(), risingStar.getId(), techCommunity.getId());
        awardBadge(shahriyar.getId(), streakWarrior.getId(), techCommunity.getId());
        awardBadge(lala.getId(), streakWarrior.getId(), techCommunity.getId());
        awardBadge(agshin.getId(), streakWarrior.getId(), aiHub.getId());

        // ========== EVENTS ==========
        Event event1 = eventRepository.save(Event.builder()
                .communityId(techCommunity.getId())
                .title("Intro to AI Tools")
                .description("Hands-on workshop on using AI tools like GitHub Copilot, Cursor, and ChatGPT for development.")
                .eventDate(LocalDateTime.now().minusDays(14))
                .eventType("OFFLINE")
                .maxAttendees(30)
                .createdByUserId(shahriyar.getId())
                .build());

        Event event2 = eventRepository.save(Event.builder()
                .communityId(techCommunity.getId())
                .title("Cloud Architecture Workshop")
                .description("Deep dive into cloud architectures on AWS and Azure. From IaaS to serverless.")
                .eventDate(LocalDateTime.now().minusDays(7))
                .eventType("ONLINE")
                .maxAttendees(50)
                .createdByUserId(tarlan.getId())
                .build());

        Event event3 = eventRepository.save(Event.builder()
                .communityId(aiHub.getId())
                .title("Startup Pitch Night")
                .description("Present your AI startup idea. Get feedback from investors and mentors.")
                .eventDate(LocalDateTime.now().plusDays(7))
                .eventType("HYBRID")
                .maxAttendees(40)
                .createdByUserId(agshin.getId())
                .build());

        // Event attendances
        createAttendance(event1.getId(), shahriyar.getId(), true);
        createAttendance(event1.getId(), lala.getId(), true);
        createAttendance(event1.getId(), ali.getId(), true);
        createAttendance(event1.getId(), kamran.getId(), true);
        createAttendance(event1.getId(), agshin.getId(), true);
        createAttendance(event1.getId(), tarlan.getId(), true);

        createAttendance(event2.getId(), tarlan.getId(), true);
        createAttendance(event2.getId(), shahriyar.getId(), true);
        createAttendance(event2.getId(), kamal.getId(), true);
        createAttendance(event2.getId(), ali.getId(), true);

        createAttendance(event3.getId(), agshin.getId(), false);
        createAttendance(event3.getId(), kamran.getId(), false);
        createAttendance(event3.getId(), ali.getId(), false);

        // ========== NOTIFICATIONS ==========
        notificationRepository.save(Notification.builder()
                .userId(kamal.getId()).communityId(techCommunity.getId())
                .title("😢 We miss you, Kamal!")
                .message("It's been 35 days since your last visit. Your 7-day streak was legendary. Start a new one?")
                .type(NotificationType.RE_ENGAGEMENT).sentByAi(true).build());

        notificationRepository.save(Notification.builder()
                .userId(ali.getId()).communityId(techCommunity.getId())
                .title("🏆 Achievement Unlocked!")
                .message("Congratulations Ali! You've earned the Rising Star badge with 520+ points!")
                .type(NotificationType.ACHIEVEMENT).build());

        notificationRepository.save(Notification.builder()
                .userId(shahriyar.getId()).communityId(techCommunity.getId())
                .title("🔥 15-Day Streak!")
                .message("Amazing, Shahriyar! Your streak just hit 15 days. Keep the momentum going!")
                .type(NotificationType.STREAK_REMINDER).build());

        notificationRepository.save(Notification.builder()
                .userId(lala.getId()).communityId(techCommunity.getId())
                .title("🎯 Upcoming Event")
                .message("Don't miss 'Startup Pitch Night' happening next week in your community!")
                .type(NotificationType.EVENT_REMINDER).build());

        notificationRepository.save(Notification.builder()
                .userId(kamran.getId()).communityId(aiHub.getId())
                .title("👋 Welcome back!")
                .message("Great to see you back, Kamran! You've checked in today. Let's build that streak!")
                .type(NotificationType.STREAK_REMINDER).build());

        // ========== ADVERTISEMENTS ==========
        advertisementRepository.save(Advertisement.builder()
                .communityId(techCommunity.getId())
                .title("Senior Java Developer Wanted")
                .description("Join our growing team! We're looking for experienced Java/Spring Boot developers for our fintech platform.")
                .targetSkills("Java,Spring Boot,Backend")
                .companyName("AzFinTech")
                .contactEmail("hr@azfintech.com")
                .adType("JOB")
                .expiresAt(LocalDateTime.now().plusDays(30))
                .build());

        advertisementRepository.save(Advertisement.builder()
                .communityId(aiHub.getId())
                .title("AI Research Internship")
                .description("6-month internship opportunity in our AI lab. Work on NLP and computer vision projects.")
                .targetSkills("AI,ML,Python")
                .companyName("BakuAI Labs")
                .contactEmail("intern@bakuai.com")
                .adType("INTERNSHIP")
                .expiresAt(LocalDateTime.now().plusDays(60))
                .build());

        advertisementRepository.save(Advertisement.builder()
                .communityId(techCommunity.getId())
                .title("Startup Investment Opportunity")
                .description("Looking for angel investors for our EdTech startup. Seed round — $200K target.")
                .targetSkills("Investment,Finance,Startup")
                .companyName("LearnAZ")
                .contactEmail("invest@learnaz.com")
                .adType("INVESTMENT")
                .expiresAt(LocalDateTime.now().plusDays(45))
                .build());

        log.info("✅ Database seeded successfully!");
        log.info("   → 8 users, 2 communities, memberships, streaks, 5 badges, 3 events, 5 notifications, 3 ads");
    }

    private User createUser(String username, String email, String password,
                            String fullName, Role role, String skills) {
        return userRepository.save(User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .fullName(fullName)
                .role(role)
                .skills(skills)
                .build());
    }

    private void createMembership(Long userId, Long communityId, MemberStatus status, int points) {
        membershipRepository.save(CommunityMembership.builder()
                .userId(userId)
                .communityId(communityId)
                .status(status)
                .totalPoints(points)
                .build());
    }

    private void createStreak(Long userId, Long communityId, int current, int longest,
                              int daysAgoLastCheckIn, int totalCheckIns) {
        LocalDate lastCheckIn = daysAgoLastCheckIn == 0
                ? LocalDate.now()
                : LocalDate.now().minusDays(daysAgoLastCheckIn);

        streakRepository.save(Streak.builder()
                .userId(userId)
                .communityId(communityId)
                .currentStreak(current)
                .longestStreak(longest)
                .lastCheckInDate(lastCheckIn)
                .streakStartDate(lastCheckIn.minusDays(current))
                .totalCheckIns(totalCheckIns)
                .build());
    }

    private void createAttendance(Long eventId, Long userId, boolean attended) {
        attendanceRepository.save(EventAttendance.builder()
                .eventId(eventId)
                .userId(userId)
                .attended(attended)
                .build());
    }

    private void awardBadge(Long userId, Long badgeId, Long communityId) {
        userBadgeRepository.save(UserBadge.builder()
                .userId(userId)
                .badgeId(badgeId)
                .communityId(communityId)
                .build());
    }
}
