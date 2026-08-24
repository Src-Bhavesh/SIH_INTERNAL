import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  User,
  UserRole,
  DisasterType,
  Drill,
  DrillParticipant,
  DistrictSchoolSummary,
  Scenario,
  StudentPreparedness,
  SimulationAttempt,
  MistakeRecord,
  QuizAttemptRecord,
  Alert,
} from './types';
import {
  districtSchools as initialDistrictSchools,
  scenarios as defaultScenarios,
  alerts as initialAlerts,
} from './data';
import {
  createOrUpdateUserInDb,
  findStudentByNameAndClass,
  fetchStudentsFromDb,
  upsertStudentProgressToDb,
  fetchStudentProgressFromDb,
  fetchAllStudentProgressFromDb,
  recordQuizAttemptInDb,
  fetchAllQuizAttemptsFromDb,
  recordSimulationAttemptInDb,
  fetchAllSimulationAttemptsFromDb,
  updateDrillParticipantInDb,
} from './supabase';
import { getPreparednessLevel } from './utils';

// ── Auth Store ──
// Auth session retains simple role-based routing
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'suraksha-auth-storage',
    }
  )
);

// ── Alerts Store ──
interface AlertState {
  alerts: Alert[];
  unreadCount: number;
  addAlert: (alert: Alert) => void;
  markAsRead: (alertId: string) => void;
  markAllAsRead: () => void;
}

export const useAlertStore = create<AlertState>()((set) => ({
  alerts: initialAlerts,
  unreadCount: initialAlerts.filter((a) => !a.isRead).length,
  addAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts],
      unreadCount: state.unreadCount + 1,
    })),
  markAsRead: (alertId) =>
    set((state) => {
      const alerts = state.alerts.map((a) => (a.id === alertId ? { ...a, isRead: true } : a));
      return {
        alerts,
        unreadCount: alerts.filter((a) => !a.isRead).length,
      };
    }),
  markAllAsRead: () =>
    set((state) => ({
      alerts: state.alerts.map((a) => ({ ...a, isRead: true })),
      unreadCount: 0,
    })),
}));

// ── Emergency Mode Store ──
interface EmergencyState {
  isEmergency: boolean;
  activeDisaster: DisasterType | null;
  buildingId: string | null;
  triggerEmergency: (disaster: DisasterType, buildingId?: string) => void;
  clearEmergency: () => void;
}

export const useEmergencyStore = create<EmergencyState>()((set) => ({
  isEmergency: false,
  activeDisaster: null,
  buildingId: null,
  triggerEmergency: (disaster, buildingId) =>
    set({
      isEmergency: true,
      activeDisaster: disaster,
      buildingId: buildingId || 'building-a',
    }),
  clearEmergency: () =>
    set({
      isEmergency: false,
      activeDisaster: null,
      buildingId: null,
    }),
}));

// ── Active Drill Store ──
interface DrillState {
  activeDrill: Drill | null;
  participants: DrillParticipant[];
  isStarted: boolean;
  isCompleted: boolean;
  startDrill: (drill: Drill) => void;
  updateParticipantStatus: (userId: string, status: DrillParticipant['status']) => void;
  completeDrill: () => void;
  resetDrill: () => void;
}

