# CommunityPulse Frontend — Copilot Prompt

## 🎯 Objective
Build a **premium, modern, glassmorphism-styled** single-page React frontend for CommunityPulse — a tech community health monitoring & engagement platform. The frontend must connect to an existing Spring Boot REST API running at `http://localhost:8080`. The design must feel like a **world-class SaaS product** — think Linear, Vercel Dashboard, or Raycast aesthetic.

---

## 📁 Project Setup

### Technology Stack
- **Framework**: React 18+ with Vite
- **Language**: JavaScript (JSX)
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Icons**: Lucide React (`lucide-react`)
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast (`react-hot-toast`)
- **Date Formatting**: `date-fns`
- **CSS**: Vanilla CSS only (NO Tailwind, NO CSS modules — use global CSS with BEM naming)

### Project Initialization
```bash
npx -y create-vite@latest ./ -- --template react
npm install axios react-router-dom lucide-react recharts framer-motion react-hot-toast date-fns
```

### Folder Structure
```
src/
├── api/
│   └── axiosConfig.js          # Axios instance with interceptors
├── assets/
│   └── images/                  # Hero images, illustrations
├── components/
│   ├── common/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── GlassCard.jsx
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Badge.jsx
│   │   ├── Loader.jsx
│   │   ├── EmptyState.jsx
│   │   └── Avatar.jsx
│   ├── dashboard/
│   │   ├── HealthScoreGauge.jsx
│   │   ├── MemberStatusChart.jsx
│   │   ├── StreakLeaderboard.jsx
│   │   └── StatsCard.jsx
│   ├── streak/
│   │   ├── StreakCard.jsx
│   │   ├── CheckInButton.jsx
│   │   └── StreakHistory.jsx
│   ├── notifications/
│   │   ├── NotificationList.jsx
│   │   └── NotificationItem.jsx
│   ├── events/
│   │   ├── EventCard.jsx
│   │   └── CreateEventModal.jsx
│   ├── community/
│   │   ├── CommunityCard.jsx
│   │   └── MemberList.jsx
│   ├── ads/
│   │   └── AdCard.jsx
│   └── ai/
│       ├── AiRecommendations.jsx
│       └── MemberAnalysis.jsx
├── context/
│   └── AuthContext.jsx          # JWT auth state management
├── hooks/
│   ├── useAuth.js
│   └── useApi.js
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx
│   ├── CommunitiesPage.jsx
│   ├── CommunityDetailPage.jsx
│   ├── StreakPage.jsx
│   ├── EventsPage.jsx
│   ├── NotificationsPage.jsx
│   ├── LeaderboardPage.jsx
│   ├── AdsPage.jsx
│   ├── AiInsightsPage.jsx
│   └── ProfilePage.jsx
├── styles/
│   ├── index.css                # Global styles, CSS variables, fonts
│   ├── glassmorphism.css        # Glass effect utilities
│   ├── animations.css           # Keyframe animations
│   └── components.css           # Component-specific styles
├── utils/
│   ├── constants.js
│   └── helpers.js
├── App.jsx
└── main.jsx
```

---

## 🎨 Design System — Premium Glassmorphism

### Color Palette (CSS Variables in `:root`)
```css
:root {
  /* Background */
  --bg-primary: #0a0a0f;
  --bg-secondary: #12121a;
  --bg-tertiary: #1a1a2e;

  /* Glass Effect */
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  --glass-blur: blur(20px);

  /* Accent Colors */
  --accent-primary: #6366f1;       /* Indigo */
  --accent-secondary: #8b5cf6;     /* Purple */
  --accent-success: #22c55e;       /* Green */
  --accent-warning: #f59e0b;       /* Amber */
  --accent-danger: #ef4444;        /* Red */
  --accent-info: #06b6d4;          /* Cyan */

  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #6366f1, #8b5cf6);
  --gradient-fire: linear-gradient(135deg, #f97316, #ef4444);
  --gradient-success: linear-gradient(135deg, #22c55e, #06b6d4);
  --gradient-gold: linear-gradient(135deg, #f59e0b, #eab308);
  --gradient-mesh: radial-gradient(at 40% 20%, hsla(240, 100%, 74%, 0.15) 0px, transparent 50%),
                   radial-gradient(at 80% 0%, hsla(289, 100%, 72%, 0.1) 0px, transparent 50%),
                   radial-gradient(at 0% 50%, hsla(355, 85%, 63%, 0.08) 0px, transparent 50%);

  /* Text */
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;

  /* Borders */
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-active: rgba(99, 102, 241, 0.5);

  /* Typography */
  --font-display: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Spacing */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-smooth: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-spring: 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Google Font Import (in index.html `<head>`)
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

### Glassmorphism Card Base Style
```css
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--glass-shadow);
  transition: all var(--transition-smooth);
}

