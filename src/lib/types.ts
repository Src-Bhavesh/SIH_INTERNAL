// ============================================================
// SurakshaOS — Core Type Definitions
// ============================================================

// ---------- Roles & Auth ----------
export type UserRole = 'student' | 'teacher' | 'admin' | 'district';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  schoolId: string;
  classId?: string;        // students only
  assignedClasses?: string[]; // teachers only
}

export interface AuthSession {
  user: User;
  token: string;
}

// ---------- School & Infrastructure ----------
export interface School {
  id: string;
  name: string;
  address: string;
  district: string;
  state: string;
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  buildings: Building[];
  emergencyContacts: EmergencyContact[];
  preparednessScore: number;
  lastDrillDate: string;
}

export interface Building {
  id: string;
  name: string;
  schoolId: string;
  floors: Floor[];
}

export interface Floor {
  id: string;
  buildingId: string;
  level: number;        // 0 = ground, 1 = first, etc.
  name: string;
  rooms: Room[];
}

export interface Room {
  id: string;
  floorId: string;
  name: string;
  type: 'classroom' | 'lab' | 'library' | 'auditorium' | 'office' | 'corridor' | 'staircase' | 'exit' | 'assembly_point';
  capacity?: number;
  x: number;            // SVG position
  y: number;
  width: number;
  height: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  type: 'internal' | 'hospital' | 'fire' | 'police' | 'ambulance' | 'other';
}

// ---------- Graph for Evacuation ----------
export interface GraphNode {
  id: string;
  roomId: string;
  label: string;
  type: Room['type'];
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  from: string;          // node ID
  to: string;
  weight: number;        // travel time in seconds
  isBlocked: boolean;
  label?: string;        // e.g., "Hallway B"
}

export interface EvacuationRoute {
  path: GraphNode[];
  totalWeight: number;
  exitNode: GraphNode;
  assemblyPoint: string;
}

// ---------- Disaster & Learning ----------
export type DisasterType = 'earthquake' | 'fire' | 'flood' | 'cyclone' | 'lightning' | 'heatwave' | 'landslide' | 'chemical' | 'stampede';

export interface DisasterModule {
  id: string;
  disasterType: DisasterType;
  title: string;
  description: string;
  icon: string;
  color: string;
  isAvailable: boolean;
  estimatedMinutes?: number;
  sections: ModuleSection[];
}

export interface ModuleSection {
  id: string;
  title: string;
  type: 'overview' | 'dos_donts' | 'steps' | 'checklist' | 'quiz';
  content: ModuleContent;
}

export interface ModuleContent {
  text?: string;
  items?: ContentItem[];
  questions?: QuizQuestion[];
}

export interface ContentItem {
  id: string;
  text: string;
  icon?: string;
  type?: 'do' | 'dont' | 'step' | 'check';
  order?: number;
  checked?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
}

// ---------- Simulation Engine ----------
export interface Scenario {
  id: string;
  title: string;
  disasterType: DisasterType;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  description: string;
  location: string;
  engineType?: 'internal' | 'external';
  url?: string;
  steps: ScenarioStep[];
}

export interface ScenarioStep {
  id: string;
  situation: string;
  illustration?: string;    // description for visual context
  location?: string;
  timeLimit?: number;       // seconds
  choices: ScenarioChoice[];
  metadata?: {
    disasterType: DisasterType;
    difficulty: string;
    phase: string;           // e.g., "initial_response", "evacuation", "post_event"
  };
}

export interface ScenarioChoice {
  id: string;
  text: string;
  consequence: string;
  isCorrect: boolean;
  isSafe: boolean;
  safetyScore: number;       // 0-100
  nextStepId?: string | null; // null = end of scenario
  responseTimeWeight?: number; // how much response time matters for this choice
}

// ---------- Simulation Attempt ----------
export interface SimulationAttempt {
  id: string;
  scenarioId: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  decisions: SimulationDecision[];
  score: SimulationScore;
  status: 'in_progress' | 'completed' | 'abandoned';
}

export interface SimulationDecision {
  stepId: string;
  choiceId: string;
  responseTimeMs: number;
  isCorrect: boolean;
  isSafe: boolean;
  timestamp: string;
}

export interface SimulationScore {
  overall: number;            // 0-100
  decisionAccuracy: number;
  responseTime: number;
  safetyCompliance: number;
  evacuationDecisions: number;
  breakdown: ScoreBreakdownItem[];
}

export interface ScoreBreakdownItem {
  label: string;
  score: number;
  maxScore: number;
  feedback?: string;
}

// ---------- Preparedness Index (IDRI) ----------
export interface PreparednessScore {
  overall: number;
  level: 'excellent' | 'good' | 'needs_improvement' | 'critical';
  components: PreparednessComponent[];
  weaknesses: Weakness[];
  recommendations: string[];
  calculatedAt: string;
}

