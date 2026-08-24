import { StudentPreparedness, PreparednessScore, Badge, SimulationAttempt, SimulationScore, Drill, DrillReport, EmergencyEvent, Alert, Recommendation, DisasterModule, TimeSeriesDataPoint, DistrictSchoolSummary } from '../types';

// ── Badges ──
export const allBadges: Badge[] = [
  { id: 'badge-fire-ready', name: 'Fire Ready', icon: '🔥', description: 'Completed fire safety module and simulation' },
  { id: 'badge-earthquake-expert', name: 'Earthquake Expert', icon: '🫨', description: 'Scored 90+ in earthquake simulation' },
  { id: 'badge-zero-mistake', name: 'Zero-Mistake Drill', icon: '🎯', description: 'Completed a drill with 100% correct decisions' },
  { id: 'badge-emergency-leader', name: 'Emergency Leader', icon: '🦺', description: 'Helped others during a drill exercise' },
  { id: 'badge-first-responder', name: 'First Responder', icon: '🏅', description: 'Completed all 3 disaster modules' },
  { id: 'badge-flood-aware', name: 'Flood Aware', icon: '🌊', description: 'Completed flood safety module' },
  { id: 'badge-quick-thinker', name: 'Quick Thinker', icon: '⚡', description: 'Average response time under 5 seconds' },
  { id: 'badge-streak-5', name: '5-Day Streak', icon: '🔥', description: 'Completed training 5 days in a row' },
];

// ── Student Preparedness (Clean dynamic state) ──
export const studentPreparedness: Record<string, StudentPreparedness> = {};

// ── Simulation Attempts (Clean dynamic state) ──
export const simulationAttempts: SimulationAttempt[] = [];

// ── Drills ──
export const drills: Drill[] = [
  {
    id: 'drill-001', schoolId: 'school-001', title: 'Fire Evacuation Drill — Block A',
    disasterType: 'fire', buildingId: 'building-a', classIds: ['class-12a', 'class-12b', 'class-11a'],
    scheduledAt: '2026-08-18T10:30:00', startedAt: '2026-08-18T10:30:00', completedAt: '2026-08-18T10:45:00',
    assemblyPointId: 'assembly-a', status: 'completed', createdBy: 'admin-001',
    participants: [
      { userId: 'student-001', name: 'Arjun Mehta', classId: 'class-12a', status: 'safe', responseTimeMs: 134000, arrivedAt: '2026-08-18T10:32:14' },
      { userId: 'student-002', name: 'Simran Kaur', classId: 'class-12a', status: 'safe', responseTimeMs: 128000, arrivedAt: '2026-08-18T10:32:08' },
      { userId: 'student-003', name: 'Rahul Verma', classId: 'class-12a', status: 'safe', responseTimeMs: 185000, arrivedAt: '2026-08-18T10:33:05' },
      { userId: 'student-004', name: 'Neha Gupta', classId: 'class-12a', status: 'safe', responseTimeMs: 121000, arrivedAt: '2026-08-18T10:32:01' },
      { userId: 'student-005', name: 'Amandeep Singh', classId: 'class-12b', status: 'safe', responseTimeMs: 145000, arrivedAt: '2026-08-18T10:32:25' },
      { userId: 'student-006', name: 'Divya Sharma', classId: 'class-12b', status: 'missing', responseTimeMs: undefined },
      { userId: 'student-007', name: 'Karan Dhillon', classId: 'class-11a', status: 'safe', responseTimeMs: 210000, arrivedAt: '2026-08-18T10:33:30' },
      { userId: 'student-008', name: 'Pooja Rani', classId: 'class-11a', status: 'safe', responseTimeMs: 155000, arrivedAt: '2026-08-18T10:32:35' },
    ],
    report: {
      totalParticipants: 128, completed: 121, averageResponseTimeMs: 137000, correctDecisions: 91,
      attendanceVerified: 96, weakestArea: 'Second-floor evacuation', recommendation: 'Conduct targeted fire-evacuation drill for second floor.',
      classBreakdown: [
        { classId: 'class-12a', className: 'XII-A', total: 42, safe: 41, missing: 1, avgResponseTimeMs: 142000 },
        { classId: 'class-12b', className: 'XII-B', total: 40, safe: 37, missing: 3, avgResponseTimeMs: 145000 },
        { classId: 'class-11a', className: 'XI-A', total: 38, safe: 36, missing: 2, avgResponseTimeMs: 130000 },
      ],
    },
  },
  {
    id: 'drill-002', schoolId: 'school-001', title: 'Earthquake Drill — All Buildings',
    disasterType: 'earthquake', buildingId: 'building-a', classIds: ['class-12a', 'class-12b', 'class-11a', 'class-10a', 'class-10b'],
    scheduledAt: '2026-08-10T11:00:00', startedAt: '2026-08-10T11:00:00', completedAt: '2026-08-10T11:20:00',
    assemblyPointId: 'assembly-a', status: 'completed', createdBy: 'admin-001',
    participants: [],
    report: {
      totalParticipants: 200, completed: 193, averageResponseTimeMs: 152000, correctDecisions: 87,
      attendanceVerified: 94, weakestArea: 'Drop-Cover-Hold technique', recommendation: 'Reinforce Drop-Cover-Hold training across all grades.',
      classBreakdown: [
        { classId: 'class-12a', className: 'XII-A', total: 42, safe: 42, missing: 0, avgResponseTimeMs: 130000 },
        { classId: 'class-10a', className: 'X-A', total: 41, safe: 38, missing: 3, avgResponseTimeMs: 168000 },
      ],
    },
  },
];