.glass-card:hover {
  border-color: var(--border-active);
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(99, 102, 241, 0.15);
}
```

### Animation Keyframes
```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
  50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); }
}

@keyframes streak-fire {
  0%, 100% { filter: hue-rotate(0deg); }
  50% { filter: hue-rotate(30deg); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

### Design Rules
1. **Body background**: `var(--bg-primary)` with `var(--gradient-mesh)` overlay
2. **All cards**: Use `.glass-card` base — NEVER use solid/opaque backgrounds
3. **All interactive elements**: Must have hover animations (scale, glow, color shift)
4. **Page transitions**: Use Framer Motion `<AnimatePresence>` with fade + slide
5. **Loading states**: Shimmer skeleton loaders, NEVER empty white boxes
6. **Empty states**: Custom illustrations with call-to-action buttons
7. **Scrollbar**: Custom styled thin scrollbar matching theme
8. **Sidebar**: Collapsible, glassmorphism, with active route indicator (glowing pill)
9. **Mobile**: Sidebar becomes bottom tab bar on screens < 768px
10. **All numbers/stats**: Animate counting up with Framer Motion `useSpring`

---

## 🔌 Backend API Integration

### Axios Configuration (`src/api/axiosConfig.js`)
```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 (expired token) globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Auth Context (`src/context/AuthContext.jsx`)
```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        userId: data.userId,
        username: data.username,
        role: data.role,
      }));
      setToken(data.token);
      setUser({ userId: data.userId, username: data.username, role: data.role });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password, fullName, skills) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        username, email, password, fullName, skills,
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        userId: data.userId,
        username: data.username,
        role: data.role,
      }));
      setToken(data.token);
      setUser({ userId: data.userId, username: data.username, role: data.role });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

---

## 📡 Complete API Reference

### All endpoints require JWT token in header (except auth endpoints):
```
Authorization: Bearer <token>
```

### AUTH — No JWT Required
```
POST /api/auth/register
Body: { "username": "str", "email": "str", "password": "str", "fullName": "str", "skills": "str" }
Response: { "token": "jwt", "username": "str", "role": "MEMBER", "userId": 1 }

POST /api/auth/login
Body: { "username": "str", "password": "str" }
Response: { "token": "jwt", "username": "str", "role": "ADMIN", "userId": 1 }
```

### COMMUNITIES — JWT Required
```
GET    /api/communities                     → [{ id, name, description, category, ownerUserId, ownerUsername, logoUrl, createdAt, isActive, memberCount }]
GET    /api/communities/{id}                → { id, name, description, category, ownerUserId, ownerUsername, logoUrl, createdAt, isActive, memberCount }
POST   /api/communities                     → Body: { "name", "description", "category", "logoUrl" }
PUT    /api/communities/{id}                → Body: { "name", "description", "category", "logoUrl" }
POST   /api/communities/{id}/join           → 200 OK (no body)
DELETE /api/communities/{id}/leave          → 204 No Content
GET    /api/communities/{id}/members        → [{ id, username, email, fullName, role, skills, createdAt }]
```

### STREAKS — JWT Required
```
POST /api/streaks/checkin/{communityId}     → { id, userId, username, communityId, currentStreak, longestStreak, lastCheckInDate, streakStartDate, totalCheckIns, message }
GET  /api/streaks/{communityId}             → { id, userId, username, communityId, currentStreak, longestStreak, lastCheckInDate, streakStartDate, totalCheckIns, message }
GET  /api/streaks/{communityId}/all         → [same object as above]
```