export interface PreparednessComponent {
  name: string;
  score: number;
  weight: number;
  icon: string;
}

export interface Weakness {
  area: string;
  impact: number;           // how many points lost
  description: string;
}

export interface QuizAttemptRecord {
  id: string;
  moduleId: string;
  moduleTitle: string;
  disasterType: DisasterType;
  userId: string;
  completedAt: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  mistakesCount: number;
  status: 'passed' | 'completed';
}

export interface MistakeRecord {
  id: string;
  type: 'quiz' | 'simulation';
  title: string;
  questionOrStep: string;
  mistakeText: string;
  explanation: string;
  hazardType?: string;
  timestamp: string;
}

// ---------- Student Preparedness ----------
export interface StudentPreparedness {
  userId: string;
  overall: number;
  knowledge: number;
  decisionMaking: number;
  responseTime: number;
  drillPerformance: number;
  trainingCompletion: number;
  level: PreparednessScore['level'];
  completedModules: string[];
  completedSimulations: string[];
  badges: Badge[];
  weakAreas: string[];
  mistakes?: MistakeRecord[];
  recommendedActivity?: {
    title: string;
    description: string;
    type: 'module' | 'simulation' | 'drill';
    id: string;
  };
}

// ---------- Drill Management ----------
export interface Drill {
  id: string;
  schoolId: string;
  title: string;
  disasterType: DisasterType;
  buildingId: string;
  floorIds?: string[];
  classIds: string[];
  scheduledAt: string;
  startedAt?: string;
  completedAt?: string;
  assemblyPointId: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  createdBy: string;
  participants: DrillParticipant[];
  report?: DrillReport;
}

export interface DrillParticipant {
  userId: string;
  name: string;
  classId: string;
  status: 'pending' | 'evacuating' | 'safe' | 'missing' | 'not_participating';
  responseTimeMs?: number;
  arrivedAt?: string;
}

export interface DrillReport {
  totalParticipants: number;
  completed: number;
  averageResponseTimeMs: number;
  correctDecisions: number;
  attendanceVerified: number;
  weakestArea: string;
  recommendation: string;
  classBreakdown: ClassDrillResult[];
}

export interface ClassDrillResult {
  classId: string;
  className: string;
  total: number;
  safe: number;
  missing: number;
  avgResponseTimeMs: number;
}

// ---------- Emergency ----------
export interface EmergencyEvent {
  id: string;
  schoolId: string;
  type: DisasterType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  buildingId: string;
  floorId?: string;
  title: string;
  description: string;
  instructions: string[];
  blockedExits: string[];
  assemblyPointId: string;
  status: 'active' | 'resolved' | 'drill';
  triggeredAt: string;
  resolvedAt?: string;
  triggeredBy: string;
  accountability: AccountabilityStatus;
}

export interface AccountabilityStatus {
  totalExpected: number;
  accounted: number;
  unaccounted: number;
  byBuilding: BuildingAccountability[];
}

export interface BuildingAccountability {
  buildingId: string;
  buildingName: string;
  classes: ClassAccountability[];
}

export interface ClassAccountability {
  classId: string;
  className: string;
  expected: number;
  safe: number;
  missing: number;
  notParticipating: number;
}

// ---------- Badges / Gamification ----------
export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt?: string;
}

// ---------- Alerts ----------
export interface Alert {
  id: string;
  type: 'weather' | 'drill' | 'emergency' | 'training' | 'info';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  createdAt: string;
  expiresAt?: string;
  isRead: boolean;
}

// ---------- Analytics ----------
export interface TimeSeriesDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ComparisonDataPoint {
  name: string;
  value: number;
  category?: string;
}

// ---------- Class ----------
export interface SchoolClass {
  id: string;
  name: string;
  grade: string;
  section: string;
  buildingId: string;
  roomId: string;
  teacherId: string;
  studentIds: string[];
  totalStudents: number;
}

// ---------- District ----------
export interface DistrictSchoolSummary {
  schoolId: string;
  schoolName: string;
  district: string;
  preparednessScore: number;
  studentsTotal: number;
  studentsTrained: number;
  teachersTrained: number;
  drillsCompleted: number;
  lastDrillDate: string;
  riskLevel: 'low' | 'medium' | 'high';
}

// ---------- AI / Recommendations ----------
export interface Recommendation {
  id: string;
  targetType: 'student' | 'class' | 'school';
  targetId: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionType: 'module' | 'simulation' | 'drill' | 'training';
  actionId: string;
  reason: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface AIAnalysis {
  summary: string;
  insights: string[];
  weaknesses: Weakness[];
  recommendations: Recommendation[];
  generatedAt: string;
  isAIGenerated: boolean;
}