// ── Emergency Events ──
export const emergencyEvents: EmergencyEvent[] = [
  {
    id: 'emergency-001', schoolId: 'school-001', type: 'fire', severity: 'high',
    buildingId: 'building-b', floorId: 'floor-b-1', title: 'Fire Alert — Block B',
    description: 'Fire detected on the first floor of Block B near the electrical panel.',
    instructions: [
      'Evacuate Block B immediately via Staircase B',
      'Do NOT use elevators',
      'Crawl low if there is smoke',
      'Proceed to Assembly Point B',
      'Teachers: Take roll call immediately upon reaching the assembly point',
    ],
    blockedExits: [],
    assemblyPointId: 'assembly-b', status: 'drill', triggeredAt: '2026-08-23T10:30:00',
    triggeredBy: 'admin-001',
    accountability: {
      totalExpected: 94, accounted: 87, unaccounted: 7,
      byBuilding: [
        {
          buildingId: 'building-b', buildingName: 'Block B',
          classes: [
            { classId: 'class-10a', className: 'X-A', expected: 41, safe: 38, missing: 3, notParticipating: 0 },
            { classId: 'class-10b', className: 'X-B', expected: 39, safe: 36, missing: 3, notParticipating: 0 },
            { classId: 'class-9a', className: 'IX-A', expected: 14, safe: 13, missing: 1, notParticipating: 0 },
          ],
        },
      ],
    },
  },
];

// ── Institutional Disaster Readiness Index ──
export const schoolPreparedness: PreparednessScore = {
  overall: 83,
  level: 'good',
  components: [
    { name: 'Student Preparedness', score: 81, weight: 25, icon: '🎓' },
    { name: 'Teacher Preparedness', score: 88, weight: 15, icon: '👩‍🏫' },
    { name: 'Training Completion', score: 86, weight: 15, icon: '📚' },
    { name: 'Simulation Performance', score: 79, weight: 15, icon: '🎮' },
    { name: 'Drill Performance', score: 82, weight: 15, icon: '🏃' },
    { name: 'Emergency Plan', score: 93, weight: 10, icon: '📋' },
    { name: 'Response Coordination', score: 75, weight: 5, icon: '📡' },
  ],
  weaknesses: [
    { area: 'Fire Evacuation', impact: -11, description: 'Second-floor fire evacuation response is below target' },
    { area: 'Teacher Training', impact: -8, description: '4 teachers have not completed fire safety training' },
    { area: 'Response Coordination', impact: -6, description: 'Assembly point attendance verification is slow' },
    { area: 'Simulation Coverage', impact: -4, description: 'Only 68% students have completed all 3 disaster simulations' },
  ],
  recommendations: [
    'Conduct targeted fire evacuation drill for Block A second floor',
    'Complete teacher fire safety training for remaining 4 teachers',
    'Practice attendance verification process at assembly points',
    'Encourage remaining students to complete all disaster simulations',
  ],
  calculatedAt: '2026-08-23T10:00:00',
};

