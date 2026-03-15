# 🫀 CommunityPulse

> Tech community health monitoring & engagement platform

## Problem
Tech communities are fragile. Most don't survive past their first year due to engagement decay, silent members, and lack of health signals for organizers.

## Solution  
CommunityPulse uses **Duolingo-style streaks** and **psychological notification triggers** (based on Nir Eyal's "Hooked" framework) to keep community members active and engaged. It provides organizers with real-time health analytics and AI-powered recommendations.

## Key Features
- 🔥 **Streak System** — Duolingo-style daily check-ins with streak continuation/reset logic
- 🧠 **Psychological Notifications** — Emotional triggers for re-engagement (FOMO, loss aversion, social proof)
- 📊 **Community Health Dashboard** — Real-time analytics with weighted health score (0-100)
- 🤖 **AI Recommendations** — Powered by Google Gemini 2.5 Flash for community health analysis
- 🏅 **Gamification** — Badges, points, and leaderboards to drive engagement
- 📢 **Smart Advertising** — Skill-matched job, internship, and investment ads

## Tech Stack
- **Language**: Java 17
- **Framework**: Spring Boot 3.2.5
- **Database**: H2 (in-memory with data seeding)
- **Security**: Spring Security + JWT (jjwt 0.12.5)
- **AI**: Google Gemini 2.5 Flash API
- **Build**: Maven
- **Scheduling**: Spring Scheduler (daily notification job)

## How to Run
```bash
# Clone
git clone https://github.com/huseynzulfuqarov/young-developer.git

# Navigate
cd young-developer/CommunityPulse

# Run
mvn spring-boot:run

# API Base URL
http://localhost:8080

# H2 Console
http://localhost:8080/h2-console
```

## Default Credentials
| Username | Password | Role |
|----------|----------|------|
| admin | Admin123! | ADMIN |
| shahriyar | User123! | ORGANIZER |
| agshin | User123! | ORGANIZER |
| lala | User123! | MEMBER |
| tarlan | User123! | MEMBER |
| ali | User123! | MEMBER |
| kamal | User123! | MEMBER |
| kamran | User123! | MEMBER |

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get JWT |

### Communities
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/communities` | Create community |
| GET | `/api/communities` | List all |
| GET | `/api/communities/{id}` | Get details |
| PUT | `/api/communities/{id}` | Update (owner) |
| POST | `/api/communities/{id}/join` | Join |
| DELETE | `/api/communities/{id}/leave` | Leave |
| GET | `/api/communities/{id}/members` | List members |

### Streaks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/streaks/checkin/{communityId}` | Daily check-in |
| GET | `/api/streaks/{communityId}` | My streak |
| GET | `/api/streaks/{communityId}/all` | All streaks |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | My notifications |
| GET | `/api/notifications/unread-count` | Unread count |
| PUT | `/api/notifications/{id}/read` | Mark as read |
| PUT | `/api/notifications/read-all` | Mark all read |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/events` | Create event |
| GET | `/api/events/community/{id}` | Community events |
| POST | `/api/events/{id}/attend` | Register |
| GET | `/api/events/{id}/attendees` | Attendees |

### Dashboard & Leaderboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/{communityId}` | Community analytics |
| GET | `/api/leaderboard/{communityId}` | Streak leaderboard |
| GET | `/api/leaderboard/{communityId}/points` | Points leaderboard |

### Advertisements
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/advertisements` | Create ad |
| GET | `/api/advertisements/community/{id}` | Community ads |
| GET | `/api/advertisements/relevant` | Skill-matched ads |
| PUT | `/api/advertisements/{id}` | Update ad |
| DELETE | `/api/advertisements/{id}` | Deactivate ad |

### AI (Gemini)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/recommendations/{communityId}` | AI health recommendations |
| POST | `/api/ai/generate-notification/{communityId}` | Generate psychological notification |
| POST | `/api/ai/analyze-member/{communityId}/{userId}` | Member engagement analysis |

## Health Score Formula
```
healthScore = (activeMembers/totalMembers × 40) + 
              (avgEventAttendance/totalMembers × 20) + 
              (avgStreak/30 × 20) + 
              (championMembers/totalMembers × 20)
```

## Team
- **Young Developers**

## Hackathon
Build with AI Hackathon — Track 01: Community Building Tools