### NOTIFICATIONS — JWT Required
```
GET /api/notifications                      → [{ id, userId, communityId, title, message, type, isRead, createdAt, sentByAi }]
GET /api/notifications/unread-count         → { "unreadCount": 3 }
PUT /api/notifications/{id}/read            → 200 OK
PUT /api/notifications/read-all             → 200 OK
```

### EVENTS — JWT Required
```
POST /api/events                            → Body: { "communityId", "title", "description", "eventDate": "2026-03-20T18:00:00", "eventType": "ONLINE", "maxAttendees": 50 }
GET  /api/events/community/{communityId}    → [{ id, communityId, title, description, eventDate, eventType, maxAttendees, createdByUserId, createdAt }]
POST /api/events/{id}/attend                → { id, eventId, userId, attended, registeredAt }
GET  /api/events/{id}/attendees             → [same as above]
```

### DASHBOARD — JWT Required
```
GET /api/dashboard/{communityId}            → {
  healthScore: 61,
  totalMembers: 8,
  activeMembers: 5,
  atRiskMembers: 0,
  churnedMembers: 1,
  championMembers: 3,
  engagementRate: 62.5,
  totalEvents: 2,
  averageAttendance: 5.0,
  streakLeaderboard: [{ rank, userId, username, fullName, currentStreak, longestStreak, totalPoints, totalCheckIns }],
  recentNotifications: [{ id, title, message, type, createdAt }]
}
```

### LEADERBOARD — JWT Required
```
GET /api/leaderboard/{communityId}          → [{ rank, userId, username, fullName, currentStreak, longestStreak, totalPoints, totalCheckIns }]
GET /api/leaderboard/{communityId}/points   → [same structure, sorted by points]
```

### ADS — JWT Required
```
POST   /api/advertisements                  → Body: { "communityId", "title", "description", "targetSkills", "companyName", "contactEmail", "adType", "expiresAt" }
GET    /api/advertisements/community/{id}   → [{ id, communityId, title, description, targetSkills, companyName, contactEmail, adType, expiresAt, isActive, createdAt }]
GET    /api/advertisements/relevant         → [same, sorted by skill match]
PUT    /api/advertisements/{id}             → Body: same as create
DELETE /api/advertisements/{id}             → 204 No Content
```

### AI — JWT Required
```
POST /api/ai/recommendations/{communityId}  → {
  overallAssessment: "string",
  recommendations: [{ priority: "HIGH/MEDIUM/LOW", title: "str", description: "str", expectedImpact: "str" }]
}

POST /api/ai/generate-notification/{communityId}?memberName=Ali&daysInactive=5&previousStreak=10
→ { "title": "str", "message": "str", "emotionalTrigger": "str" }

POST /api/ai/analyze-member/{communityId}/{userId} → {
  userId, username, fullName, status, currentStreak, longestStreak,
  totalPoints, totalCheckIns, eventsAttended, badgesEarned, aiAnalysis: "string"
}
```

### MEMBERS — JWT Required
```
GET /api/members/me                         → { id, username, email, fullName, role, skills, createdAt }
GET /api/members                            → [same]
GET /api/members/{id}                       → same
```

---

## 📄 Page Specifications

### 1. Login Page (`/login`)
- Full-screen gradient background with animated mesh
- Centered glass card with logo, title ("Welcome back"), username/password fields
- "Login" button with gradient and loading spinner
- Link to register
- Show toast on error with `react-hot-toast`
- Redirect to `/dashboard` after login

### 2. Register Page (`/register`)
- Same style as login but with additional fields: fullName, email, skills
- Skills input with tag-style chips
- "Create Account" button
- Redirect to `/dashboard` after register

### 3. Dashboard Page (`/dashboard`) — MAIN PAGE
- **Top row**: 4 StatsCards in a grid:
  - Health Score (circular gauge with animated fill, green/yellow/red based on value)
  - Total Members (with active count badge)
  - Engagement Rate (percentage with trend arrow)
  - Active Streaks (fire emoji 🔥 with count)