// ── Preparedness History ──
export const preparednessHistory: TimeSeriesDataPoint[] = [
  { date: '2026-03-01', value: 64, label: 'March' },
  { date: '2026-04-01', value: 68, label: 'April' },
  { date: '2026-05-01', value: 72, label: 'May' },
  { date: '2026-06-01', value: 75, label: 'June' },
  { date: '2026-07-01', value: 78, label: 'July' },
  { date: '2026-08-01', value: 83, label: 'August' },
];

// ── Alerts ──
export const alerts: Alert[] = [
  { id: 'alert-1', type: 'weather', title: 'Heavy Rainfall Advisory', message: 'IMD has issued a heavy rainfall warning for Ludhiana district. Flood preparedness protocols may be activated.', severity: 'warning', createdAt: '2026-08-23T08:00:00', isRead: false },
  { id: 'alert-2', type: 'drill', title: 'Fire Drill Scheduled', message: 'A fire evacuation drill is scheduled for 11:00 AM today for Block B.', severity: 'info', createdAt: '2026-08-23T09:00:00', isRead: false },
  { id: 'alert-3', type: 'training', title: 'New Module Available', message: 'Flood safety module has been updated with new content. Complete it to maintain your preparedness score.', severity: 'info', createdAt: '2026-08-22T14:00:00', isRead: true },
];

// ── Recommendations ──
export const recommendations: Recommendation[] = [
  { id: 'rec-1', targetType: 'student', targetId: 'student-001', title: 'Fire Evacuation Refresher', description: 'Your evacuation-response score is below your knowledge score. Complete the Fire Evacuation Simulation.', priority: 'high', actionType: 'simulation', actionId: 'scenario-fire-01', reason: 'Evacuation decisions scored 80% vs. 100% knowledge', isCompleted: false, createdAt: '2026-08-20T10:00:00' },
  { id: 'rec-2', targetType: 'student', targetId: 'student-003', title: 'Fire Safety Module', description: 'Complete the fire safety module to build foundational knowledge.', priority: 'high', actionType: 'module', actionId: 'mod-fire', reason: 'Student has not completed fire safety training', isCompleted: false, createdAt: '2026-08-20T10:00:00' },
  { id: 'rec-3', targetType: 'school', targetId: 'school-001', title: 'Second Floor Drill', description: 'Conduct targeted fire evacuation drill for Block A second floor.', priority: 'medium', actionType: 'drill', actionId: '', reason: 'Second-floor evacuation response is consistently below target', isCompleted: false, createdAt: '2026-08-18T15:00:00' },
  { id: 'rec-4', targetType: 'student', targetId: 'student-007', title: 'Start Earthquake Module', description: 'Begin with the earthquake safety module to build basic preparedness.', priority: 'high', actionType: 'module', actionId: 'mod-earthquake', reason: 'Student has 0 completed modules', isCompleted: false, createdAt: '2026-08-21T10:00:00' },
];

