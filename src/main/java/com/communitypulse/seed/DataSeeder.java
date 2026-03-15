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
 * Seeds realistic demo data for the CommunityPulse platform.
 * Creates a diverse ecosystem of users, communities, events, and engagement data
 * to showcase all platform features including AI analytics and gamification.
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

        log.info("🌱 Seeding CommunityPulse database with rich demo data...");

        // ================== USERS (12 diverse users) ==================
        User admin = createUser("admin", "admin@communitypulse.com", "Admin123!",
                "Platform Admin", Role.ADMIN, "Platform Management,Analytics,Security");

        User shahriyar = createUser("shahriyar", "shahriyar@example.com", "User123!",
                "Shahriyar Mammadov", Role.ORGANIZER, "Java,Spring Boot,Microservices,Docker");
        User agshin = createUser("agshin", "agshin@example.com", "User123!",
                "Agshin Aliyev", Role.ORGANIZER, "AI,Machine Learning,Python,TensorFlow");
        User lala = createUser("lala", "lala@example.com", "User123!",
                "Lala Hasanova", Role.MEMBER, "Investment,Finance,Blockchain,Web3");
        User tarlan = createUser("tarlan", "tarlan@example.com", "User123!",
                "Tarlan Huseynov", Role.MEMBER, "DevOps,AWS,Kubernetes,Terraform,CI/CD");
        User ali = createUser("ali", "ali@example.com", "User123!",
                "Ali Rzayev", Role.ORGANIZER, "AI,Cursor,Startup,Product Management,React");
        User kamal = createUser("kamal", "kamal@example.com", "User123!",
                "Kamal Ismayilov", Role.MEMBER, "Java,Spring Boot,PostgreSQL,Redis");
        User kamran = createUser("kamran", "kamran@example.com", "User123!",
                "Kamran Najafov", Role.MEMBER, "AI,ML,Python,NLP,Computer Vision");
        User nigar = createUser("nigar", "nigar@example.com", "User123!",
                "Nigar Mammadova", Role.MEMBER, "UI/UX Design,Figma,Adobe XD,CSS");
        User elvin = createUser("elvin", "elvin@example.com", "User123!",
                "Elvin Ahmadov", Role.MEMBER, "React,TypeScript,Next.js,Node.js");
        User aysel = createUser("aysel", "aysel@example.com", "User123!",
                "Aysel Guliyeva", Role.MEMBER, "Data Science,Python,SQL,Tableau,Power BI");
        User murad = createUser("murad", "murad@example.com", "User123!",
                "Murad Hasanov", Role.MEMBER, "Cybersecurity,Penetration Testing,Linux,Networking");

        // ================== COMMUNITIES (4 communities) ==================
        Community techCommunity = communityRepository.save(Community.builder()
                .name("Azerbaijan Tech Community")
                .description("The largest tech community in Azerbaijan, connecting developers, designers, and tech enthusiasts. We host weekly meetups, hackathons, and knowledge sharing sessions across Baku and online.")
                .category("Technology")
                .ownerUserId(shahriyar.getId())
                .build());

        Community aiHub = communityRepository.save(Community.builder()
                .name("Baku AI & Data Hub")
                .description("Artificial Intelligence and Data Science community focused on practical applications. Regular workshops on ML, NLP, computer vision, and data engineering with real-world projects.")
                .category("AI & Data Science")
                .ownerUserId(agshin.getId())
                .build());

        Community startupClub = communityRepository.save(Community.builder()
                .name("Startup Founders Club")
                .description("A community for aspiring and active entrepreneurs. Pitch nights, mentor matching, investor meetups, and co-founder networking. Building the next generation of Azerbaijani startups.")
                .category("Entrepreneurship")
                .ownerUserId(ali.getId())
                .build());

        Community designCommunity = communityRepository.save(Community.builder()
                .name("Creative Design Collective")
                .description("UI/UX designers, graphic artists, and creative professionals sharing work, critiques, and career advice. Monthly design challenges and portfolio reviews.")
                .category("Design")
                .ownerUserId(nigar.getId())
                .build());

        // ================== MEMBERSHIPS (diverse engagement levels) ==================
        // -- Azerbaijan Tech Community (10 members) --
        createMembership(admin.getId(), techCommunity.getId(), MemberStatus.ACTIVE, 75);
        createMembership(shahriyar.getId(), techCommunity.getId(), MemberStatus.CHAMPION, 480);
        createMembership(agshin.getId(), techCommunity.getId(), MemberStatus.CHAMPION, 320);
        createMembership(lala.getId(), techCommunity.getId(), MemberStatus.ACTIVE, 195);
        createMembership(tarlan.getId(), techCommunity.getId(), MemberStatus.ACTIVE, 145);
        createMembership(ali.getId(), techCommunity.getId(), MemberStatus.CHAMPION, 650);
        createMembership(kamal.getId(), techCommunity.getId(), MemberStatus.CHURNED, 60);
        createMembership(kamran.getId(), techCommunity.getId(), MemberStatus.ACTIVE, 110);
        createMembership(elvin.getId(), techCommunity.getId(), MemberStatus.AT_RISK, 85);
        createMembership(murad.getId(), techCommunity.getId(), MemberStatus.ACTIVE, 130);

        // -- Baku AI & Data Hub (7 members) --
        createMembership(agshin.getId(), aiHub.getId(), MemberStatus.CHAMPION, 420);
        createMembership(kamran.getId(), aiHub.getId(), MemberStatus.CHAMPION, 280);
        createMembership(ali.getId(), aiHub.getId(), MemberStatus.ACTIVE, 220);
        createMembership(tarlan.getId(), aiHub.getId(), MemberStatus.ACTIVE, 140);
        createMembership(aysel.getId(), aiHub.getId(), MemberStatus.CHAMPION, 350);
        createMembership(kamal.getId(), aiHub.getId(), MemberStatus.AT_RISK, 45);
        createMembership(admin.getId(), aiHub.getId(), MemberStatus.ACTIVE, 30);

        // -- Startup Founders Club (6 members) --
        createMembership(ali.getId(), startupClub.getId(), MemberStatus.CHAMPION, 510);
        createMembership(lala.getId(), startupClub.getId(), MemberStatus.CHAMPION, 380);
        createMembership(shahriyar.getId(), startupClub.getId(), MemberStatus.ACTIVE, 250);
        createMembership(nigar.getId(), startupClub.getId(), MemberStatus.ACTIVE, 170);
        createMembership(elvin.getId(), startupClub.getId(), MemberStatus.ACTIVE, 125);
        createMembership(murad.getId(), startupClub.getId(), MemberStatus.AT_RISK, 55);

        // -- Creative Design Collective (5 members) --
        createMembership(nigar.getId(), designCommunity.getId(), MemberStatus.CHAMPION, 440);
        createMembership(elvin.getId(), designCommunity.getId(), MemberStatus.ACTIVE, 200);
        createMembership(aysel.getId(), designCommunity.getId(), MemberStatus.ACTIVE, 150);
        createMembership(lala.getId(), designCommunity.getId(), MemberStatus.ACTIVE, 90);
        createMembership(ali.getId(), designCommunity.getId(), MemberStatus.AT_RISK, 40);

        // ================== STREAKS (engagement tracking) ==================
        // Tech Community streaks
        createStreak(shahriyar.getId(), techCommunity.getId(), 18, 25, 0, 62);
        createStreak(ali.getId(), techCommunity.getId(), 28, 28, 0, 75);
        createStreak(agshin.getId(), techCommunity.getId(), 12, 18, 0, 42);
        createStreak(lala.getId(), techCommunity.getId(), 9, 14, 0, 35);
        createStreak(tarlan.getId(), techCommunity.getId(), 4, 12, 0, 22);
        createStreak(kamal.getId(), techCommunity.getId(), 0, 8, 42, 16);
        createStreak(kamran.getId(), techCommunity.getId(), 2, 7, 0, 15);
        createStreak(elvin.getId(), techCommunity.getId(), 0, 5, 10, 12);
        createStreak(murad.getId(), techCommunity.getId(), 6, 11, 0, 28);

        // AI Hub streaks
        createStreak(agshin.getId(), aiHub.getId(), 15, 22, 0, 52);
        createStreak(kamran.getId(), aiHub.getId(), 7, 10, 0, 26);
        createStreak(ali.getId(), aiHub.getId(), 10, 16, 0, 30);
        createStreak(aysel.getId(), aiHub.getId(), 14, 19, 0, 48);
        createStreak(kamal.getId(), aiHub.getId(), 0, 4, 15, 8);

        // Startup Club streaks
        createStreak(ali.getId(), startupClub.getId(), 20, 20, 0, 50);
        createStreak(lala.getId(), startupClub.getId(), 13, 17, 0, 40);
        createStreak(shahriyar.getId(), startupClub.getId(), 5, 9, 0, 20);

        // Design Community streaks
        createStreak(nigar.getId(), designCommunity.getId(), 16, 21, 0, 55);
        createStreak(elvin.getId(), designCommunity.getId(), 3, 8, 0, 18);

        // ================== BADGES ==================
        Badge streakWarrior = badgeRepository.save(Badge.builder()
                .name("Streak Warrior").description("Maintained a 7+ day check-in streak")
                .iconUrl("🔥").badgeType(BadgeType.STREAK_WARRIOR).requiredPoints(0).build());
        Badge streakLegend = badgeRepository.save(Badge.builder()
                .name("Streak Legend").description("Maintained an incredible 30+ day streak")
                .iconUrl("🌟").badgeType(BadgeType.STREAK_WARRIOR).requiredPoints(0).build());
        Badge eventMaster = badgeRepository.save(Badge.builder()
                .name("Event Master").description("Attended 5+ community events")
                .iconUrl("🎪").badgeType(BadgeType.EVENT_MASTER).requiredPoints(0).build());
        Badge communityFounder = badgeRepository.save(Badge.builder()
                .name("Community Founder").description("Created and leads a community")
                .iconUrl("🏗️").badgeType(BadgeType.COMMUNITY_FOUNDER).requiredPoints(0).build());
        Badge risingStar = badgeRepository.save(Badge.builder()
                .name("Rising Star").description("Earned 500+ total engagement points")
                .iconUrl("⭐").badgeType(BadgeType.RISING_STAR).requiredPoints(500).build());
        Badge connector = badgeRepository.save(Badge.builder()
                .name("Connector").description("Active member in 3+ communities")
                .iconUrl("🤝").badgeType(BadgeType.CONNECTOR).requiredPoints(0).build());

        // Award badges
        awardBadge(shahriyar.getId(), communityFounder.getId(), techCommunity.getId());
        awardBadge(agshin.getId(), communityFounder.getId(), aiHub.getId());
        awardBadge(ali.getId(), communityFounder.getId(), startupClub.getId());
        awardBadge(nigar.getId(), communityFounder.getId(), designCommunity.getId());

        awardBadge(ali.getId(), streakWarrior.getId(), techCommunity.getId());
        awardBadge(ali.getId(), risingStar.getId(), techCommunity.getId());
        awardBadge(ali.getId(), connector.getId(), techCommunity.getId());
        awardBadge(shahriyar.getId(), streakWarrior.getId(), techCommunity.getId());
        awardBadge(lala.getId(), streakWarrior.getId(), techCommunity.getId());
        awardBadge(lala.getId(), connector.getId(), startupClub.getId());
        awardBadge(agshin.getId(), streakWarrior.getId(), aiHub.getId());
        awardBadge(aysel.getId(), streakWarrior.getId(), aiHub.getId());
        awardBadge(nigar.getId(), streakWarrior.getId(), designCommunity.getId());
        awardBadge(murad.getId(), streakWarrior.getId(), techCommunity.getId());

        // ================== EVENTS (8 events across communities) ==================
        // -- Past events (already happened) --
        Event event1 = eventRepository.save(Event.builder()
                .communityId(techCommunity.getId())
                .title("Intro to AI-Powered Development Tools")
                .description("Hands-on workshop exploring GitHub Copilot, Cursor AI, and ChatGPT for modern software development. Learn prompt engineering for code generation.")
                .eventDate(LocalDateTime.now().minusDays(21))
                .eventType("OFFLINE").maxAttendees(30)
                .createdByUserId(shahriyar.getId()).build());

        Event event2 = eventRepository.save(Event.builder()
                .communityId(techCommunity.getId())
                .title("Cloud Architecture & Kubernetes Workshop")
                .description("Deep dive into cloud-native architectures. Deploying microservices on AWS EKS with Terraform and GitHub Actions CI/CD pipelines.")
                .eventDate(LocalDateTime.now().minusDays(10))
                .eventType("ONLINE").maxAttendees(50)
                .createdByUserId(tarlan.getId()).build());

        Event event3 = eventRepository.save(Event.builder()
                .communityId(aiHub.getId())
                .title("NLP with Transformers — Practical Workshop")
                .description("Building real-world NLP applications using Hugging Face Transformers. Text classification, sentiment analysis, and named entity recognition.")
                .eventDate(LocalDateTime.now().minusDays(5))
                .eventType("HYBRID").maxAttendees(35)
                .createdByUserId(agshin.getId()).build());

        Event event4 = eventRepository.save(Event.builder()
                .communityId(startupClub.getId())
                .title("Pitch Night: EdTech & HealthTech")
                .description("5-minute startup pitches followed by Q&A from angel investors. Focus on education and health technology ventures in Azerbaijan.")
                .eventDate(LocalDateTime.now().minusDays(3))
                .eventType("OFFLINE").maxAttendees(40)
                .createdByUserId(ali.getId()).build());

        // -- Upcoming events --
        Event event5 = eventRepository.save(Event.builder()
                .communityId(techCommunity.getId())
                .title("Spring Boot 3.x Advanced Patterns")
                .description("Advanced session on Spring Boot 3.x — reactive programming, virtual threads, GraalVM native images, and observability with Micrometer.")
                .eventDate(LocalDateTime.now().plusDays(5))
                .eventType("ONLINE").maxAttendees(60)
                .createdByUserId(shahriyar.getId()).build());

        Event event6 = eventRepository.save(Event.builder()
                .communityId(aiHub.getId())
                .title("Computer Vision Hackathon")
                .description("48-hour hackathon building computer vision solutions. Teams of 3-5. Prizes for best use of edge ML, creative applications, and social impact.")
                .eventDate(LocalDateTime.now().plusDays(12))
                .eventType("OFFLINE").maxAttendees(50)
                .createdByUserId(agshin.getId()).build());

        Event event7 = eventRepository.save(Event.builder()
                .communityId(designCommunity.getId())
                .title("UI/UX Portfolio Review Night")
                .description("Bring your portfolio for live feedback from senior designers and hiring managers. Learn what makes a design portfolio stand out.")
                .eventDate(LocalDateTime.now().plusDays(8))
                .eventType("HYBRID").maxAttendees(25)
                .createdByUserId(nigar.getId()).build());

        Event event8 = eventRepository.save(Event.builder()
                .communityId(startupClub.getId())
                .title("Investor Panel: Funding in the Caucasus")
                .description("Panel discussion with 4 regional VCs discussing the funding landscape, what they look for in startups, and how to prepare for due diligence.")
                .eventDate(LocalDateTime.now().plusDays(15))
                .eventType("ONLINE").maxAttendees(100)
                .createdByUserId(ali.getId()).build());

        // ================== EVENT ATTENDANCES ==================
        // Past event 1 — all attended
        createAttendance(event1.getId(), shahriyar.getId(), true);
        createAttendance(event1.getId(), lala.getId(), true);
        createAttendance(event1.getId(), ali.getId(), true);
        createAttendance(event1.getId(), kamran.getId(), true);
        createAttendance(event1.getId(), agshin.getId(), true);
        createAttendance(event1.getId(), tarlan.getId(), true);
        createAttendance(event1.getId(), nigar.getId(), true);

        // Past event 2 — mostly attended
        createAttendance(event2.getId(), tarlan.getId(), true);
        createAttendance(event2.getId(), shahriyar.getId(), true);
        createAttendance(event2.getId(), kamal.getId(), true);
        createAttendance(event2.getId(), ali.getId(), true);
        createAttendance(event2.getId(), murad.getId(), true);
        createAttendance(event2.getId(), elvin.getId(), false);

        // Past event 3 — mixed
        createAttendance(event3.getId(), agshin.getId(), true);
        createAttendance(event3.getId(), kamran.getId(), true);
        createAttendance(event3.getId(), aysel.getId(), true);
        createAttendance(event3.getId(), ali.getId(), false);

        // Past event 4 — startup pitch
        createAttendance(event4.getId(), ali.getId(), true);
        createAttendance(event4.getId(), lala.getId(), true);
        createAttendance(event4.getId(), shahriyar.getId(), true);
        createAttendance(event4.getId(), nigar.getId(), true);

        // Upcoming events — registered only (attended = false)
        createAttendance(event5.getId(), shahriyar.getId(), false);
        createAttendance(event5.getId(), kamal.getId(), false);
        createAttendance(event5.getId(), ali.getId(), false);
        createAttendance(event5.getId(), elvin.getId(), false);
        createAttendance(event5.getId(), tarlan.getId(), false);

        createAttendance(event6.getId(), agshin.getId(), false);
        createAttendance(event6.getId(), kamran.getId(), false);
        createAttendance(event6.getId(), aysel.getId(), false);
        createAttendance(event6.getId(), ali.getId(), false);

        createAttendance(event7.getId(), nigar.getId(), false);
        createAttendance(event7.getId(), elvin.getId(), false);
        createAttendance(event7.getId(), lala.getId(), false);

        createAttendance(event8.getId(), ali.getId(), false);
        createAttendance(event8.getId(), lala.getId(), false);
        createAttendance(event8.getId(), shahriyar.getId(), false);

        // ================== NOTIFICATIONS (varied types) ==================
        notificationRepository.save(Notification.builder()
                .userId(kamal.getId()).communityId(techCommunity.getId())
                .title("😢 We miss you, Kamal!")
                .message("It's been 42 days since your last check-in at Azerbaijan Tech Community. Your 8-day streak was impressive! Come back and start a new one — the community needs your Java expertise.")
                .type(NotificationType.RE_ENGAGEMENT).sentByAi(true).build());

        notificationRepository.save(Notification.builder()
                .userId(ali.getId()).communityId(techCommunity.getId())
                .title("🏆 Rising Star Achievement!")
                .message("Congratulations Ali! You've earned the Rising Star badge with 650+ engagement points! Your 28-day streak is the longest in the community.")
                .type(NotificationType.ACHIEVEMENT).build());

        notificationRepository.save(Notification.builder()
                .userId(shahriyar.getId()).communityId(techCommunity.getId())
                .title("🔥 18-Day Streak!")
                .message("Amazing, Shahriyar! Your streak hit 18 days. You're in the top 3 most active members. Keep the momentum going!")
                .type(NotificationType.STREAK_REMINDER).build());

        notificationRepository.save(Notification.builder()
                .userId(lala.getId()).communityId(techCommunity.getId())
                .title("🎯 Upcoming: Spring Boot 3.x Workshop")
                .message("Don't miss the 'Spring Boot 3.x Advanced Patterns' workshop happening in 5 days! 5 people have already registered.")
                .type(NotificationType.EVENT_REMINDER).build());

        notificationRepository.save(Notification.builder()
                .userId(kamran.getId()).communityId(aiHub.getId())
                .title("🤖 Hackathon Registration Open!")
                .message("The Computer Vision Hackathon is in 12 days! Teams of 3-5 needed. Your NLP and Computer Vision skills would be perfect. Register now!")
                .type(NotificationType.EVENT_REMINDER).build());

        notificationRepository.save(Notification.builder()
                .userId(elvin.getId()).communityId(techCommunity.getId())
                .title("⚠️ Your streak is fading!")
                .message("Hey Elvin, it's been 10 days since your last check-in. Your 5-day streak has ended. A quick check-in today could start a new one!")
                .type(NotificationType.RE_ENGAGEMENT).sentByAi(true).build());

        notificationRepository.save(Notification.builder()
                .userId(nigar.getId()).communityId(designCommunity.getId())
                .title("📋 Your Portfolio Review Event")
                .message("Your 'UI/UX Portfolio Review Night' has 3 registrations so far. Consider sharing it on social media to boost attendance!")
                .type(NotificationType.EVENT_REMINDER).build());

        notificationRepository.save(Notification.builder()
                .userId(aysel.getId()).communityId(aiHub.getId())
                .title("🔥 14-Day Streak — Amazing!")
                .message("Aysel, your 14-day streak at Baku AI & Data Hub is remarkable! You're one of the most consistent members. Keep going!")
                .type(NotificationType.STREAK_REMINDER).build());

        // ================== ADVERTISEMENTS (5 skill-targeted ads) ==================
        advertisementRepository.save(Advertisement.builder()
                .communityId(techCommunity.getId())
                .title("Senior Java/Spring Boot Developer — AzFinTech")
                .description("Join Azerbaijan's leading fintech company! We need experienced Java developers for our microservices platform. Remote-friendly, competitive salary, stock options. 3+ years experience required.")
                .targetSkills("Java,Spring Boot,Microservices,PostgreSQL")
                .companyName("AzFinTech").contactEmail("careers@azfintech.az")
                .adType("JOB").expiresAt(LocalDateTime.now().plusDays(30)).build());

        advertisementRepository.save(Advertisement.builder()
                .communityId(aiHub.getId())
                .title("AI/ML Research Intern — BakuAI Labs")
                .description("6-month paid internship in our AI research lab. Work on real NLP and computer vision projects with published researchers. Ideal for final-year students or recent graduates.")
                .targetSkills("AI,ML,Python,NLP,Computer Vision")
                .companyName("BakuAI Labs").contactEmail("intern@bakuai.az")
                .adType("INTERNSHIP").expiresAt(LocalDateTime.now().plusDays(60)).build());

        advertisementRepository.save(Advertisement.builder()
                .communityId(startupClub.getId())
                .title("Angel Investment: EdTech Startup — LearnAZ")
                .description("Seed round open for LearnAZ, an EdTech platform bringing adaptive learning to Azerbaijani students. Target: $200K. Traction: 5,000 monthly active users. Looking for strategic angels.")
                .targetSkills("Investment,Finance,Startup,EdTech")
                .companyName("LearnAZ").contactEmail("invest@learnaz.com")
                .adType("INVESTMENT").expiresAt(LocalDateTime.now().plusDays(45)).build());

        advertisementRepository.save(Advertisement.builder()
                .communityId(techCommunity.getId())
                .title("DevOps Engineer — Cloud Infrastructure Team")
                .description("Build and maintain cloud infrastructure on AWS/GCP. Kubernetes, Terraform, and CI/CD pipeline expertise required. Join a team that deploys 50+ times per day.")
                .targetSkills("DevOps,AWS,Kubernetes,Terraform,CI/CD")
                .companyName("ScaleUp Solutions").contactEmail("jobs@scaleup.az")
                .adType("JOB").expiresAt(LocalDateTime.now().plusDays(25)).build());

        advertisementRepository.save(Advertisement.builder()
                .communityId(designCommunity.getId())
                .title("UI/UX Designer — Product Team")
                .description("Design beautiful, user-centered interfaces for our mobile banking app. Figma expertise, design system experience, and user research skills valued. Hybrid work in Baku.")
                .targetSkills("UI/UX Design,Figma,Mobile Design")
                .companyName("NeoBank AZ").contactEmail("design@neobank.az")
                .adType("JOB").expiresAt(LocalDateTime.now().plusDays(20)).build());

        log.info("✅ Database seeded successfully!");
        log.info("   → 12 users, 4 communities, 28 memberships");
        log.info("   → 20+ streaks, 6 badges, 10 badge awards");
        log.info("   → 8 events, 30+ attendances");
        log.info("   → 8 notifications, 5 advertisements");
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
