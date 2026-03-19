# CommunityPulse — GitHub Copilot Master Prompt

## FIRST TASK: Create Memory Context File

Before writing ANY code, create a file called `PROJECT_CONTEXT.yaml` in the project root. This is your **memory notebook**. Every time you generate new code, READ this file first so you don't create conflicts with existing code. Update it after every major change.

```yaml
# PROJECT_CONTEXT.yaml — AI Memory Notebook
# READ THIS FILE BEFORE WRITING ANY CODE. UPDATE IT AFTER EVERY CHANGE.

project_name: CommunityPulse
description: "Tech community health monitoring & engagement platform with Duolingo-style streak system and psychological retention notifications"
tech_stack:
  language: Java 17
  framework: Spring Boot 3.2.x
  build_tool: Maven
  database: H2 (in-memory, with data seeding)
  auth: Spring Security + JWT (jjwt 0.12.x)
  ai: Google Gemini 2.5 Flash (API key in .env)
  api_style: RESTful JSON
  validation: Jakarta Validation (Bean Validation)

security_requirements:
  - JWT authentication on all endpoints except /api/auth/**
  - BCrypt password encoding
  - Input validation on ALL DTOs (no raw entity exposure)
  - Parameterized queries only (NO string concatenation in queries)
  - CORS configured for localhost:3000 and localhost:5173
  - Rate limiting on auth endpoints
  - No hardcoded credentials anywhere (use application.properties or .env)
  - CSRF disabled (stateless JWT API)

code_quality_rules:
  - SOLID principles strictly followed
  - Every class has single responsibility
  - Constructor injection only (NO @Autowired on fields)
  - DTOs for ALL request/response (never expose entities directly)
  - Custom exceptions with @ControllerAdvice global handler
  - No empty catch blocks
  - No unused imports or variables
  - No commented-out code
  - Proper logging with SLF4J
  - Meaningful variable and method names

existing_entities: []
existing_endpoints: []
existing_services: []
# ^ UPDATE THESE LISTS AS YOU BUILD
```

---

## PROJECT SETUP

Generate a Spring Boot project with the following exact configuration:

### pom.xml Dependencies
```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.5</version>
</parent>

<properties>
    <java.version>17</java.version>
</properties>

<dependencies>
    <!-- Core -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>

    <!-- Database -->
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.12.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.12.5</version>
        <scope>runtime</scope>
    </dependency>

    <!-- HTTP Client for Gemini API -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-webflux</artifactId>
    </dependency>

    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>

    <!-- Scheduling for notifications -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-quartz</artifactId>
    </dependency>
</dependencies>
```

### application.properties
```properties
spring.application.name=CommunityPulse

# H2 Database
spring.datasource.url=jdbc:h2:mem:communitypulse
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# JPA
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=false
spring.jpa.defer-datasource-initialization=true

# Data Seeding
spring.sql.init.mode=never

# JWT
jwt.secret=communitypulse-jwt-secret-key-that-is-at-least-256-bits-long-for-hs256
jwt.expiration=86400000

# Gemini AI
gemini.api.key=AIzaSyDZS5UiwbHOiY9u-GMWC_MY9KyPchMdawM
gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent

# Server
server.port=8080
```

---

## PACKAGE STRUCTURE