- **Middle row**: 2 columns:
  - Left: Member Status Donut Chart (Recharts PieChart with custom labels: CHAMPION=gold, ACTIVE=green, AT_RISK=amber, CHURNED=red)
  - Right: Streak Leaderboard (glass table with rank badges: 🥇🥈🥉 for top 3, animated row entries)
- **Bottom row**: Recent Notifications with glass cards, unread indicator (glowing dot)
- Community selector dropdown at the top of the page

### 4. Communities Page (`/communities`)
- Grid of CommunityCards with hover lift effect
- Each card shows: name, category badge, member count, owner, join/leave button
- "Create Community" floating action button (FAB) with modal
- Search/filter by category

### 5. Community Detail Page (`/communities/:id`)
- Community header with large banner area, name, description, category
- Tab navigation: Overview | Members | Events | Ads
- Overview: Mini dashboard for this community
- Members: Grid with avatars, status badges, point counts
- Events: Timeline-style event cards
- Ads: Skill-matched advertisement cards

### 6. Streak Page (`/streaks`)
- **Big center card**: Current streak number (giant text with fire animation)
  - "Check In" button — large, gradient, with pulse animation
  - After check-in: confetti animation + streak message display
  - If already checked in: button disabled with "✅ Checked in today!"
- Streak stats: Current | Longest | Total Check-ins | Streak Start Date
- Streak calendar visualization (grid of last 30 days, colored by check-in)
- Handle `400 "You have already checked in today!"` response gracefully

### 7. Events Page (`/events`)
- Event cards with date/time, type badge (ONLINE=blue, OFFLINE=purple, HYBRID=gradient)
- "Create Event" button with modal form
- "Attend" button on each event card (disabled if already registered)
- Attendee count / max capacity progress bar
- Handle `400 "already registered"` and `400 "event is full"` errors

### 8. Notifications Page (`/notifications`)
- Notification cards with type-based icons:
  - STREAK_REMINDER → 🔥 fire icon
  - RE_ENGAGEMENT → 💔 heart icon
  - EVENT_REMINDER → 📅 calendar icon
  - ACHIEVEMENT → 🏆 trophy icon
- Unread: highlighted border glow, read: dimmed
- "Mark all as read" button at top
- Click to mark individual as read
- AI-generated badge on sentByAi=true notifications

### 9. Leaderboard Page (`/leaderboard`)
- Toggle: Streak Leaderboard | Points Leaderboard
- Podium visualization for top 3 (gold/silver/bronze with avatars)
- Below podium: glass table with rows 4+
- Each row: rank, avatar, username, streak fire animation, points with coin icon
- Current user's row highlighted with accent border

### 10. Ads Page (`/ads`)
- "For You" section: Skill-matched ads (from `/api/advertisements/relevant`)
- Ad cards: company logo placeholder, title, description, skills tags, contact button
- Type badge: JOB=green, INTERNSHIP=blue, INVESTMENT=gold
- "Create Ad" button (for organizers/admins)

### 11. AI Insights Page (`/ai`)
- Select community dropdown
- **"Get AI Recommendations"** button → shows loading skeleton → reveals recommendation cards
  - Each card: priority badge (HIGH=red, MEDIUM=amber, LOW=green), title, description, expected impact
  - Overall assessment in a highlighted quote card
- **"Analyze Member"** section: Select user from dropdown → AI analysis text in a glass card
- **"Generate Notification"** section: Input fields (memberName, daysInactive, previousStreak) → generated notification preview

### 12. Profile Page (`/profile`)
- User info card: avatar, fullName, username, email, role, skills tags
- My Badges grid (earned badges with emoji icons)
- My Communities list
- Stats summary

---

## ⚠️ Error Handling Rules

### DO:
1. **ALWAYS** use try/catch with axios calls
2. **ALWAYS** show user-friendly toast notifications on errors via `react-hot-toast`
3. **ALWAYS** show loading states (skeleton shimmer) while API calls are pending
4. **ALWAYS** handle specific HTTP status codes:
   - `400` → Show the backend's `message` field from response body
   - `401` → Redirect to login (handled by axios interceptor)
   - `404` → Show "Not Found" empty state
   - `500` → Show "Something went wrong. Please try again."