export const useDrillStore = create<DrillState>()((set, get) => ({
  activeDrill: null,
  participants: [],
  isStarted: false,
  isCompleted: false,
  startDrill: (drill) =>
    set({
      activeDrill: drill,
      participants: drill.participants,
      isStarted: true,
      isCompleted: false,
    }),
  updateParticipantStatus: (userId, status) => {
    const drill = get().activeDrill;
    if (drill) {
      updateDrillParticipantInDb(drill.id, userId, status);
    }
    set((state) => ({
      participants: state.participants.map((p) =>
        p.userId === userId
          ? {
              ...p,
              status,
              arrivedAt: status === 'safe' ? new Date().toISOString() : p.arrivedAt,
            }
          : p
      ),
    }));
  },
  completeDrill: () =>
    set((state) => {
      if (!state.activeDrill) return state;
      const total = state.participants.length;
      const safe = state.participants.filter((p) => p.status === 'safe').length;
      return {
        isCompleted: true,
        activeDrill: {
          ...state.activeDrill,
          status: 'completed',
          completedAt: new Date().toISOString(),
          report: {
            totalParticipants: total,
            completed: safe,
            averageResponseTimeMs: 135000,
            correctDecisions: Math.round((safe / (total || 1)) * 100),
            attendanceVerified: Math.round((safe / (total || 1)) * 100),
            weakestArea: 'Second-floor evacuation speed',
            recommendation: 'Targeted evacuation drill for Block A upper floors.',
            classBreakdown: [],
          },
        },
      };
    }),
  resetDrill: () =>
    set({
      activeDrill: null,
      participants: [],
      isStarted: false,
      isCompleted: false,
    }),
}));

// ── District Schools Store ──
interface DistrictStore {
  schools: DistrictSchoolSummary[];
  addSchool: (school: DistrictSchoolSummary) => void;
  deleteSchool: (schoolId: string) => void;
  resetSchools: () => void;
}

export const useDistrictStore = create<DistrictStore>()(
  persist(
    (set) => ({
      schools: initialDistrictSchools,
      addSchool: (newSchool) =>
        set((state) => ({
          schools: [newSchool, ...state.schools],
        })),
      deleteSchool: (schoolId) =>
        set((state) => ({
          schools: state.schools.filter((s) => s.schoolId !== schoolId),
        })),
      resetSchools: () =>
        set({
          schools: initialDistrictSchools,
        }),
    }),
    {
      name: 'suraksha-district-storage',
    }
  )
);

// ── Scenarios Store ──
interface ScenarioStore {
  scenarios: Scenario[];
  addScenario: (scenario: Scenario) => void;
  deleteScenario: (scenarioId: string) => void;
  resetScenarios: () => void;
}

export const useScenarioStore = create<ScenarioStore>()(
  persist(
    (set) => ({
      scenarios: defaultScenarios,
      addScenario: (newScenario) =>
        set((state) => ({
          scenarios: [newScenario, ...state.scenarios],
        })),
      deleteScenario: (scenarioId) =>
        set((state) => ({
          scenarios: state.scenarios.filter((s) => s.id !== scenarioId),
        })),
      resetScenarios: () =>
        set({
          scenarios: defaultScenarios,
        }),
    }),
    {
      name: 'suraksha-scenarios-storage',
    }
  )
);

// ── Student Progress & Live Real-Time Aggregator Store (Pure Supabase — No localStorage Fallback) ──

interface StudentProgressStore {
  studentProgress: Record<string, StudentPreparedness>;
  quizAttempts: QuizAttemptRecord[];
  simulationAttempts: SimulationAttempt[];
  registeredStudents: User[];
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  initData: () => Promise<void>;
  registerStudent: (student: User) => Promise<boolean>;
  loginOrRegisterStudent: (studentName: string, classId: string) => Promise<User>;
  completeModule: (
    studentId: string,
    moduleId: string,
    quizAttempt?: QuizAttemptRecord,
    mistakes?: MistakeRecord[]
  ) => Promise<void>;
  recordSimulationAttempt: (attempt: SimulationAttempt, mistakes?: MistakeRecord[]) => Promise<void>;
  fetchStudentData: (studentId: string) => Promise<StudentPreparedness | null>;

  // Synchronous Getters
  getStudentPrep: (studentId: string) => StudentPreparedness;
  getStudentAttempts: (studentId: string) => SimulationAttempt[];
  getStudentQuizAttempts: (studentId: string) => QuizAttemptRecord[];
  getDomainProficiencies: (studentIds: string[]) => { fire: number; earthquake: number; flood: number; evacuation: number };
  getSchoolMetrics: () => {
    totalStudents: number;
    studentsTrained: number;
    avgIDRI: number;
    fire: number;
    earthquake: number;
    flood: number;
    evacuation: number;
    weakestArea: string;
  };
}