```
src/main/java/com/communitypulse/
├── CommunityPulseApplication.java
├── config/
│   ├── SecurityConfig.java
│   ├── CorsConfig.java
│   └── WebClientConfig.java
├── security/
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   └── CustomUserDetailsService.java
├── entity/
│   ├── User.java
│   ├── Community.java
│   ├── CommunityMembership.java
│   ├── Streak.java
│   ├── Notification.java
│   ├── Event.java
│   ├── EventAttendance.java
│   ├── Badge.java
│   ├── UserBadge.java
│   └── Advertisement.java
├── enums/
│   ├── Role.java                  (ADMIN, ORGANIZER, MEMBER)
│   ├── MemberStatus.java          (ACTIVE, AT_RISK, CHURNED, CHAMPION)
│   ├── NotificationType.java      (STREAK_REMINDER, RE_ENGAGEMENT, EVENT_REMINDER, ACHIEVEMENT)
│   └── BadgeType.java             (COMMUNITY_FOUNDER, EVENT_MASTER, STREAK_WARRIOR, RISING_STAR, CONNECTOR)
├── repository/
│   ├── UserRepository.java
│   ├── CommunityRepository.java
│   ├── CommunityMembershipRepository.java
│   ├── StreakRepository.java
│   ├── NotificationRepository.java
│   ├── EventRepository.java
│   ├── EventAttendanceRepository.java
│   ├── BadgeRepository.java
│   ├── UserBadgeRepository.java
│   └── AdvertisementRepository.java
├── dto/
│   ├── request/
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── CreateCommunityRequest.java
│   │   ├── CreateEventRequest.java
│   │   └── CreateAdvertisementRequest.java
│   └── response/
│       ├── AuthResponse.java
│       ├── UserResponse.java
│       ├── CommunityResponse.java
│       ├── DashboardResponse.java
│       ├── StreakResponse.java
│       ├── NotificationResponse.java
│       ├── LeaderboardResponse.java
│       ├── MemberAnalyticsResponse.java
│       └── AiRecommendationResponse.java
├── service/
│   ├── AuthService.java
│   ├── UserService.java
│   ├── CommunityService.java
│   ├── StreakService.java
│   ├── NotificationService.java
│   ├── EventService.java
│   ├── BadgeService.java
│   ├── AdvertisementService.java
│   ├── GamificationService.java
│   ├── AnalyticsService.java
│   └── GeminiAiService.java
├── controller/
│   ├── AuthController.java
│   ├── CommunityController.java
│   ├── MemberController.java
│   ├── StreakController.java
│   ├── NotificationController.java
│   ├── EventController.java
│   ├── DashboardController.java
│   ├── LeaderboardController.java
│   ├── AdvertisementController.java
│   └── AiController.java
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   ├── BadRequestException.java
│   └── UnauthorizedException.java
├── scheduler/
│   └── StreakNotificationScheduler.java
└── seed/
    └── DataSeeder.java
```

---

## ENTITY DEFINITIONS

### User.java
```
Fields:
- id: Long (auto-generated)
- username: String (unique, not blank, 3-50 chars)
- email: String (unique, valid email)
- password: String (BCrypt encoded)
- fullName: String (not blank)
- role: Role enum (ADMIN, ORGANIZER, MEMBER)
- profileImageUrl: String (nullable)
- bio: String (nullable, max 500 chars)
- skills: String (comma-separated, nullable)
- createdAt: LocalDateTime
- lastLoginAt: LocalDateTime
- enabled: boolean (default true)
```

### Community.java
```
Fields:
- id: Long
- name: String (unique, not blank)
- description: String (max 1000 chars)
- category: String (TECH, AI, CYBERSECURITY, DEVOPS, STARTUP, etc.)
- ownerUserId: Long (FK to User)
- logoUrl: String (nullable)
- createdAt: LocalDateTime
- isActive: boolean (default true)
```

### CommunityMembership.java
```
Fields:
- id: Long
- userId: Long (FK)
- communityId: Long (FK)
- joinedAt: LocalDateTime
- lastActiveAt: LocalDateTime
- status: MemberStatus enum (ACTIVE, AT_RISK, CHURNED, CHAMPION)
- totalPoints: int (default 0)
- Unique constraint on (userId, communityId)
```

### Streak.java
```
Fields:
- id: Long
- userId: Long (FK)
- communityId: Long (FK)
- currentStreak: int (default 0)
- longestStreak: int (default 0)
- lastCheckInDate: LocalDate
- streakStartDate: LocalDate
- totalCheckIns: int (default 0)
```

### Notification.java
```
Fields:
- id: Long
- userId: Long (FK, target user)
- communityId: Long (FK, nullable)
- title: String
- message: String (max 500 chars)
- type: NotificationType enum
- isRead: boolean (default false)
- createdAt: LocalDateTime
- sentByAi: boolean (default false)
```

### Event.java
```
Fields:
- id: Long
- communityId: Long (FK)
- title: String
- description: String
- eventDate: LocalDateTime
- eventType: String (ONLINE, OFFLINE, HYBRID)
- maxAttendees: int
- createdByUserId: Long (FK)
- createdAt: LocalDateTime
```

