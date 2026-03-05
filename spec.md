# BEAST MODE LEVEL X

## Current State
Full self-improvement gaming app with:
- Anime AI trainers (KIRA, RYU, NOVA, ZEN, VEGA, APEX) with missions
- Daily/Weekly/Monthly missions with anti-cheat
- Challenges (28/30/21-day)
- Camera tracker (AI pose detection)
- Player dashboard with rank, XP, stats, achievements
- Music toggle button (no actual audio)
- Hero section with "WATCH TRAILER" button (no video)
- Trainer dialogue in English only
- "Connecting to network, please wait" glitch when actor not ready

## Requested Changes (Diff)

### Add
- Trainer Hindi dialogue: Each trainer now speaks in Hindi (intro + praiseLines all in Hindi)
- Animated trailer modal: "WATCH TRAILER" button opens a fullscreen modal with an embedded YouTube trailer (using a motivational/workout epic video URL like https://www.youtube.com/embed/V7nzjZF0TDc?autoplay=1). Modal has close button, dark overlay, responsive iframe.
- Working ambient music: MusicToggle now uses HTML5 Audio element with a royalty-free epic gaming track from a CDN URL. When playing=true the audio plays, when false it pauses. Volume control slider in the toggle popover.
- New self-improvement sections:
  1. **Sleep Tracker** - Log sleep hours (slider 4-12h), quality (1-5 stars), wake-up time. Show weekly sleep chart (bar chart using CSS). XP for consistent 7-9h sleep. Store in localStorage.
  2. **Nutrition Logger** - Log daily water intake (glasses counter), meals count, calories estimate. Show daily summary. Store in localStorage.
  3. **Mental Health Check-in** - Daily mood rating (1-5 emoji scale), gratitude journal (textarea, 3 items). Motivational response based on mood. Store in localStorage.
  4. **Progress Photos** - Placeholder section showing transformation progress timeline UI with "Before/After" slots, date labels, animated reveal. Uses static placeholder images.
  5. **Body Stats Tracker** - Log weight, body fat %, chest/waist/arm measurements. Show trend line (CSS-based sparkline). Store in localStorage.

### Modify
- Fix "Connecting to network, please wait a moment" glitch: Show a skeleton/loading state for action buttons when actor is not yet ready instead of triggering toast spam. Add a `useActorReady` state that shows a spinner on the button until connected.
- Fix CameraTracker: Ensure the detection loop properly restarts when cameraActive becomes true. Fix the `runDetectionLoop` closure dependency issue. Camera should show live feed without hanging.
- Fix all touch interactions: Ensure all buttons have `touchAction: manipulation`, `WebkitTapHighlightColor: transparent`, minimum 44px touch targets.
- TrainerHub: Add Hindi trainer dialogue for all 6 trainers. Keep English as fallback display. Add a "Trainer Baat Kar Raha Hai" header above dialogue box.
- MusicToggle: Replace placeholder toggle with working HTML5 Audio. Add a royalty-free epic ambient track. Show volume control.
- Hero Section: Connect "WATCH TRAILER" button to open trailer modal.
- Add new sections to App.tsx navigation flow after QuotesSection.

### Remove
- Nothing removed

## Implementation Plan
1. Fix actor-not-ready glitch: in TrainerHub and other action buttons, show loading spinner on button until `actor` is truthy (not toast warning)
2. Add Hindi dialogue to all 6 trainers in TrainerHub.tsx (intro + 3 praiseLines each in Hindi)
3. Fix CameraTracker detection loop restart bug
4. Build TrailerModal component with YouTube embed + HeroSection connect
5. Build working MusicToggle with HTML5 Audio and CDN track URL
6. Build SleepTracker component (localStorage-based)
7. Build NutritionLogger component (localStorage-based)  
8. Build MentalHealthCheckin component (localStorage-based)
9. Build BodyStatsTracker component (localStorage-based)
10. Build ProgressPhotosSection component (visual placeholder)
11. Add all new sections to App.tsx
12. Final touch/interaction audit across all components
