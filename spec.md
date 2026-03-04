# BEAST MODE X

## Current State

- Full-stack app with Motoko backend and React frontend
- Backend: PlayerProfile (username, level, xp, skillPoints, stats, achievements), addXP, updateStats, unlockAchievement, getLeaderboard, registerPlayer
- Frontend sections: Hero, Dashboard (stats, achievement badges), Features, Leaderboard, Auth (Internet Identity), Footer, Music Toggle, Loading Screen
- Stats: STR, SPD, END, INT, FOC, AUR — generic gaming labels
- Achievement badges exist but are generic/gaming-themed
- Features section lists generic gaming features
- No daily missions, no habit tracker, no skill tree, no motivational quotes, no progress tracking

## Requested Changes (Diff)

### Add
- **Daily Missions System** — 5 self-improvement missions per day (30 min workout, Read 20 pages, Meditate 10 min, No social media 2hr, Sleep by 11 PM). Each mission gives XP on completion. Store completed missions per player per day.
- **Habit Tracker** — Track daily habits with streak counter. Show current streak and best streak per habit.
- **Self Improvement Skill Tree** — 5 categories: Fitness, Mind, Discipline, Knowledge, Social. Skills unlock with XP. Display as a visual tree.
- **Motivational Quotes Section** — Rotating daily motivational quotes with author name.
- **Achievement & Rank Badge System** — 12 self-improvement achievement badges (e.g., First Workout, 7-Day Streak, Mind Master, Iron Discipline, Knowledge Seeker, Social Warrior, etc.) with glowing neon visuals. Plus 5 rank badges based on total XP: Novice, Warrior, Elite, Legend, BEAST.
- **Weekly Progress Summary** — XP gained this week, missions completed, habit streaks.
- Backend: new types for DailyMission, HabitEntry, Skill; new functions: completeMission, updateHabit, unlockSkill, getHabits, getDailyMissions

### Modify
- **Hero Section** — Subtitle changed to "Level Up Your Life" with self-improvement focus copy
- **Player Dashboard** — Stats relabeled: STR→Fitness, SPD→Productivity, END→Discipline, INT→Knowledge, FOC→Focus, AUR→Mindset. Show rank badge prominently.
- **Features Section** — Replace generic gaming features with self-improvement focused ones: Daily Missions, Habit Streaks, Skill Tree, Achievement Badges, XP Progress System
- **Leaderboard** — Show rank badge next to each player. Labels updated to self-improvement context.
- **Footer** — Tagline updated to "Built for Those Who Refuse to Stay the Same"

### Remove
- Nothing removed, only transformed

## Implementation Plan

1. Update Motoko backend:
   - Add DailyMission type with id, title, description, xpReward, completedDates
   - Add Habit type with id, name, currentStreak, bestStreak, lastCompletedDate
   - Add Skill type with id, name, category, xpCost, unlocked
   - Add completeMission(missionId: Nat) function
   - Add updateHabitStreak(habitId: Nat) function  
   - Add unlockSkill(skillId: Nat) function
   - Add getHabits() query function
   - Add getDailyMissions() query function

2. Frontend - New components:
   - DailyMissionsSection.tsx — mission cards with complete button, XP reward display
   - HabitTrackerSection.tsx — habit cards with streak counters, fire emoji streaks
   - SkillTreeSection.tsx — visual skill tree grid by category
   - QuotesSection.tsx — rotating motivational quote card
   - RankBadge.tsx — reusable rank badge component (Novice/Warrior/Elite/Legend/BEAST)
   - AchievementBadges.tsx — 12 self-improvement badges with unlock states

3. Frontend - Modify existing:
   - HeroSection.tsx — update copy to self-improvement theme
   - DashboardSection.tsx — relabel stats, add rank badge, add weekly summary
   - FeaturesSection.tsx — replace feature cards with self-improvement features
   - LeaderboardSection.tsx — add rank badge column
   - Footer.tsx — update tagline
   - App.tsx — add new sections in page layout

4. Generate rank badge and achievement badge images