### EventAttendance.java
```
Fields:
- id: Long
- eventId: Long (FK)
- userId: Long (FK)
- registeredAt: LocalDateTime
- attended: boolean (default false)
```

### Badge.java
```
Fields:
- id: Long
- name: String (unique)
- description: String
- iconUrl: String
- badgeType: BadgeType enum
- requiredPoints: int
```

### UserBadge.java
```
Fields:
- id: Long
- userId: Long (FK)
- badgeId: Long (FK)
- earnedAt: LocalDateTime
- communityId: Long (FK)
```

### Advertisement.java
```
Fields:
- id: Long
- communityId: Long (FK)
- title: String
- description: String (max 1000 chars)
- targetSkills: String (comma-separated, e.g. "Java,Python,AI")
- companyName: String
- contactEmail: String
- adType: String (JOB, INTERNSHIP, RESOURCE, INVESTMENT)
- isActive: boolean (default true)
- createdAt: LocalDateTime
- expiresAt: LocalDateTime
```

---

## API ENDPOINTS

### Auth Controller — `/api/auth`
```
POST /api/auth/register     — Register new user (public)
POST /api/auth/login        — Login and get JWT token (public)
```

### Community Controller — `/api/communities`
```
POST   /api/communities              — Create community (ADMIN, ORGANIZER)
GET    /api/communities              — List all communities
GET    /api/communities/{id}         — Get community details
PUT    /api/communities/{id}         — Update community (owner only)
POST   /api/communities/{id}/join    — Join community (authenticated)
DELETE /api/communities/{id}/leave   — Leave community (authenticated)
GET    /api/communities/{id}/members — List community members
```

### Streak Controller — `/api/streaks`
```
POST /api/streaks/checkin/{communityId}   — Daily check-in (increments streak)
GET  /api/streaks/{communityId}           — Get my streak for a community
GET  /api/streaks/{communityId}/all       — Get all streaks for leaderboard
```

### Notification Controller — `/api/notifications`
```
GET   /api/notifications              — Get my notifications
GET   /api/notifications/unread-count — Get unread count
PUT   /api/notifications/{id}/read    — Mark as read
PUT   /api/notifications/read-all     — Mark all as read
```

### Event Controller — `/api/events`
```
POST   /api/events                    — Create event
GET    /api/events/community/{id}     — List events for community
POST   /api/events/{id}/attend        — Register for event
GET    /api/events/{id}/attendees     — List attendees
```

### Dashboard Controller — `/api/dashboard`
```
GET /api/dashboard/{communityId}      — Get community dashboard analytics
```
Response should include:
- healthScore (0-100)
- totalMembers
- activeMembers
- atRiskMembers
- churnedMembers
- championMembers
- engagementRate (percentage)
- totalEvents
- averageAttendance
- streakLeaderboard (top 10)
- memberGrowthData (last 6 months)
- recentNotifications

### Leaderboard Controller — `/api/leaderboard`
```
GET /api/leaderboard/{communityId}           — Streak leaderboard
GET /api/leaderboard/{communityId}/points    — Points leaderboard
```

### Advertisement Controller — `/api/advertisements`
```
POST /api/advertisements                     — Create ad (ADMIN, ORGANIZER)
GET  /api/advertisements/community/{id}      — List ads for community
GET  /api/advertisements/relevant            — Get ads matching my skills
PUT  /api/advertisements/{id}                — Update ad
DELETE /api/advertisements/{id}              — Deactivate ad
```

### AI Controller — `/api/ai`
```
POST /api/ai/recommendations/{communityId}           — Get AI recommendations for community health
POST /api/ai/generate-notification/{communityId}      — Generate psychological notification message
POST /api/ai/analyze-member/{communityId}/{userId}    — Analyze specific member engagement
```

---

## CORE BUSINESS LOGIC

### 1. Streak System (Duolingo-Style)

#### Check-in Logic (`StreakService.checkIn`):
```
1. Get user's streak record for the community
2. If lastCheckInDate == today → return "already checked in today"
3. If lastCheckInDate == yesterday → currentStreak++ (streak continues)
4. If lastCheckInDate < yesterday → currentStreak = 1 (streak broken, restart)
5. If no record exists → create new streak with currentStreak = 1
6. Update longestStreak = max(longestStreak, currentStreak)
7. Update lastCheckInDate = today
8. totalCheckIns++
9. Award points: 10 per check-in + (currentStreak * 2) bonus
10. Check for badge eligibility
11. Update member status based on activity
```

