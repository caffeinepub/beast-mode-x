# BEAST MODE X

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Full cyberpunk/gaming-themed single-page application
- Hero section with animated particle background, large title "BEAST MODE X", subtitle "Level Up Your Reality", animated glowing CTA button
- Player Dashboard section: player name, level, animated XP bar, SP points, stat grid (STR, SPD, END, INT, FOC, AUR), achievement badges with glow effects
- Features section: cards for Real-time Level System, XP Tracking, Skill Upgrade System, Achievement Unlock System, Daily Missions System
- Leaderboard section: top 10 players with rank, name, XP points
- Authentication: Sign Up modal, Login modal, Logout, user session persisted to backend
- Footer: social links (Twitter/X, Discord, YouTube), tagline "Built for Legends"
- Background music toggle button (persistent UI element)
- Loading animation on initial page load
- Neon glowing border effects, glassmorphism cards, smooth hover animations

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan

### Backend (Motoko)
- User record: principal, username, level, xp, sp, stats (STR/SPD/END/INT/FOC/AUR), achievements (list of badge IDs), createdAt
- `register(username: Text) -> Result<User, Text>` — create new player profile
- `getProfile() -> Result<User, Text>` — get caller's profile
- `updateStats(stats: Stats) -> Result<User, Text>` — update player stats
- `addXP(amount: Nat) -> Result<User, Text>` — add XP, auto level-up logic
- `getLeaderboard() -> [LeaderboardEntry]` — return top 10 by XP
- `unlockAchievement(id: Text) -> Result<User, Text>` — unlock an achievement badge

### Frontend (React + TypeScript)
- Navbar: logo, nav links, login/signup buttons, music toggle, auth state
- Hero section: animated canvas particles, glowing title, animated start button
- Player Dashboard: profile card with glassmorphism, animated XP progress bar, stat bars, achievement badge grid
- Features section: 5 feature cards with icons and neon border hover effects
- Leaderboard section: styled top-10 table/list with rank badges
- Auth modals: login and sign-up forms with glassmorphism style
- Footer: social icon links, tagline
- Loading screen: animated logo reveal on first load
- Background music toggle: floating button, mute/unmute ambient track (no actual audio file needed — UI only with placeholder)
- Global styles: OKLCH neon red + neon purple palette, glassmorphism utilities, glow keyframe animations, Orbitron/Rajdhani fonts
