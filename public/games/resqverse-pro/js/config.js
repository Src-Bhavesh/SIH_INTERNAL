export const DISASTERS = {
  earthquake: {
    id: 'earthquake',
    name: 'EARTHQUAKE',
    subtitle: 'Natural Disaster - Multi-Zone Survival',
    location: 'City School Complex',
    icon: '🏚️',
    color: '#ff6a2a',
    bg: '#1a0f0a',
    description: 'A 7.8 magnitude earthquake hits your school! 3 zones: Classroom → Library → Theatre. Learn real DROP, COVER, HOLD ON with proper under-table mechanics!',
    objectives: [
      '🎮 A/D Move, W/SPACE Jump, S = Slide UNDER table, HOLD E to grip table legs',
      '🛡️ When shaking: SLIDE under desk (S), then HOLD (E) so you don\'t get thrown!',
      '📚 3 ZONES: Classroom (learn), Library (bookshelves fall), Theatre (final escape)',
      '💀 Debris has SHADOW warning - move! Tables protect you only if you HOLD ON',
      '🧠 4 in-game quizzes - answer to unlock doors!',
      '🚪 After quake, check for gas leak, help injured, reach EXIT'
    ],
    phases: [
      { name: 'Zone 1: Classroom - Learn', duration: 20, message: 'CLASSROOM: Find desks! Practice: Press S to SLIDE UNDER, then HOLD E to grip legs!' },
      { name: 'Zone 1: QUAKE!', duration: 15, message: 'EARTHQUAKE! DROP! SLIDE UNDER! HOLD E! Don\'t let go!' },
      { name: 'Zone 2: Library - Danger', duration: 25, message: 'LIBRARY: Bookshelves will topple! Stay under tables! Crawl between covers!' },
      { name: 'Zone 2: Aftershock', duration: 12, message: 'AFTERSHOCK! Stay covered! Hold on tighter!' },
      { name: 'Zone 3: Theatre Evacuation', duration: 40, message: 'EVACUATE! Check doors, avoid cracks, help NPC, reach EXIT!' }
    ],
    quizzes: [
      {
        q: "What is the CORRECT way to take cover under a table during earthquake?",
        options: ["Just stand near table", "Slide UNDER, crouch on knees, HOLD table legs tightly", "Hide on top of table", "Run outside while holding table"],
        correct: 1,
        explain: "Real technique: SLIDE under, get on knees, cover head with one hand, HOLD table legs with other hand so table doesn't slide away! We simulate HOLD with E key."
      },
      {
        q: "Why must you HOLD ON to table legs during quake?",
        options: ["For fun", "Earthquake can slide table away, leaving you exposed", "To lift table", "No reason"],
        correct: 1,
        explain: "Violent shaking slides furniture! If you don't hold, table moves and debris hits you. Always HOLD ON until shaking stops!"
      },
      {
        q: "Where is SAFEST in classroom during earthquake?",
        options: ["Near windows to see outside", "Under sturdy desk away from bookshelves", "In doorway", "Under ceiling fan"],
        correct: 1,
        explain: "Under sturdy desk, away from windows, bookshelves, and lights. Doorways are NOT safer in modern buildings!"
      },
      {
        q: "After earthquake stops, what should you check FIRST?",
        options: ["Your phone", "For injuries, gas leaks, and aftershocks before moving", "Run immediately", "Open all windows"],
        correct: 1,
        explain: "Check yourself for injuries, then help others, check for gas leak/smell, watch for aftershocks. Then evacuate calmly!"
      },
      {
        q: "What should you do if you are in LIBRARY and bookshelves start falling?",
        options: ["Try to catch them", "Stay under table, cover head, hold on - don't run", "Run between shelves", "Stand still"],
        correct: 1,
        explain: "Never run near falling shelves! Stay under sturdy table, it protects you. Running = hit by books/debris!"
      },
      {
        q: "You see a large CRACK in floor after quake. What do you do?",
        options: ["Jump over it quickly", "Avoid it - it may be unstable, find alternate path", "Step on it to test", "Ignore"],
        correct: 1,
        explain: "Cracks mean structure weakened! Avoid, find alternate safe path. Floor may collapse!"
      }
    ]
  },
  fire: {
    id: 'fire',
    name: 'FIRE',
    subtitle: 'Building Fire - 3 Floor Escape',
    location: 'Sunrise School - 3 Floors',
    icon: '🔥',
    color: '#ff3b3b',
    bg: '#1a0f0a',
    description: 'Fire on ground floor! Smoke filling up! 3 floors to escape: Floor 2 → Floor 1 → Ground Exit. Learn crawl, door check, extinguisher aiming!',
    objectives: [
      '🎮 A/D Move, W Jump, S = CRAWL (belly on floor), E = Interact',
      '💨 Smoke: CRAWL low! Cover mouth (auto when crawling). Stand = damage!',
      '🚪 DOOR CHECK: Press E near door - if RED/HOT, don\'t open! Find other way!',
      '🧯 EXTINGUISHER: Press E to pick, then HOLD E + aim with A/D to spray!',
      '🧑‍🤝‍🧑 Rescue 3 students, collect fire blanket, use stairs NOT elevator!',
      '🧠 5 quizzes during escape - answer to unlock next floor!'
    ],
    phases: [
      { name: 'Floor 2: Alarm', duration: 15, message: 'FLOOR 2: Fire alarm! Smoke coming from below! CRAWL (S) and find extinguisher!' },
      { name: 'Floor 2: Thick Smoke', duration: 20, message: 'Smoke thick! Stay on belly! Check door before opening - press E!' },
      { name: 'Floor 1: Rescue', duration: 25, message: 'FLOOR 1: 2 students trapped! Rescue them! Fire spreading!' },
      { name: 'Floor 1: Extinguish', duration: 20, message: 'Use extinguisher: HOLD E + A/D to aim! Put out fire blocking path!' },
      { name: 'Ground: Escape!', duration: 35, message: 'GROUND FLOOR: Final exit! Stay low, avoid flames, reach EXIT!' }
    ],
    quizzes: [
      {
        q: "How should you move in smoke-filled corridor?",
        options: ["Run fast standing up", "Crawl on hands & knees, belly low, cover nose with cloth", "Walk normally", "Hold breath and run"],
        correct: 1,
        explain: "Crawl low! Smoke & heat rise. Clean air near floor. Cover nose with cloth/shirt. This is why we have S=crawl!"
      },
      {
        q: "You touch a door with BACK of hand and it's HOT. What means?",
        options: ["Safe to open", "Fire on other side - DO NOT OPEN! Find alternate exit", "Open quickly", "Kick it"],
        correct: 1,
        explain: "Hot door = fire behind! Don't open - oxygen feeds fire! Find another way. We show RED glow for hot doors!"
      },
      {
        q: "How to use fire extinguisher correctly? (PASS method)",
        options: ["Point anywhere", "Pull pin, Aim low at base of fire, Squeeze, Sweep side to side", "Throw it at fire", "Spray in air"],
        correct: 1,
        explain: "PASS: Pull, Aim at BASE (not flames top), Squeeze, Sweep! We simulate aim with A/D while holding E!"
      },
      {
        q: "Why NEVER use elevator in fire?",
        options: ["It's slow", "Elevator can stop, fill with smoke, become trap - use stairs", "It's for teachers only", "No reason"],
        correct: 1,
        explain: "Elevator shaft acts like chimney - fills with smoke! Can stop between floors! Always use STAIRS!"
      },
      {
        q: "Your clothes catch fire. What do you do?",
        options: ["Run to get help", "STOP, DROP, ROLL to smother flames", "Use water only", "Take clothes off while running"],
        correct: 1,
        explain: "STOP, DROP, ROLL! Running fans flames! Roll to smother fire. Cover face!"
      },
      {
        q: "After escaping building, what should you do?",
        options: ["Go back for bag", "Stay out, call fire dept, go to assembly point, never re-enter", "Watch from near door", "Hide"],
        correct: 1,
        explain: "Stay OUT! Go to assembly point, call 101, never go back inside for belongings! Stuff can be replaced, you can't!"
      }
    ]
  },
  tsunami: {
    id: 'tsunami',
    name: 'TSUNAMI',
    subtitle: 'Ocean Surge - 4 Zone Climb',
    location: 'Coastal Town - Beach to Mountain',
    icon: '🌊',
    color: '#2ab6ff',
    bg: '#0a1a2a',
    description: 'Tsunami warning after earthquake! 4 zones: Beach → Market → Hillside → Mountain Temple. Water rises, debris floats, need to climb!',
    objectives: [
      '🎮 A/D Move, W/SPACE Jump, S = Duck under debris, SHIFT = Sprint, E = Climb ladder',
      '🌊 Water rises faster each zone! Don\'t touch! Floating debris also hurts!',
      '🪜 LADDERS: Press E near ladder to climb quickly!',
      '🎒 Collect 4 kits: Radio, Water, First-aid, Whistle - need all for safe zone!',
      '🪵 Debris: Jump over logs, duck under beams!',
      '🧠 5 quizzes - natural warning signs, high ground, etc.'
    ],
    phases: [
      { name: 'Zone 1: Beach - Run!', duration: 12, message: 'BEACH: Tsunami siren! Water receding is warning! RUN inland! Collect radio!' },
      { name: 'Zone 2: Market - Debris', duration: 20, message: 'MARKET: Water coming! Jump over floating crates! Climb stalls! Use ladders (E)!' },
      { name: 'Zone 3: Hillside - Climb', duration: 25, message: 'HILLSIDE: Steep climb! Water fast! Sprint (SHIFT) + jump! Avoid rolling logs!' },
      { name: 'Zone 4: Mountain Temple', duration: 35, message: 'TEMPLE: Final climb to 100m! Highest safe zone! Need all 4 kits to enter!' }
    ],
    quizzes: [
      {
        q: "At beach, ocean suddenly recedes far exposing sea floor. What is it?",
        options: ["Low tide, good for walk", "Tsunami natural warning - RUN to high ground IMMEDIATELY!", "Normal", "Time to collect shells"],
        correct: 1,
        explain: "Receding ocean = tsunami coming in minutes! Don't go to see! Run inland to high ground FAST! Every second counts!"
      },
      {
        q: "How high should you go for tsunami safety?",
        options: ["2nd floor is enough", "At least 30m (100ft) high or 2km inland, higher is better", "Just a little high", "Any roof"],
        correct: 1,
        explain: "Go at least 30m high or 2km inland! Tsunami can flood low buildings! Mountain/high hill safest!"
      },
      {
        q: "You are in market and water comes with floating debris. What do you do?",
        options: ["Try to grab your things", "Climb to roof/high structure, avoid debris, don't stay in water", "Swim in it", "Hide under table"],
        correct: 1,
        explain: "Climb high! Water + debris = deadly! Debris can crush you! Get to roof, tree, high ground!"
      },
      {
        q: "Tsunami first wave was small. Is it safe to go back to beach?",
        options: ["Yes, it was small", "NO! First wave may not be biggest! Later waves bigger! Stay high for hours!", "Wait 5 mins then go", "Go to see"],
        correct: 1,
        explain: "First wave is often NOT biggest! Waves can come for hours, later ones bigger! Stay high until official all-clear!"
      },
      {
        q: "What should be in tsunami emergency kit?",
        options: ["Only phone", "Radio, water, food, first-aid, whistle, flashlight, documents", "Just money", "Nothing"],
        correct: 1,
        explain: "Kit: battery radio, water, food, first-aid, whistle to signal, flashlight, important docs! We collect these in game!"
      },
      {
        q: "If you are in boat at sea and tsunami warning, what to do?",
        options: ["Return to harbor", "Go to deep ocean (deeper than 150m) - tsunami small in deep water", "Anchor near beach", "Jump out"],
        correct: 1,
        explain: "In boat: go to DEEP ocean! Tsunami wave tiny in deep water but huge in shallow! Don't return to harbor!"
      }
    ]
  }
};

export const PLAYER_CONFIG = {
  width: 26,
  height: 44,
  speed: 4.0,
  sprintSpeed: 6.2,
  jumpForce: 13.5,
  gravity: 0.7,
  maxFall: 14,
  crouchHeight: 22,
  crawlHeight: 16
};