#### Member Status Logic:
```
- CHAMPION: checked in 3+ times in last 7 days
- ACTIVE: checked in at least once in last 7 days
- AT_RISK: last check-in was 8-30 days ago
- CHURNED: last check-in was 30+ days ago (or never)
```

### 2. Psychological Notification System

#### Notification Scheduler (`StreakNotificationScheduler`):
Runs every day at 20:00 (8 PM). For each community member:

```
IF user checked in today → skip
IF user has streak > 0 AND missed today:
    → Send STREAK_REMINDER with emotional urgency message
    → Use Gemini AI to generate personalized message based on:
       - User's streak length
       - User's name
       - Days since last activity
       
IF user has been inactive 3-7 days:
    → Send emotional re-engagement notification
    → Tone: "We miss you", "Your community needs you"
    
IF user has been inactive 7-14 days:
    → Send FOMO-based notification
    → Tone: "Look what you're missing", "X events happened without you"
    
IF user has been inactive 14-30 days:
    → Send last-resort notification  
    → Tone: "Your streak was X days, don't let it die", "Your friends are active"
```

#### Example Notification Messages (HARDCODED FALLBACKS if AI fails):
```java
STREAK_REMINDER messages = [
    "🔥 {name}, your {streak}-day streak is about to break! Don't let it die!",
    "😢 {name}, your community hasn't seen you today... Your streak is at risk!",
    "💪 {name}, champions don't skip days! Check in to keep your {streak}-day streak alive!",
    "🏆 You're only {diff} days away from beating your record of {longest}! Don't stop now!",
    "😭 Your community misses you, {name}! Come back and say hi!"
]

RE_ENGAGEMENT messages = [
    "👋 Hey {name}, it's been {days} days. Your community still remembers you!",
    "🤝 {name}, {active_count} members are active right now. They'd love to see you!",
    "🎯 {name}, new events are happening in your community. Don't miss out!",
    "💔 Your {streak}-day streak was legendary. Want to start a new one?",
    "🚀 {name}, your skills are needed! The community has {new_posts} new discussions."
]
```

### 3. Gemini AI Integration (`GeminiAiService`)

Use WebClient to call Gemini API. Three use cases:

#### a) Community Health Recommendations
```
Prompt template:
"You are a community management expert. Analyze this tech community data and provide 5 specific, actionable recommendations to improve engagement:

Community: {name}
Total Members: {total}
Active Members: {active}
At Risk Members: {atRisk}
Churned Members: {churned}
Engagement Rate: {rate}%
Average Event Attendance: {attendance}
Current Health Score: {score}/100

Respond in JSON format:
{
  "recommendations": [
    {"priority": "HIGH/MEDIUM/LOW", "title": "...", "description": "...", "expectedImpact": "..."}
  ],
  "overallAssessment": "..."
}"
```

#### b) Psychological Notification Generation
```
Prompt template:
"Generate a personalized, emotionally compelling push notification to re-engage a community member. Use psychological principles from the book 'Hooked' by Nir Eyal (trigger → action → variable reward → investment cycle).

Member name: {name}
Days inactive: {days}
Previous streak: {streak}
Community name: {community}
Active friends count: {friends}

Rules:
- Max 2 sentences
- Use emoji
- Create urgency or FOMO
- Make it personal
- Do NOT be generic

Respond in JSON: {"title": "...", "message": "...", "emotionalTrigger": "..."}"
```

#### c) Member Analysis
```
Prompt for analyzing a specific member's engagement pattern and suggesting retention strategies.
```

### 4. Health Score Calculation (`AnalyticsService`)
```
healthScore = (
    (activeMembers / totalMembers * 40) +          // 40% weight: member activity
    (avgEventAttendance / totalMembers * 20) +      // 20% weight: event participation
    (avgStreak / 30 * 20) +                         // 20% weight: streak consistency
    (championMembers / totalMembers * 20)           // 20% weight: power users
)
Clamp between 0-100.
```

