# BEAST MODE X

## Current State
A cyberpunk self-improvement gaming app with:
- Hero section, Player Dashboard, Daily Missions, Habit Tracker, Skill Tree, Quotes, Leaderboard, Features, Footer
- Auth via Internet Identity, player registration, XP system, achievement badges, rank badges
- Backend: PlayerProfile with stats, XP, level, achievements, skillPoints
- XP only added via `addXP` function manually (not tied to mission completion)
- No onboarding flow after login
- No AI trainers
- No martial arts training module
- No profile view page for other players
- No categorized trainer system

## Requested Changes (Diff)

### Add
- **Onboarding Flow**: After login/registration, show a multi-step form asking: age, gender, body type, goals, fitness level, preferred training style, and motivation. Store in profile.
- **AI Trainer System**: Multiple anime-style trainers, each specializing in a category (Fitness, Martial Arts, Study/Intelligence, Meditation/Focus, Discipline, Mindset). Male and female trainer characters. Each trainer has a name, character description, specialty, and dialogue style.
- **Martial Arts Training Module**: AI trainer gives daily martial arts tasks (strikes, stances, katas, conditioning drills). Completing tasks gives XP and levels up martial arts skill.
- **Mission Completion XP Gate**: XP is ONLY awarded when a mission is marked as completed (not freely addable). Backend function `completeMission(missionId)` validates and awards XP.
- **Mission System**: Each mission belongs to a trainer/category. Daily missions generated per category. Mark complete to earn XP.
- **Level Progression (Solo Leveling style)**: Level thresholds increase exponentially. Each level requires more XP. Level milestones unlock new trainers or abilities.
- **Profile Page**: Public-facing player profile showing: avatar style, level, rank badge, stats, achievements, title, XP progress. Viewable by others.
- **Player Bio / Onboarding Data**: Store age, gender, goals, fitness level in profile.
- **Trainer Dialogue**: Each trainer has motivational messages, mission briefings, and completion responses stored as text content in frontend.
- **Rank/Title System**: Expanded ranks with titles beyond the existing 5 (e.g., Shadow Hunter, Iron Will, Dragon Fist, Awakened One, etc.)
- **Category-based XP**: XP split into categories (Fitness XP, INT XP, Focus XP, Martial XP, etc.) contributing to overall level.

### Modify
- **registerPlayer**: Accept additional fields: age, gender, goal, fitnessLevel, bodyType.
- **PlayerProfile**: Add fields: age, gender, goal, fitnessLevel, bodyType, completedMissions, martialArtsLevel, martialArtsXP, categoryXP (per category).
- **addXP**: Replace free `addXP` with `completeMission(missionId, category)` that validates and grants XP.
- **getPlayerProfile**: Return full enriched profile with onboarding data.
- **Leaderboard**: Show top 10 players with username, level, rank title, and total XP.
- **App routing**: Add pages/views: Onboarding, Trainer Hub, Martial Arts Training, Public Profile.

### Remove
- Free `addXP` call from frontend (still keep in backend for admin use, but frontend only uses `completeMission`)

## Implementation Plan

### Backend
1. Expand `PlayerProfile` type with: age, gender, goal, fitnessLevel, bodyType, martialArtsLevel, martialArtsXP, completedMissions (array of text IDs), categoryXP record (fitness, intel, focus, martial, discipline, mindset).
2. Update `registerPlayer` to accept full onboarding data.
3. Add `completeMission(missionId: Text, category: Text, xpReward: Nat)` -- checks mission not already completed, awards XP, updates category XP, levels up.
4. Add `getMissionCompletions()` query returning completed mission IDs for caller.
5. Add `getPublicProfile(player: Principal)` query for viewing other players' profiles.
6. Keep `getLeaderboard`, `unlockAchievement`, `updateStats`.
7. Level formula: level = floor(sqrt(totalXP / 100)) + 1, so each level needs progressively more XP.

### Frontend
1. **Onboarding Modal/Page**: Multi-step form after first login -- collects age, gender, goals, fitness level, body type. Calls updated `registerPlayer`.
2. **Trainer Hub Page/Section**: Grid of anime-style trainer cards. Each trainer: name, specialty, gender, character art (generated image), catchphrase. Click trainer to open their mission board.
3. **AI Trainer Chat Panel**: Each trainer has pre-written dialogue for missions, encouragement, and completion. Simulated AI feel with typewriter text effect.
4. **Martial Arts Training Section**: Dedicated section with kata/drill missions from the Martial Arts trainer. Progress bar for martial arts level. Animated strike/stance icons.
5. **Mission Board per Trainer**: Each trainer shows 3-5 daily missions. Complete mission button -> calls `completeMission` -> awards XP -> trainer responds with completion dialogue.
6. **Updated Dashboard**: Show category XP bars (Fitness, Martial, Intel, Focus, Discipline, Mindset), overall level, rank title.
7. **Public Profile Page**: Route `/profile/:username` showing player card with all stats, achievements, rank, title.
8. **Expanded Rank/Title system**: 10 ranks with anime-style titles.
9. **Solo Leveling style level up animation**: Screen flash + "LEVEL UP" overlay when level increases.