export const useStudentProgressStore = create<StudentProgressStore>()((set, get) => ({
  studentProgress: {},
  quizAttempts: [],
  simulationAttempts: [],
  registeredStudents: [],
  isLoading: false,
  isInitialized: false,

  // Load all student data directly from Supabase
  initData: async () => {
    set({ isLoading: true });
    try {
      const [students, progressMap, quizzes, sims] = await Promise.all([
        fetchStudentsFromDb(),
        fetchAllStudentProgressFromDb(),
        fetchAllQuizAttemptsFromDb(),
        fetchAllSimulationAttemptsFromDb(),
      ]);

      set({
        registeredStudents: students,
        studentProgress: progressMap,
        quizAttempts: quizzes,
        simulationAttempts: sims,
        isLoading: false,
        isInitialized: true,
      });
    } catch (err) {
      console.warn('Error initializing student progress from Supabase:', err);
      set({ isLoading: false });
    }
  },

  // Direct database creation of new student and initial progress row in Supabase
  registerStudent: async (newStudent: User) => {
    try {
      // 1. Create or update user in Supabase public.users
      const savedUser = await createOrUpdateUserInDb(newStudent);
      if (!savedUser) {
        throw new Error('Supabase returned null on user insertion');
      }

      // 2. Fetch existing or initialize 0 progress row in Supabase public.student_progress
      const existingPrep = await fetchStudentProgressFromDb(newStudent.id);
      const initialPrep: StudentPreparedness = existingPrep || {
        userId: newStudent.id,
        overall: 0,
        knowledge: 0,
        decisionMaking: 0,
        responseTime: 0,
        drillPerformance: 0,
        trainingCompletion: 0,
        level: 'needs_improvement',
        completedModules: [],
        completedSimulations: [],
        badges: [],
        weakAreas: [],
        mistakes: [],
      };

      if (!existingPrep) {
        await upsertStudentProgressToDb({
          user_id: newStudent.id,
          overall: 0,
          knowledge: 0,
          decision_making: 0,
          response_time: 0,
          drill_performance: 0,
          training_completion: 0,
          level: 'needs_improvement',
          completed_modules: [],
          completed_simulations: [],
          weak_areas: [],
          mistakes: [],
          badges: [],
        });
      }

      // 3. Update store state
      set((state) => {
        const exists = state.registeredStudents.some((s) => s.id === newStudent.id);
        const updatedStudents = exists
          ? state.registeredStudents.map((s) => (s.id === newStudent.id ? savedUser : s))
          : [savedUser, ...state.registeredStudents];

        return {
          registeredStudents: updatedStudents,
          studentProgress: {
            ...state.studentProgress,
            [newStudent.id]: initialPrep,
          },
        };
      });

      return true;
    } catch (err) {
      console.warn('Failed to register student to Supabase:', err);
      throw err;
    }
  },

  // Find existing student in Supabase or register if new
  loginOrRegisterStudent: async (studentName: string, classId: string) => {
    const safeName = studentName.trim();

    // 1. Check if student already exists in Supabase by name and class (case-insensitive)
    const existingUser = await findStudentByNameAndClass(safeName, classId);
    
    // Also check local state in case Supabase is offline/unconfigured
    const state = get();
    const localUser = state.registeredStudents.find(
      (s) => s.name.toLowerCase() === safeName.toLowerCase() && s.classId === classId
    );

    const targetUser = existingUser || localUser;

    if (targetUser) {
      // Fetch latest existing progress from Supabase or local store
      const existingPrep = await fetchStudentProgressFromDb(targetUser.id) || state.studentProgress[targetUser.id];
      set((s) => ({
        registeredStudents: s.registeredStudents.some((st) => st.id === targetUser.id)
          ? s.registeredStudents
          : [targetUser, ...s.registeredStudents],
        studentProgress: existingPrep
          ? { ...s.studentProgress, [targetUser.id]: existingPrep }
          : s.studentProgress,
      }));
      return targetUser;
    }

    // 2. If new student, generate clean deterministic ID
    const studentSlug = safeName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const classSlug = classId.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const studentId = `student-${studentSlug}-${classSlug}`;
    const studentEmail = `${studentSlug.replace(/-/g, '')}@school.edu`;

    const newStudentUser: User = {
      id: studentId,
      name: safeName,
      email: studentEmail,
      role: 'student' as UserRole,
      schoolId: 'school-001',
      classId,
    };

    await get().registerStudent(newStudentUser);
    return newStudentUser;
  },

  // Fetch individual student preparedness from Supabase
  fetchStudentData: async (studentId: string) => {
    const prep = await fetchStudentProgressFromDb(studentId);
    if (prep) {
      set((state) => ({
        studentProgress: {
          ...state.studentProgress,
          [studentId]: prep,
        },
      }));
    }
    return prep;
  },

  // Complete module & save to Supabase
  completeModule: async (studentId, moduleId, quizAttempt, mistakes = []) => {
    const state = get();
    const current = state.studentProgress[studentId] || {
      userId: studentId,
      overall: 0,
      knowledge: 0,
      decisionMaking: 0,
      responseTime: 0,
      drillPerformance: 0,
      trainingCompletion: 0,
      level: 'needs_improvement',
      completedModules: [],
      completedSimulations: [],
      badges: [],
      weakAreas: [],
      mistakes: [],
    };

    const alreadyCompleted = current.completedModules.includes(moduleId);
    const updatedCompleted = alreadyCompleted ? current.completedModules : [...current.completedModules, moduleId];
    const updatedMistakes = [...(current.mistakes || []), ...mistakes];

    const quizScore = quizAttempt ? quizAttempt.score : 100 - mistakes.length * 15;
    const moduleScore = Math.max(20, Math.min(100, quizScore));

    const newTraining = Math.min(100, Math.round((updatedCompleted.length / 3) * 100));
    const newKnowledge = Math.round((updatedCompleted.length / 3) * moduleScore);

    const newOverall = Math.round(
      newKnowledge * 0.5 + (current.decisionMaking || newKnowledge) * 0.3 + newTraining * 0.2
    );
    const newLevel = getPreparednessLevel(newOverall);

    const weakSet = new Set(current.weakAreas);
    mistakes.forEach((m) => {
      if (m.hazardType) weakSet.add(m.hazardType);
    });

    const updatedPrep: StudentPreparedness = {
      ...current,
      completedModules: updatedCompleted,
      knowledge: newKnowledge,
      trainingCompletion: newTraining,
      overall: newOverall,
      level: newLevel,
      weakAreas: Array.from(weakSet),
      mistakes: updatedMistakes,
    };

    // 1. Save to Supabase student_progress table
    await upsertStudentProgressToDb({
      user_id: studentId,
      overall: updatedPrep.overall,
      knowledge: updatedPrep.knowledge,
      decision_making: updatedPrep.decisionMaking,
      response_time: updatedPrep.responseTime,
      drill_performance: updatedPrep.drillPerformance,
      training_completion: updatedPrep.trainingCompletion,
      level: updatedPrep.level,
      completed_modules: updatedPrep.completedModules,
      completed_simulations: updatedPrep.completedSimulations,
      weak_areas: updatedPrep.weakAreas,
      mistakes: updatedPrep.mistakes,
    });

    // 2. Save Quiz Attempt to Supabase quiz_attempts table if present
    if (quizAttempt) {
      await recordQuizAttemptInDb(quizAttempt);
    }

    // 3. Update store
    set((s) => ({
      quizAttempts: quizAttempt
        ? [quizAttempt, ...s.quizAttempts.filter((q) => q.id !== quizAttempt.id)]
        : s.quizAttempts,
      studentProgress: {
        ...s.studentProgress,
        [studentId]: updatedPrep,
      },
    }));
  },

  // Record Simulation Attempt & save to Supabase
  recordSimulationAttempt: async (attempt, mistakes = []) => {
    const studentId = attempt.userId;
    const state = get();
    const current = state.studentProgress[studentId] || {
      userId: studentId,
      overall: 0,
      knowledge: 0,
      decisionMaking: 0,
      responseTime: 0,
      drillPerformance: 0,
      trainingCompletion: 0,
      level: 'needs_improvement',
      completedModules: [],
      completedSimulations: [],
      badges: [],
      weakAreas: [],
      mistakes: [],
    };

    const alreadyDone = current.completedSimulations.includes(attempt.scenarioId);
    const updatedSims = alreadyDone
      ? current.completedSimulations
      : [...current.completedSimulations, attempt.scenarioId];

    const newDecision = attempt.score.decisionAccuracy;
    const newResponse = attempt.score.responseTime;
    const updatedMistakes = [...(current.mistakes || []), ...mistakes];

    const weakSet = new Set(current.weakAreas);
    mistakes.forEach((m) => {
      if (m.hazardType) weakSet.add(m.hazardType);
    });

    const newOverall = Math.round(
      (current.knowledge || newDecision) * 0.35 +
        newDecision * 0.35 +
        newResponse * 0.15 +
        (current.trainingCompletion || 30) * 0.15
    );

    const newLevel = getPreparednessLevel(newOverall);

    const updatedPrep: StudentPreparedness = {
      ...current,
      completedSimulations: updatedSims,
      decisionMaking: newDecision,
      responseTime: newResponse,
      overall: newOverall,
      level: newLevel,
      weakAreas: Array.from(weakSet),
      mistakes: updatedMistakes,
    };

    // 1. Save to Supabase student_progress table
    await upsertStudentProgressToDb({
      user_id: studentId,
      overall: updatedPrep.overall,
      knowledge: updatedPrep.knowledge,
      decision_making: updatedPrep.decisionMaking,
      response_time: updatedPrep.responseTime,
      drill_performance: updatedPrep.drillPerformance,
      training_completion: updatedPrep.trainingCompletion,
      level: updatedPrep.level,
      completed_modules: updatedPrep.completedModules,
      completed_simulations: updatedPrep.completedSimulations,
      weak_areas: updatedPrep.weakAreas,
      mistakes: updatedPrep.mistakes,
    });

    // 2. Save Simulation Attempt to Supabase simulation_attempts table
    await recordSimulationAttemptInDb(attempt);

    // 3. Update store
    set((s) => ({
      simulationAttempts: [attempt, ...s.simulationAttempts.filter((a) => a.id !== attempt.id)],
      studentProgress: {
        ...s.studentProgress,
        [studentId]: updatedPrep,
      },
    }));
  },

  getStudentPrep: (studentId) => {
    return (
      get().studentProgress[studentId] || {
        userId: studentId,
        overall: 0,
        knowledge: 0,
        decisionMaking: 0,
        responseTime: 0,
        drillPerformance: 0,
        trainingCompletion: 0,
        level: 'needs_improvement',
        completedModules: [],
        completedSimulations: [],
        badges: [],
        weakAreas: [],
        mistakes: [],
      }
    );
  },

  getStudentAttempts: (studentId) => {
    return get().simulationAttempts.filter((a) => a.userId === studentId);
  },

  getStudentQuizAttempts: (studentId) => {
    return get().quizAttempts.filter((q) => q.userId === studentId);
  },

  // ── Pure Dynamic Domain Proficiency Calculation ──
  getDomainProficiencies: (studentIds) => {
    const { quizAttempts, simulationAttempts } = get();
    if (studentIds.length === 0) return { fire: 0, earthquake: 0, flood: 0, evacuation: 0 };

    // FIRE
    const fireQuizzes = quizAttempts.filter(
      (q) => studentIds.includes(q.userId) && (q.moduleId === 'mod-fire' || q.disasterType === 'fire')
    );
    const fireSims = simulationAttempts.filter(
      (s) => studentIds.includes(s.userId) && s.scenarioId.includes('fire')
    );
    let fireScore = 0;
    const fireCount = fireQuizzes.length + fireSims.length;
    if (fireCount > 0) {
      const qTotal = fireQuizzes.reduce((sum, q) => sum + q.score, 0);
      const sTotal = fireSims.reduce((sum, s) => sum + s.score.overall, 0);
      fireScore = Math.round((qTotal + sTotal) / fireCount);
    }

    // EARTHQUAKE
    const eqQuizzes = quizAttempts.filter(
      (q) =>
        studentIds.includes(q.userId) &&
        (q.moduleId === 'mod-earthquake' || q.disasterType === 'earthquake')
    );
    const eqSims = simulationAttempts.filter(
      (s) => studentIds.includes(s.userId) && s.scenarioId.includes('earthquake')
    );
    let eqScore = 0;
    const eqCount = eqQuizzes.length + eqSims.length;
    if (eqCount > 0) {
      const qTotal = eqQuizzes.reduce((sum, q) => sum + q.score, 0);
      const sTotal = eqSims.reduce((sum, s) => sum + s.score.overall, 0);
      eqScore = Math.round((qTotal + sTotal) / eqCount);
    }

    // FLOOD
    const floodQuizzes = quizAttempts.filter(
      (q) =>
        studentIds.includes(q.userId) && (q.moduleId === 'mod-flood' || q.disasterType === 'flood')
    );
    const floodSims = simulationAttempts.filter(
      (s) => studentIds.includes(s.userId) && s.scenarioId.includes('flood')
    );
    let floodScore = 0;
    const floodCount = floodQuizzes.length + floodSims.length;
    if (floodCount > 0) {
      const qTotal = floodQuizzes.reduce((sum, q) => sum + q.score, 0);
      const sTotal = floodSims.reduce((sum, s) => sum + s.score.overall, 0);
      floodScore = Math.round((qTotal + sTotal) / floodCount);
    }

    // EVACUATION
    const evacSims = simulationAttempts.filter((s) => studentIds.includes(s.userId));
    let evacScore = 0;
    if (evacSims.length > 0) {
      evacScore = Math.round(
        evacSims.reduce((sum, s) => sum + (s.score.evacuationDecisions || s.score.overall), 0) /
          evacSims.length
      );
    }

    return {
      fire: fireScore,
      earthquake: eqScore,
      flood: floodScore,
      evacuation: evacScore,
    };
  },

  // ── School-Wide Real-Time Aggregator ──
  getSchoolMetrics: () => {
    const { studentProgress, registeredStudents, getDomainProficiencies } = get();
    const totalStudents = registeredStudents.length;
    const activeStudentIds = registeredStudents.map((s) => s.id);

    const studentsWithProgress = activeStudentIds.filter((id) => {
      const p = studentProgress[id];
      return p && (p.completedModules.length > 0 || p.completedSimulations.length > 0 || p.overall > 0);
    });

    const studentsTrained = studentsWithProgress.length;

    let totalScore = 0;
    studentsWithProgress.forEach((id) => {
      totalScore += studentProgress[id]?.overall || 0;
    });

    const avgIDRI = studentsWithProgress.length > 0 ? Math.round(totalScore / studentsWithProgress.length) : 0;

    const domains = getDomainProficiencies(activeStudentIds);

    // Find weakest area
    const allMistakes: MistakeRecord[] = [];
    activeStudentIds.forEach((id) => {
      if (studentProgress[id]?.mistakes) {
        allMistakes.push(...studentProgress[id].mistakes!);
      }
    });

    const weakestArea =
      allMistakes.length > 0
        ? allMistakes[0].hazardType?.replace(/_/g, ' ') || 'Evacuation'
        : 'None detected';

    return {
      totalStudents,
      studentsTrained,
      avgIDRI,
      fire: domains.fire,
      earthquake: domains.earthquake,
      flood: domains.flood,
      evacuation: domains.evacuation,
      weakestArea,
    };
  },
}));