### 5. Advertisement Matching (`AdvertisementService`)
```
Match ads to users based on:
- User's skills field matched against ad's targetSkills
- User's community membership
- Ad type preference
Return sorted by relevance score
```

### 6. Gamification Points System
```
Actions and points:
- Daily check-in: 10 points
- Streak bonus: currentStreak * 2 points
- Event attendance: 50 points
- First event creation: 100 points  
- Invite member (future): 25 points

Badge thresholds:
- STREAK_WARRIOR: 7+ day streak
- EVENT_MASTER: Attended 5+ events
- COMMUNITY_FOUNDER: Created a community
- RISING_STAR: 500+ total points
- CONNECTOR: Member of 3+ communities
```

---

## DATA SEEDER (`DataSeeder.java`)

Implement `CommandLineRunner` to seed initial data on startup:

```
Users (8 users):
- admin / admin@communitypulse.com / Admin123! (ADMIN)
- shahriyar / shahriyar@example.com / User123! (ORGANIZER)
- agshin / agshin@example.com / User123! (ORGANIZER)
- lala / lala@example.com / User123! (MEMBER, skills: "Investment,Finance")
- tarlan / tarlan@example.com / User123! (MEMBER, skills: "DevOps,AWS,Cloud")
- ali / ali@example.com / User123! (MEMBER, skills: "AI,Cursor,Startup")
- kamal / kamal@example.com / User123! (MEMBER, skills: "Java,Spring Boot,Backend")
- kamran / kamran@example.com / User123! (MEMBER, skills: "AI,ML,Python")

Communities (2):
- "Azerbaijan Tech Community" (category: TECH, owner: shahriyar)
- "Baku AI Hub" (category: AI, owner: agshin)

Memberships: All users are members of "Azerbaijan Tech Community"
             kamran, ali, tarlan are also in "Baku AI Hub"

Streaks (varied):
- shahriyar: 15 day streak
- lala: 8 day streak  
- tarlan: 3 day streak
- ali: 22 day streak (highest)
- kamal: 0 (churned, last active 35 days ago)
- kamran: 1 (just returned)

Events (3):
- "Intro to AI Tools" (OFFLINE, past, 6 attendees)
- "Cloud Architecture Workshop" (ONLINE, past, 4 attendees)
- "Startup Pitch Night" (HYBRID, future date)

Badges (5 predefined):
- STREAK_WARRIOR, EVENT_MASTER, COMMUNITY_FOUNDER, RISING_STAR, CONNECTOR

Notifications (5 sample):
- Mix of streak reminders, re-engagement, achievement notifications

Advertisements (3):
- Job posting for Java Developer (targetSkills: "Java,Spring Boot")
- Internship for AI Research (targetSkills: "AI,ML,Python")
- Investment opportunity for startup community
```

---

## SECURITY IMPLEMENTATION

### SecurityConfig.java
```
- Stateless session management
- BCryptPasswordEncoder bean
- Endpoint security:
  - PERMIT: /api/auth/**, /h2-console/**, /swagger-ui/**, /v3/api-docs/**
  - AUTHENTICATED: everything else
- Add JwtAuthenticationFilter before UsernamePasswordAuthenticationFilter
- Disable CSRF (stateless API)
- Enable CORS
- Frame options disabled (for H2 console)
```

### JwtTokenProvider.java
```
- Generate token with username as subject, role as claim
- Token expiration: 24 hours
- Validate token method
- Get username from token method
- Use HS256 algorithm with secret from properties
```

### JwtAuthenticationFilter.java (extends OncePerRequestFilter)
```
- Extract JWT from Authorization header (Bearer token)
- Validate token
- Set SecurityContext authentication
- Skip filter for /api/auth/** paths
```

---

## GLOBAL EXCEPTION HANDLER

### GlobalExceptionHandler.java (`@RestControllerAdvice`)
```java
Handle:
- ResourceNotFoundException → 404
- BadRequestException → 400
- UnauthorizedException → 401
- MethodArgumentNotValidException → 400 (validation errors with field details)
- AccessDeniedException → 403
- Exception (generic) → 500

Response format:
{
    "timestamp": "2026-03-15T12:00:00",
    "status": 404,
    "error": "Not Found",
    "message": "Community not found with id: 5",
    "path": "/api/communities/5"
}
```

