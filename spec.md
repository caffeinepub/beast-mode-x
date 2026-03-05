# BEAST MODE X

## Current State
Full self-improvement gaming app with:
- Internet Identity auth, onboarding flow, player profiles
- Daily/Weekly/Monthly missions with XP rewards and penalty system
- 6 anime AI trainers, Martial Arts Dojo, Habit Tracker, Skill Tree
- Leaderboard, rank badges, achievement system, level-up animations
- No Guest ID / Login ID display
- No account management (delete/reset)
- No camera-based exercise tracking

## Requested Changes (Diff)

### Add
- **Guest ID / Login ID panel**: Show the player's Principal ID (truncated + copy button) in Navbar and Profile. For logged-in users show "Login ID", for guests show "Guest ID".
- **Account Settings modal**: Accessible from Navbar/Profile with:
  - Display full Principal ID with copy button
  - "Reset Progress" option: resets XP, level, missions to zero (keeps profile)
  - "Delete Account" option: fully deletes the player's backend profile (with confirmation)
  - "Logout" button
- **Camera Workout Tracker**: New section/page "CAM TRACKER" that:
  - Opens device camera using browser MediaDevices API
  - Uses TensorFlow.js PoseNet/MoveNet or MediaPipe Pose to detect body pose in real-time
  - Displays live camera feed with skeleton overlay (detected keypoints drawn on canvas)
  - Detects exercises: Push-ups, Sit-ups, Squats, Jumping Jacks based on pose angles
  - Shows rep counter per exercise with live count
  - Shows which exercise is currently being performed (auto-detect from pose)
  - Shows real-time stats: reps completed, calories estimated, time elapsed
  - "End Session" button: calculates XP earned from reps, calls completeMission or a direct XP award, shows summary
  - Camera permission prompt with friendly UI
  - Works on mobile (rear/front camera toggle)

### Modify
- **Navbar**: Add "ID" button that opens Account Settings modal. Show truncated Principal ID next to username when logged in.
- **Player Dashboard**: Show Login ID / Principal ID in profile card.
- **Backend**: Add `deletePlayer` and `resetPlayerProgress` functions.

### Remove
- Nothing removed.

## Implementation Plan
1. **Backend**: Add `deletePlayer()` and `resetPlayerProgress()` methods to main.mo
2. **Frontend - Account Settings Modal**: New `AccountSettingsModal.tsx` with ID display, copy, reset, delete, logout
3. **Frontend - Camera Tracker**: New `CameraTracker.tsx` section using:
   - `@tensorflow-models/pose-detection` with MoveNet (lightweight, works in browser)
   - `@tensorflow/tfjs-backend-webgl`
   - Canvas overlay for skeleton drawing
   - Angle-based rep counting for push-ups/squats/sit-ups/jumping jacks
   - XP calculation and award on session end
4. **Navbar update**: Add ID button + Account Settings trigger
5. **App.tsx update**: Add CameraTracker section, AccountSettings modal state
