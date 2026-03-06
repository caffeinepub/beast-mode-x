# BEAST MODE LEVEL X

## Current State
- Turn-based RPG battle system (Dragon Quest inspired) exists in `PokemonBattle.tsx`
- `AnimeBattleScene.tsx` renders 2D battle scene: player bottom-left, enemy top-right
- `BattleHUD.tsx` shows HP/MP bars and 4 attack card buttons + Potion + Flee in bottom row
- `GameStore.ts` holds `ATTACK_CARDS` pool + `CLASS_ATTACK_CARDS` per class (6 classes), unlimited card pool
- `getBestCards()` in PokemonBattle auto-selects best 4 cards based on game level
- Attack animations: player lunges right, enemy shakes left on hurt; attack line crosses screen
- Enemy attacks animate back to player
- `ClassSelectionScreen.tsx` shows 6 classes with preview moves

## Requested Changes (Diff)

### Add
- **Skill Inventory Page** (`SkillInventoryPage.tsx`) — standalone page accessible from dungeon splash
  - Shows ALL unlocked attacks (all cards player has earned via level-up)
  - 6 equipped slots at top — drag or tap to assign any unlocked card to a slot
  - Cards shown with: icon, name, damage, mana cost, rarity color, level requirement
  - "Equipped" badge on cards currently in slots
  - Filter tabs: All / Free / Rare / Epic / Legendary
  - Back button to return to dungeon splash
- **Skill unlock system in GameStore** — track which attacks player has unlocked (by level)
  - `unlockedSkills: string[]` — skill IDs unlocked so far
  - `equippedSkills: string[]` — array of 6 skill IDs (max 6 equipped)
  - `unlockSkill(id)`, `equipSkill(slotIndex, skillId)`, `unequipSkill(slotIndex)` actions
  - On level-up (in `awardKill`), auto-unlock new skills for that level
  - Initial: unlock first 2 skills at level 1
- **Dragon Quest command menu in BattleHUD** — replace current 6-button row with proper DQ-style menu
  - Bottom-left corner: command panel with "Fight" / "Skills" / "Items" / "Flee"
  - "Fight" = basic attack using first free-cost card
  - "Skills" = opens skill sub-menu showing 6 equipped skills (tap to use)
  - "Items" = shows potions from inventory
  - "Flee" = flee battle
  - Skills sub-menu shows card name, damage, MP cost, use button
- **Enhanced attack animations** — character movement when attacking
  - Player attacks: character sprite visually rushes toward enemy, hits, jumps back
  - Enemy attacks: enemy sprite rushes toward player, hits, returns
  - Hit effect: big flash + screen shake + sparks at hit location
  - Each attack type has a colored energy effect matching its class color
- **Level-up skill notification** — when player levels up, show "NEW SKILL UNLOCKED!" banner
  with the skill name and icon

### Modify
- `PokemonBattle.tsx` — add "SKILLS" button to splash screen alongside Inventory/Character buttons
- `BattleHUD.tsx` — replace 6-button row with Dragon Quest command menu system
- `AnimeBattleScene.tsx` — enhance attack animations with character movement (rush forward/back)
- `GameStore.ts` — add `unlockedSkills`, `equippedSkills`, unlock/equip actions; auto-unlock on levelup

### Remove
- Nothing removed; old 6-button layout replaced by DQ command menu

## Implementation Plan
1. Update `GameStore.ts`: add `unlockedSkills`, `equippedSkills` state + actions + auto-unlock in `awardKill`
2. Create `SkillInventoryPage.tsx`: full-screen page with slot grid at top + all-skills list below, tap to equip/unequip
3. Update `BattleHUD.tsx`: Dragon Quest style command menu (Fight/Skills/Items/Flee), skills sub-menu with 6 equipped cards
4. Update `AnimeBattleScene.tsx`: add `playerRushing`, `enemyRushing` states + CSS keyframe animations for charge/hit/return movement
5. Update `PokemonBattle.tsx`: pass equipped skills to BattleHUD, add SKILLS nav button in splash screen, route to `SkillInventoryPage`
6. Add level-up detection + new skill unlock notification toast/banner