---

## CRITICAL RULES FOR CODE GENERATION

1. **NEVER** expose entity objects directly in API responses. ALWAYS use DTOs.
2. **NEVER** use field injection (`@Autowired`). Use constructor injection.
3. **NEVER** concatenate strings in SQL/JPQL queries. Use parameterized queries.
4. **NEVER** store plain text passwords. Always BCrypt.
5. **NEVER** hardcode the JWT secret or API keys in Java files. Use application.properties.
6. **NEVER** leave empty catch blocks. Log the exception or rethrow.
7. **NEVER** create unused methods, imports, or variables.
8. **ALWAYS** validate input with `@Valid` and Jakarta annotations.
9. **ALWAYS** use `Optional` properly (no `.get()` without `.isPresent()` check, prefer `.orElseThrow()`).
10. **ALWAYS** add proper Javadoc comments on service methods.
11. **ALWAYS** return proper HTTP status codes (201 for creation, 204 for deletion, etc.).
12. **ALWAYS** use `ResponseEntity<>` as return type in controllers.
13. **ALWAYS** log important operations with SLF4J (`@Slf4j` from Lombok).
14. **ALWAYS** update PROJECT_CONTEXT.yaml after creating each class.

---

## BUILD ORDER — Follow This Exact Sequence

```
Phase 1: Foundation (DO FIRST)
  1. pom.xml
  2. application.properties  
  3. CommunityPulseApplication.java
  4. All entity classes
  5. All enum classes
  6. All repository interfaces

Phase 2: Security
  7. JwtTokenProvider.java
  8. CustomUserDetailsService.java
  9. JwtAuthenticationFilter.java
  10. SecurityConfig.java
  11. CorsConfig.java

Phase 3: Exception Handling
  12. Custom exception classes
  13. GlobalExceptionHandler.java

Phase 4: DTOs
  14. All request DTOs
  15. All response DTOs

Phase 5: Services (Business Logic)
  16. AuthService.java
  17. UserService.java  
  18. CommunityService.java
  19. StreakService.java
  20. NotificationService.java
  21. GamificationService.java
  22. EventService.java
  23. AnalyticsService.java
  24. AdvertisementService.java
  25. GeminiAiService.java
  26. BadgeService.java

Phase 6: Controllers
  27. All controller classes (one at a time)

Phase 7: Scheduler & Seeder
  28. StreakNotificationScheduler.java
  29. DataSeeder.java
  30. WebClientConfig.java

Phase 8: Final
  31. Update PROJECT_CONTEXT.yaml with all classes
  32. Test all endpoints
```

---

## README.md TEMPLATE (Generate at the end)

```markdown
# 🫀 CommunityPulse

> Tech community health monitoring & engagement platform

## Problem
Tech communities are fragile. Most don't survive past their first year due to engagement decay, silent members, and lack of health signals for organizers.

## Solution  
CommunityPulse uses **Duolingo-style streaks** and **psychological notification triggers** (based on Nir Eyal's "Hooked" framework) to keep community members active and engaged. It provides organizers with real-time health analytics and AI-powered recommendations.

## Key Features
- 🔥 Streak System (Duolingo-style daily check-ins)
- 🧠 Psychological Notifications (emotional triggers for re-engagement)
- 📊 Community Health Dashboard (real-time analytics)
- 🤖 AI Recommendations (powered by Google Gemini 2.5 Flash)
- 🏅 Gamification (badges, points, leaderboard)
- 📢 Smart Advertising (skill-matched job/internship/investment ads)

## Tech Stack
- Java 17 + Spring Boot 3.2
- H2 Database (in-memory)
- Spring Security + JWT
- Google Gemini 2.5 Flash API
- Maven

## How to Run
1. Clone: `git clone <repo-url>`
2. Navigate: `cd CommunityPulse`
3. Run: `./mvnw spring-boot:run`
4. API: `http://localhost:8080`
5. H2 Console: `http://localhost:8080/h2-console`

## Default Credentials
- Admin: `admin` / `Admin123!`

## API Documentation
[List all endpoints here]

## Team
- [Your team member names here]

## Hackathon
Build with AI Hackathon — Track 01: Community Building Tools
```
