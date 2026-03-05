# BEAST MODE LEVEL X

## Current State
Full self-improvement gaming app with Pokemon-style turn-based card battle system (PokemonBattle.tsx, AnimeBattleScene.tsx, BattleHUD.tsx, GameStore.ts). The game works on desktop but is cut off / not fully visible on mobile phones. No character customization exists -- all players use the same default blue anime character in battle.

## Requested Changes (Diff)

### Add
- **Character Creator** -- Full character customization screen accessible from the game splash screen and from the main app (Navbar / Profile section)
  - Gender: Male / Female toggle
  - Hair styles: 8+ options (short, long, spiky, ponytail, bun, mohawk, curly, straight)
  - Hair color: 10 options (black, white, blonde, red, blue, purple, green, orange, silver, pink)
  - Skin tone: 6 options (fair, light, medium, tan, brown, dark)
  - Eye color: 8 options (brown, black, blue, green, red, purple, gold, silver)
  - Outfit/class armor: 6 options (Warrior, Mage, Assassin, Berserker, Knight, Shadow)
  - Aura color: 6 options (blue, red, purple, gold, green, white)
  - Accessories: 5 options (none, headband, eyepatch, scar, face paint)
  - All options shown as color swatches or icon buttons with labels
  - Live 2D preview panel showing character with selected customization
  - Character appearance persists in localStorage (CharacterStore)
  - The anime player character in AnimeBattleScene.tsx reads from CharacterStore and renders the correct colors/style

- **Dungeon loot expansion** -- More varied drops in dungeon:
  - New armor types: Iron Armor (+15 def), Shadow Armor (+30 def), Dragon Armor (+60 def)
  - New skill scrolls (material type): Fire Scroll, Thunder Scroll, Ice Scroll -- increase damage bonus
  - More gold drops, gems (material), elixirs (potion)
  - Dungeon boss drops guaranteed rare+ item

### Modify
- **Mobile responsive fixes** -- The entire app is cut off on phones:
  - All sections must use `max-width: 100vw`, `overflow-x: hidden`, `box-sizing: border-box`
  - Navbar: on mobile show only logo + hamburger (already exists but ensure it works)
  - HeroSection: text sizes use `clamp()`, buttons stack vertically on mobile
  - PlayerDashboard, TrainerHub, LeaderboardSection, SkillTree -- all must scroll properly on mobile, no horizontal overflow
  - PokemonBattle splash screen: scrollable on small screens, buttons not cut off
  - BattleHUD: attack cards stack to 2x2 grid that fits within phone screen width, HP bars scale properly
  - AnimeBattleScene: canvas height on mobile = 45vh (not full screen height)
  - All sections: padding reduces on mobile (1rem instead of 2-3rem)
  - index.css / global: add `* { box-sizing: border-box; }` and `body { overflow-x: hidden; }`

- **AnimeBattleScene.tsx**: Player character reads `characterConfig` from CharacterStore -- apply hair color, skin tone, outfit color, aura color to the 3D model meshes

- **Navbar**: Add "CHARACTER" button linking to character creator modal

### Remove
Nothing removed.

## Implementation Plan
1. Create `src/components/game/CharacterStore.ts` -- Zustand store with character config (gender, hair style/color, skin, eyes, outfit, aura, accessory), persisted to localStorage key `bmlx_character_v1`
2. Create `src/components/game/CharacterCreator.tsx` -- full-screen modal/page with all customization options + live 2D CSS preview of character
3. Update `AnimeBattleScene.tsx` -- import CharacterStore, apply colors to player character meshes
4. Update `GameStore.ts` -- expand dungeon loot drops (new armor, skill scrolls, gems, elixirs)
5. Fix mobile responsiveness across ALL major components -- global CSS fix + per-component padding/font-size fixes
6. Update `PokemonBattle.tsx` splash screen -- add "CUSTOMIZE CHARACTER" button
7. Update `Navbar.tsx` -- add CHARACTER nav button (desktop + mobile menu)