// ── Disaster Modules ──
export const disasterModules: DisasterModule[] = [
  {
    id: 'mod-earthquake', disasterType: 'earthquake', title: 'Earthquake Safety', description: 'Learn how to protect yourself before, during, and after an earthquake.',
    icon: '🫨', color: '#8B5E3C', isAvailable: true,
    sections: [
      { id: 'eq-overview', title: 'What is an Earthquake?', type: 'overview', content: {
        text: 'An earthquake is a sudden shaking of the ground caused by movement of tectonic plates beneath the Earth\'s surface. Earthquakes can happen anywhere, anytime, and without warning.',
        items: [
          { id: 'eq-o1', text: 'India lies in a seismically active zone — Punjab is in Zone IV (High Damage Risk)', icon: '🗺️' },
          { id: 'eq-o2', text: 'Earthquakes typically last 10-30 seconds but can cause severe damage', icon: '⏱️' },
          { id: 'eq-o3', text: 'Aftershocks can follow the main earthquake for hours or days', icon: '🔄' },
          { id: 'eq-o4', text: 'Most injuries occur from falling objects, not the shaking itself', icon: '⚠️' },
        ],
      }},
      { id: 'eq-dos', title: 'Do\'s and Don\'ts', type: 'dos_donts', content: {
        items: [
          { id: 'eq-do1', text: 'DROP to the ground, take COVER under sturdy furniture, HOLD ON', type: 'do', icon: '✅' },
          { id: 'eq-do2', text: 'Stay away from windows, mirrors, and heavy objects', type: 'do', icon: '✅' },
          { id: 'eq-do3', text: 'If outdoors, move to an open area away from buildings', type: 'do', icon: '✅' },
          { id: 'eq-do4', text: 'After shaking stops, evacuate calmly using stairs', type: 'do', icon: '✅' },
          { id: 'eq-dont1', text: 'Do NOT use elevators during or after an earthquake', type: 'dont', icon: '❌' },
          { id: 'eq-dont2', text: 'Do NOT run during active shaking', type: 'dont', icon: '❌' },
          { id: 'eq-dont3', text: 'Do NOT stand near windows or under heavy shelves', type: 'dont', icon: '❌' },
          { id: 'eq-dont4', text: 'Do NOT re-enter buildings until authorities say it is safe', type: 'dont', icon: '❌' },
        ],
      }},
      { id: 'eq-steps', title: 'Step-by-Step Response', type: 'steps', content: {
        items: [
          { id: 'eq-s1', text: 'DROP — Get down on your hands and knees', type: 'step', order: 1, icon: '1️⃣' },
          { id: 'eq-s2', text: 'COVER — Get under a sturdy desk or table', type: 'step', order: 2, icon: '2️⃣' },
          { id: 'eq-s3', text: 'HOLD ON — Hold the furniture legs until shaking stops', type: 'step', order: 3, icon: '3️⃣' },
          { id: 'eq-s4', text: 'CHECK — Check yourself and others for injuries', type: 'step', order: 4, icon: '4️⃣' },
          { id: 'eq-s5', text: 'EVACUATE — Move to the assembly point via stairs', type: 'step', order: 5, icon: '5️⃣' },
          { id: 'eq-s6', text: 'REPORT — Report to your teacher at the assembly point', type: 'step', order: 6, icon: '6️⃣' },
        ],
      }},
      { id: 'eq-checklist', title: 'Safety Checklist', type: 'checklist', content: {
        items: [
          { id: 'eq-c1', text: 'Know where the nearest sturdy desk/table is', type: 'check', icon: '☑️' },
          { id: 'eq-c2', text: 'Know the evacuation route from your classroom', type: 'check', icon: '☑️' },
          { id: 'eq-c3', text: 'Know the location of your assembly point', type: 'check', icon: '☑️' },
          { id: 'eq-c4', text: 'Know emergency contact numbers', type: 'check', icon: '☑️' },
          { id: 'eq-c5', text: 'Keep emergency kit accessible (if available)', type: 'check', icon: '☑️' },
        ],
      }},
      { id: 'eq-quiz', title: 'Knowledge Check', type: 'quiz', content: {
        questions: [
          { id: 'eq-q1', question: 'What is the correct immediate response when earthquake shaking begins?', options: [
            { id: 'eq-q1a', text: 'Run outside immediately', isCorrect: false },
            { id: 'eq-q1b', text: 'Drop, Cover, and Hold On', isCorrect: true },
            { id: 'eq-q1c', text: 'Stand in a doorway', isCorrect: false },
            { id: 'eq-q1d', text: 'Call emergency services', isCorrect: false },
          ], explanation: 'Drop, Cover, and Hold On is the internationally recommended technique. Do not run during shaking.' },
          { id: 'eq-q2', question: 'After the shaking stops, what should you do FIRST?', options: [
            { id: 'eq-q2a', text: 'Check for injuries and follow evacuation instructions', isCorrect: true },
            { id: 'eq-q2b', text: 'Collect your belongings', isCorrect: false },
            { id: 'eq-q2c', text: 'Take photos of damage', isCorrect: false },
            { id: 'eq-q2d', text: 'Go back to studying', isCorrect: false },
          ], explanation: 'Checking for injuries ensures everyone can evacuate safely. Personal belongings are not a priority.' },
          { id: 'eq-q3', question: 'Why should you NEVER use an elevator during an earthquake?', options: [
            { id: 'eq-q3a', text: 'Elevators are too slow', isCorrect: false },
            { id: 'eq-q3b', text: 'Elevators may get stuck, cables may break, or shafts may fill with debris', isCorrect: true },
            { id: 'eq-q3c', text: 'Elevators make noise', isCorrect: false },
            { id: 'eq-q3d', text: 'Other people might be using them', isCorrect: false },
          ], explanation: 'Earthquakes can damage elevator mechanisms, trapping occupants. Always use staircases.' },
        ],
      }},
    ],
  },
  {
    id: 'mod-fire', disasterType: 'fire', title: 'Fire Safety', description: 'Learn fire prevention, smoke navigation, and safe evacuation procedures.',
    icon: '🔥', color: '#EF4444', isAvailable: true,
    sections: [
      { id: 'fire-overview', title: 'Understanding Fire Emergencies', type: 'overview', content: {
        text: 'Fire can spread extremely rapidly in a school building. Within 2 minutes, a small fire can become life-threatening. Smoke inhalation causes more deaths than burns.',
        items: [
          { id: 'fire-o1', text: 'Fire doubles in size every 60 seconds', icon: '⏰' },
          { id: 'fire-o2', text: 'Smoke inhalation is the #1 cause of fire deaths', icon: '💨' },
          { id: 'fire-o3', text: 'Temperatures at ceiling level can reach 600°C in minutes', icon: '🌡️' },
          { id: 'fire-o4', text: 'You may have less than 2 minutes to evacuate safely', icon: '🏃' },
        ],
      }},
      { id: 'fire-dos', title: 'Do\'s and Don\'ts', type: 'dos_donts', content: {
        items: [
          { id: 'fire-do1', text: 'Alert others and activate the fire alarm if possible', type: 'do', icon: '✅' },
          { id: 'fire-do2', text: 'Crawl low under smoke — clean air is near the floor', type: 'do', icon: '✅' },
          { id: 'fire-do3', text: 'Feel doors before opening — if hot, use alternate route', type: 'do', icon: '✅' },
          { id: 'fire-do4', text: 'Cover nose and mouth with a damp cloth if available', type: 'do', icon: '✅' },
          { id: 'fire-dont1', text: 'Do NOT use elevators during a fire', type: 'dont', icon: '❌' },
          { id: 'fire-dont2', text: 'Do NOT go back for personal belongings', type: 'dont', icon: '❌' },
          { id: 'fire-dont3', text: 'Do NOT open hot doors — fire may be on the other side', type: 'dont', icon: '❌' },
          { id: 'fire-dont4', text: 'Do NOT try to fight large fires — evacuate instead', type: 'dont', icon: '❌' },
        ],
      }},
      { id: 'fire-steps', title: 'Step-by-Step Response', type: 'steps', content: {
        items: [
          { id: 'fire-s1', text: 'ALERT — Shout "Fire!" and activate the fire alarm', type: 'step', order: 1, icon: '1️⃣' },
          { id: 'fire-s2', text: 'ASSESS — Check if your exit path is clear of fire and smoke', type: 'step', order: 2, icon: '2️⃣' },
          { id: 'fire-s3', text: 'EVACUATE — Crawl low, use stairs, follow exit signs', type: 'step', order: 3, icon: '3️⃣' },
          { id: 'fire-s4', text: 'CLOSE — Close doors behind you to slow fire spread', type: 'step', order: 4, icon: '4️⃣' },
          { id: 'fire-s5', text: 'ASSEMBLE — Go to the assembly point and report', type: 'step', order: 5, icon: '5️⃣' },
          { id: 'fire-s6', text: 'CALL — Ensure 101 has been called', type: 'step', order: 6, icon: '6️⃣' },
        ],
      }},
      { id: 'fire-checklist', title: 'Safety Checklist', type: 'checklist', content: {
        items: [
          { id: 'fire-c1', text: 'Know two evacuation routes from your classroom', type: 'check', icon: '☑️' },
          { id: 'fire-c2', text: 'Know the location of the nearest fire extinguisher', type: 'check', icon: '☑️' },
          { id: 'fire-c3', text: 'Know the fire alarm activation points', type: 'check', icon: '☑️' },
          { id: 'fire-c4', text: 'Know your assembly point', type: 'check', icon: '☑️' },
        ],
      }},
      { id: 'fire-quiz', title: 'Knowledge Check', type: 'quiz', content: {
        questions: [
          { id: 'fire-q1', question: 'What is the safest way to move through a smoke-filled corridor?', options: [
            { id: 'fire-q1a', text: 'Run through quickly', isCorrect: false },
            { id: 'fire-q1b', text: 'Crawl low under the smoke', isCorrect: true },
            { id: 'fire-q1c', text: 'Walk upright with eyes closed', isCorrect: false },
            { id: 'fire-q1d', text: 'Hold your breath and walk normally', isCorrect: false },
          ], explanation: 'Smoke and toxic gases rise. The cleanest air is near the floor, so crawl low.' },
        ],
      }},
    ],
  },
  {
    id: 'mod-flood', disasterType: 'flood', title: 'Flood Safety', description: 'Learn how to respond to flooding situations and water-related emergencies.',
    icon: '🌊', color: '#3B82F6', isAvailable: true,
    sections: [
      { id: 'flood-overview', title: 'Understanding Floods', type: 'overview', content: {
        text: 'Punjab experiences significant flooding risks due to its river systems and monsoon rainfall. Flash floods can occur with little warning.',
        items: [
          { id: 'flood-o1', text: '6 inches of moving water can knock you off your feet', icon: '🌊' },
          { id: 'flood-o2', text: 'Flood water is contaminated — never drink or play in it', icon: '☣️' },
          { id: 'flood-o3', text: 'Move UP, not out — go to higher floors, not outside', icon: '⬆️' },
          { id: 'flood-o4', text: 'Flash floods can develop in minutes during heavy rain', icon: '⚡' },
        ],
      }},
      { id: 'flood-dos', title: 'Do\'s and Don\'ts', type: 'dos_donts', content: {
        items: [
          { id: 'flood-do1', text: 'Move to higher floors immediately when warning is given', type: 'do', icon: '✅' },
          { id: 'flood-do2', text: 'Turn off electrical appliances and main switches', type: 'do', icon: '✅' },
          { id: 'flood-do3', text: 'Follow NDRF/SDRF rescue team instructions', type: 'do', icon: '✅' },
          { id: 'flood-do4', text: 'Conserve phone battery for emergency calls', type: 'do', icon: '✅' },
          { id: 'flood-dont1', text: 'Do NOT try to walk or drive through flood water', type: 'dont', icon: '❌' },
          { id: 'flood-dont2', text: 'Do NOT touch electrical equipment during flooding', type: 'dont', icon: '❌' },
          { id: 'flood-dont3', text: 'Do NOT drink flood water', type: 'dont', icon: '❌' },
          { id: 'flood-dont4', text: 'Do NOT return to flooded areas until officially cleared', type: 'dont', icon: '❌' },
        ],
      }},
      { id: 'flood-steps', title: 'Step-by-Step Response', type: 'steps', content: {
        items: [
          { id: 'flood-s1', text: 'LISTEN — Follow school PA announcements', type: 'step', order: 1, icon: '1️⃣' },
          { id: 'flood-s2', text: 'MOVE UP — Go to upper floors immediately', type: 'step', order: 2, icon: '2️⃣' },
          { id: 'flood-s3', text: 'POWER OFF — Do not touch electrical switches if water is nearby', type: 'step', order: 3, icon: '3️⃣' },
          { id: 'flood-s4', text: 'WAIT — Stay on upper floor until rescue arrives', type: 'step', order: 4, icon: '4️⃣' },
          { id: 'flood-s5', text: 'RESCUE — Follow rescue team instructions exactly', type: 'step', order: 5, icon: '5️⃣' },
        ],
      }},
      { id: 'flood-checklist', title: 'Safety Checklist', type: 'checklist', content: {
        items: [
          { id: 'flood-c1', text: 'Know which floor is safe during flooding', type: 'check', icon: '☑️' },
          { id: 'flood-c2', text: 'Know the school\'s flood evacuation procedure', type: 'check', icon: '☑️' },
          { id: 'flood-c3', text: 'Have emergency contact numbers saved', type: 'check', icon: '☑️' },
        ],
      }},
      { id: 'flood-quiz', title: 'Knowledge Check', type: 'quiz', content: {
        questions: [
          { id: 'flood-q1', question: 'During a flood at school, what should you do FIRST?', options: [
            { id: 'flood-q1a', text: 'Try to leave the school immediately', isCorrect: false },
            { id: 'flood-q1b', text: 'Move to upper floors', isCorrect: true },
            { id: 'flood-q1c', text: 'Build barriers with furniture', isCorrect: false },
            { id: 'flood-q1d', text: 'Call your parents', isCorrect: false },
          ], explanation: 'Moving to upper floors is the safest immediate action during flooding. Never try to walk through flood water.' },
        ],
      }},
    ],
  },
  // Placeholder modules for future disasters
  { id: 'mod-cyclone', disasterType: 'cyclone', title: 'Cyclone Safety', description: 'Coming soon — learn cyclone preparedness.', icon: '🌀', color: '#8B5CF6', isAvailable: false, sections: [] },
  { id: 'mod-lightning', disasterType: 'lightning', title: 'Lightning Safety', description: 'Coming soon — learn lightning safety.', icon: '⚡', color: '#F59E0B', isAvailable: false, sections: [] },
  { id: 'mod-heatwave', disasterType: 'heatwave', title: 'Heatwave Safety', description: 'Coming soon — learn heatwave protection.', icon: '🌡️', color: '#F97316', isAvailable: false, sections: [] },
];

