# BEAST MODE LEVEL X

## Current State
Full self-improvement gaming web app with:
- Navbar (Login/Logout/Settings gear icon, Profile button, Dungeon/Gate/Character buttons)
- AccountSettingsModal (Login ID, Reset Progress, Logout, Delete Account) -- opened via gear icon in navbar
- Multiple sections: Hero, Trainers, Challenges, Martial Arts, Dungeon, Gates, Camera, Dashboard, etc.
- Mobile bottom bar with DUNGEON + GATES buttons
- Various bugs: account settings hard to find on mobile, some sections overflow on mobile, mobile nav crowded

## Requested Changes (Diff)

### Add
- A dedicated **Account Panel section** in the main page (after hero or near footer) that shows Login/Logout/Reset/Delete buttons clearly, visible on both mobile and desktop -- not just hidden in gear icon
- On mobile: a floating or fixed "Account" button that opens the AccountSettingsModal, clearly visible
- Guest info callout (for logged-out users) explaining what they need to login for

### Modify
- Navbar mobile: reduce crowding -- when logged in, consolidate into cleaner layout; add logout button directly visible (not just in hamburger)
- AccountSettingsModal: ensure all 4 options (Login ID, Reset, Logout, Delete) are always visible and properly working
- MartialArtsSection grid: fix the `gridTemplateColumns: "360px 1fr"` which causes overflow on mobile (should be `1fr` on mobile, 2-col on desktop)
- Footer area: add a small Account Quick Actions bar (Login/Logout/Reset/Delete) visible at all times
- All section paddings: use `clamp()` to prevent overflow on small screens
- Mobile bottom bar: add a 3rd button for Account/Settings so it's always reachable

### Remove
- Nothing to remove

## Implementation Plan
1. Fix MartialArtsSection grid overflow (replace hardcoded 360px with responsive CSS)
2. Add Account Quick Actions bar in App.tsx below the Gate section or near footer -- shows Login button (when logged out) or Logout + Reset + Delete (when logged in)
3. Add Account button to mobile bottom bar (3 buttons: DUNGEON, GATES, ACCOUNT)
4. Fix any other overflow/clamp issues found in components
5. Ensure Navbar mobile is clean and all key actions visible
6. Validate and deploy