5. **ALWAYS** disable buttons during API calls to prevent double-click

### DON'T:
1. **NEVER** crash on undefined data — always use optional chaining (`data?.field`)
2. **NEVER** show raw error objects to users
3. **NEVER** make API calls without the JWT token on protected routes
4. **NEVER** forget to update state after a successful mutation (create, update, delete)
5. **NEVER** leave console.log in production code

### Axios Error Pattern:
```javascript
try {
  const { data } = await api.post('/streaks/checkin/1');
  toast.success(data.message || 'Check-in successful! 🔥');
  // update state...
} catch (error) {
  const message = error.response?.data?.message || 'Something went wrong';
  toast.error(message);
}
```

---

## 🛡️ Protected Routes Pattern
```javascript
// In App.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

// Usage in routes:
<Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
```

---

## 📱 Responsive Breakpoints
```css
/* Mobile first */
@media (min-width: 480px)  { /* Small phones */ }
@media (min-width: 768px)  { /* Tablets — sidebar appears */ }
@media (min-width: 1024px) { /* Desktop — full layout */ }
@media (min-width: 1440px) { /* Large screens — wider content */ }
```

### Mobile Specific:
- Sidebar → Bottom tab bar with 5 icons (Dashboard, Communities, Streak, Notifications, Profile)
- Cards → Full width, stack vertically
- Leaderboard podium → Horizontal scroll
- Stats grid → 2 columns instead of 4

---

## 🧩 Key Component Specifications

### GlassCard Component
```jsx
// Props: children, className, hover, glow, padding
// Default: glass-card styles with optional hover lift and glow effect
```

### HealthScoreGauge
- Circular SVG gauge (0-100)
- Color: 0-30=red, 31-60=amber, 61-80=green, 81-100=emerald
- Animated fill on mount (Framer Motion)
- Label inside: score number + "/100"

### CheckInButton
- Large circular button with gradient
- States: ready (pulsing glow) → loading (spinner) → done (checkmark with confetti) → disabled (grayed "✅")
- On success: fire emoji rain animation

### StatsCard
- Glass card with icon, label, and large animated number
- Number counts up from 0 on mount
- Optional trend indicator (↑12% in green or ↓5% in red)

---

## 🎬 Animation Guidelines (Framer Motion)

### Page Transitions
```jsx
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};
// Wrap each page with <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
```

### List Stagger
```jsx
const containerVariants = {
  animate: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};
// Cards, notification items, leaderboard rows — all should stagger in
```

### Micro-interactions
- Buttons: `whileHover={{ scale: 1.02 }}` `whileTap={{ scale: 0.98 }}`
- Cards: `whileHover={{ y: -4 }}`
- Badges: `animate={{ scale: [1, 1.2, 1] }}` on earn

---

## 🔑 Default Test Credentials
| Username | Password | Role |
|----------|----------|------|
| admin | Admin123! | ADMIN |
| shahriyar | User123! | ORGANIZER |
| ali | User123! | MEMBER |

## 🚀 Run Commands
```bash
# Frontend
cd CommunityPulse-frontend
npm run dev
# Runs on http://localhost:5173

# Backend (must be running)
cd CommunityPulse
mvn spring-boot:run
# Runs on http://localhost:8080
```

---

## ✅ Quality Checklist
- [ ] All pages use glassmorphism styling — no solid/opaque backgrounds
- [ ] All API calls have loading, success, and error states
- [ ] Responsive on mobile, tablet, and desktop
- [ ] Framer Motion animations on page transitions and list entries
- [ ] Toast notifications for all user actions
- [ ] JWT automatically attached to all API calls
- [ ] 401 responses redirect to login
- [ ] No console errors or warnings
- [ ] Custom scrollbar styling
- [ ] Smooth micro-animations on interactive elements
- [ ] Health score gauge animates on mount
- [ ] Streak check-in has celebratory animation
- [ ] Leaderboard has podium for top 3
- [ ] AI insights page has loading skeletons
- [ ] Empty states for pages with no data