// ── District Data ──
export const districtSchools: DistrictSchoolSummary[] = [
  { schoolId: 'school-001', schoolName: 'ABC Public School', district: 'Ludhiana', preparednessScore: 83, studentsTotal: 910, studentsTrained: 823, teachersTrained: 41, drillsCompleted: 8, lastDrillDate: '2026-08-18', riskLevel: 'low' },
  { schoolId: 'school-002', schoolName: 'Government Senior Secondary School', district: 'Ludhiana', preparednessScore: 67, studentsTotal: 1200, studentsTrained: 720, teachersTrained: 35, drillsCompleted: 3, lastDrillDate: '2026-07-10', riskLevel: 'medium' },
  { schoolId: 'school-003', schoolName: 'DAV Public School', district: 'Ludhiana', preparednessScore: 91, studentsTotal: 750, studentsTrained: 710, teachersTrained: 38, drillsCompleted: 12, lastDrillDate: '2026-08-20', riskLevel: 'low' },
  { schoolId: 'school-004', schoolName: 'Sacred Heart Convent', district: 'Ludhiana', preparednessScore: 45, studentsTotal: 680, studentsTrained: 280, teachersTrained: 18, drillsCompleted: 1, lastDrillDate: '2026-04-15', riskLevel: 'high' },
  { schoolId: 'school-005', schoolName: 'Khalsa Model School', district: 'Ludhiana', preparednessScore: 72, studentsTotal: 520, studentsTrained: 380, teachersTrained: 22, drillsCompleted: 5, lastDrillDate: '2026-08-05', riskLevel: 'medium' },
  { schoolId: 'school-006', schoolName: 'Government High School', district: 'Ludhiana', preparednessScore: 38, studentsTotal: 440, studentsTrained: 110, teachersTrained: 8, drillsCompleted: 0, lastDrillDate: 'Never', riskLevel: 'high' },
];

export function getStudentPreparedness(userId: string): StudentPreparedness | undefined {
  return studentPreparedness[userId];
}

export function getSimulationAttemptsByUser(userId: string): SimulationAttempt[] {
  return simulationAttempts.filter(a => a.userId === userId);
}

export function getDrillById(drillId: string): Drill | undefined {
  return drills.find(d => d.id === drillId);
}

export function getModuleById(moduleId: string): DisasterModule | undefined {
  return disasterModules.find(m => m.id === moduleId);
}
