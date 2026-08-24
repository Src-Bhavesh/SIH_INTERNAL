# ResQVerse PRO v2.1 - Enhanced Edition

## What Changed from v2.0 (User Feedback: "under table doesn't make sense")

### 🔧 Fixed Under-Table Mechanic (Major)
**Before:** Just crouch near table = safe (unrealistic)
**Now:**
- **Visual:** Tables have legs + open space underneath, player actually slides under
- **Mechanic:** Press **S** to SLIDE under, then **HOLD E** to grip table legs
- **Hold Bar:** Green/yellow bar shows grip strength (0-100%)
- **Real Physics:** If not holding, table slides away during quake and debris hits you!
- **Animation:** Player on knees, holding legs, covering head - like real DROP COVER HOLD ON
- **Tutorial:** Popup "HOLD E TO GRIP!" + bounce arrow when quake starts

### 🗺️ More Details & Levels (3-4 Zones Each)

**Earthquake - Now 5200px, 5 Phases, 3 Zones:**
- **Zone 1 Classroom (0-1450):** 6 school desks + teacher desk, practice slide+hold
- **Door Quiz Gate:** Must answer quiz to unlock library
- **Zone 2 Library (1450-3050):** 5 bookshelves that FALL during quake, 6 library tables, need to crawl between covers
- **Aftershock Phase:** Second quake, must stay under!
- **Zone 3 Theatre (3050-5200):** Stage, cracks in floor (avoid!), final exit
- **Details:** Ceiling debris with shadow warning, books falling, cracks glow red, dust particles, lights flicker, NPCs to rescue

**Fire - Now 5600px, 5 Phases, 3 Floors:**
- **Floor 2 (0-1100):** Alarm, smoke starts, learn crawl
- **Door Check Mechanic:** Press E near door - if RED/HOT, damage if open! Cool=green safe
- **Extinguisher Aiming:** HOLD E + A/D to aim spray at base of fire (PASS method), limited uses (3)
- **Floor 1 (1500-2500):** 2 students trapped, panic bar, need rescue
- **Ground (3000-5600):** Final escape, 9 fires total, 4 extinguishers
- **Details:** Ladders to climb (E), smoke overlay from top (0-420px), sprinklers visual, fire intensity, spray particles, mask/blanket badges

**Tsunami - Now 6200px, 4 Phases, 4 Zones:**
- **Zone 1 Beach (0-1000):** Ocean receding warning, low platforms
- **Zone 2 Market (1000-2500):** Floating crates/logs move with water, need to jump over
- **Zone 3 Hillside (2500-4150):** Steep climb, faster water, sprint needed
- **Zone 4 Mountain Temple (4150-6200):** Final high ground at 60px height, need all 5 kits
- **Details:** Water rises 680→negative, wave line with foam, debris floats and hurts, ladders (4), quiz gates, zone indicator, debris warning

### 🧠 More Questions
**Before:** 2 quizzes per disaster, 1 random at end
**Now:**
- **6 quizzes per disaster** (18 total) covering real guidelines
- **In-game quiz gates:** Doors locked until you answer correctly (2-3 per level)
- **Final exam:** 3 random questions sequential at end, 150 points each
- **Topics:** HOLD ON reason, bookshelves, cracks, PASS method, elevator, STOP DROP ROLL, receding ocean, high ground height, floating debris, deep ocean boats, etc.

### 🎮 More Movement
- **Earthquake:** Slide under (S) + Hold (E) + Crawl between tables + Avoid cracks
- **Fire:** Crawl belly (S) + Cover mouth (auto) + Door check (E) + Aim extinguisher (HOLD E + A/D) + Climb ladders (E)
- **Tsunami:** Sprint (SHIFT) + Duck under beams (S) + Climb ladders (E) + Jump over logs + Avoid floating debris

### 📊 Longer Timers
- Earthquake: 3:00 (was 2:00)
- Fire: 3:20
- Tsunami: 3:40

### File Changes
- config.js: 6 quizzes each, 5/4 phases, detailed objectives
- player.js: crawlHeight, slidingUnder, holding, holdStrength, climbing, coverMouth, isFullyProtected()
- earthquake.js: 5200px, bookshelves fall, cracks, doors with quiz, NPCs, shadow warning for debris
- fire.js: 5600px, door hot/cool, extinguisher aiming with spray particles, ladders, panic bar, smoke 420px
- tsunami.js: 6200px, 4 zones, floating debris, ladders, 5 badges, water faster
- main.js: 3-question final exam, badge totals dynamic, enhanced result screen

## How to Play New Mechanics
**Under Table (Earthquake):**
1. Go near desk
2. Press **S** → you slide under, see green highlight
3. **HOLD E** → grip legs, bar fills to 100%
4. Keep holding until shaking stops! If release, table slides!

**Door Check (Fire):**
1. Near door press **E**
2. If RED + "HOT!" → don't go! Find other path
3. If GREEN "COOL ✓" → safe

**Extinguisher:**
1. Press **E** near red canister to pick
2. Near fire, **HOLD E** + press **A/D** to aim left/right
3. Spray hits base, intensity decreases, fire out!

**Ladders (Fire/Tsunami):**
- Near ladder press **E** to climb fast

All fixes make sense now - real survival techniques!
