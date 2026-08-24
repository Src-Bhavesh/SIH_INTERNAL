import { createClient } from '@supabase/supabase-js';
import {
  User,
  UserRole,
  StudentPreparedness,
  SimulationAttempt,
  QuizAttemptRecord,
  DisasterType,
  Badge,
  Scenario,
  DistrictSchoolSummary,
} from './types';
import { allBadges } from './data/scores';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ── Database Table Interfaces ──

export interface DbUser {
  id: string;
  name: string;
  email: string;
  role: string;
  school_id: string;
  class_id?: string | null;
  assigned_classes?: string[] | null;
  avatar?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbStudentProgress {
  user_id: string;
  overall: number;
  knowledge: number;
  decision_making: number;
  response_time: number;
  drill_performance: number;
  training_completion: number;
  level: string;
  completed_modules: string[];
  completed_simulations: string[];
  weak_areas: string[];
  mistakes: any[];
  badges: string[];
  updated_at?: string;
}

export interface DbQuizAttempt {
  id: string;
  user_id: string;
  module_id: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  disaster_type?: string | null;
  created_at?: string;
}

export interface DbSimulationAttempt {
  id: string;
  user_id: string;
  scenario_id: string;
  score: any;
  timeline: any;
  evacuation_time_seconds: number;
  completed_at?: string;
}

// ── User Management (Students, Teachers, Admin) ──

export async function createOrUpdateUserInDb(user: User): Promise<User | null> {
  if (!supabase) {
    console.warn('Supabase client is not configured. Using local offline mode.');
    return user;
  }
  try {
    const dbPayload: DbUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      school_id: user.schoolId || 'school-001',
      class_id: user.classId || null,
      assigned_classes: user.assignedClasses || null,
      avatar: user.avatar || null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('users')
      .upsert(dbPayload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.warn('Failed to create/update user in Supabase:', error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role as UserRole,
      schoolId: data.school_id,
      classId: data.class_id || undefined,
      assignedClasses: data.assigned_classes || undefined,
      avatar: data.avatar || undefined,
    };
  } catch (err) {
    console.warn('Error in createOrUpdateUserInDb:', err);
    throw err;
  }
}

export async function fetchStudentsFromDb(filters?: { schoolId?: string; classId?: string }): Promise<User[]> {
  if (!supabase) return [];
  try {
    let query = supabase.from('users').select('*').eq('role', 'student');
    if (filters?.schoolId) query = query.eq('school_id', filters.schoolId);
    if (filters?.classId) query = query.eq('class_id', filters.classId);

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) {
      console.warn('Error fetching students from Supabase:', error);
      return [];
    }

    return (data || []).map((row: DbUser) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      role: 'student' as UserRole,
      schoolId: row.school_id,
      classId: row.class_id || undefined,
      assignedClasses: row.assigned_classes || undefined,
      avatar: row.avatar || undefined,
    }));
  } catch (err) {
    console.warn('Error in fetchStudentsFromDb:', err);
    return [];
  }
}

export async function findStudentByNameAndClass(name: string, classId?: string): Promise<User | null> {
  if (!supabase) return null;
  try {
    const trimmedName = name.trim();
    let query = supabase
      .from('users')
      .select('*')
      .eq('role', 'student')
      .ilike('name', trimmedName);

    if (classId) {
      query = query.eq('class_id', classId);
    }

    const { data, error } = await query.order('created_at', { ascending: false }).limit(1);
    if (error || !data || data.length === 0) return null;

    const row: DbUser = data[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role as UserRole,
      schoolId: row.school_id,
      classId: row.class_id || undefined,
      assignedClasses: row.assigned_classes || undefined,
      avatar: row.avatar || undefined,
    };
  } catch (err) {
    console.warn('Error in findStudentByNameAndClass:', err);
    return null;
  }
}

// ── Student Progress Management ──

export async function upsertStudentProgressToDb(
  progress: Partial<DbStudentProgress> & { user_id: string }
): Promise<DbStudentProgress | null> {
  if (!supabase) return null;
  try {
    const payload: DbStudentProgress = {
      user_id: progress.user_id,
      overall: progress.overall ?? 0,
      knowledge: progress.knowledge ?? 0,
      decision_making: progress.decision_making ?? 0,
      response_time: progress.response_time ?? 0,
      drill_performance: progress.drill_performance ?? 0,
      training_completion: progress.training_completion ?? 0,
      level: progress.level ?? 'needs_improvement',
      completed_modules: progress.completed_modules ?? [],
      completed_simulations: progress.completed_simulations ?? [],
      weak_areas: progress.weak_areas ?? [],
      mistakes: progress.mistakes ?? [],
      badges: progress.badges ?? [],
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('student_progress')
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      console.warn('Error upserting student progress to Supabase:', error);
      throw error;
    }
    return data;
  } catch (err) {
    console.warn('Error in upsertStudentProgressToDb:', err);
    throw err;
  }
}

function resolveBadges(badgeIdsOrObjects: any[]): Badge[] {
  if (!Array.isArray(badgeIdsOrObjects)) return [];
  return badgeIdsOrObjects.map((b) => {
    if (typeof b === 'object' && b !== null && 'id' in b) return b as Badge;
    const matched = allBadges.find((ab) => ab.id === b);
    return matched || { id: String(b), name: String(b), icon: '🏅', description: 'Achievement Unlocked' };
  });
}

export async function fetchStudentProgressFromDb(userId: string): Promise<StudentPreparedness | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('student_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) return null;

    return {
      userId: data.user_id,
      overall: data.overall,
      knowledge: data.knowledge,
      decisionMaking: data.decision_making,
      responseTime: data.response_time,
      drillPerformance: data.drill_performance,
      trainingCompletion: data.training_completion,
      level: data.level,
      completedModules: data.completed_modules || [],
      completedSimulations: data.completed_simulations || [],
      weakAreas: data.weak_areas || [],
      mistakes: data.mistakes || [],
      badges: resolveBadges(data.badges),
    };
  } catch {
    return null;
  }
}

export async function fetchAllStudentProgressFromDb(): Promise<Record<string, StudentPreparedness>> {
  if (!supabase) return {};
  try {
    const { data, error } = await supabase.from('student_progress').select('*');
    if (error || !data) return {};

    const recordMap: Record<string, StudentPreparedness> = {};
    data.forEach((row: DbStudentProgress) => {
      recordMap[row.user_id] = {
        userId: row.user_id,
        overall: row.overall,
        knowledge: row.knowledge,
        decisionMaking: row.decision_making,
        responseTime: row.response_time,
        drillPerformance: row.drill_performance,
        trainingCompletion: row.training_completion,
        level: row.level as any,
        completedModules: row.completed_modules || [],
        completedSimulations: row.completed_simulations || [],
        weakAreas: row.weak_areas || [],
        mistakes: row.mistakes || [],
        badges: resolveBadges(row.badges),
      };
    });
    return recordMap;
  } catch (err) {
    console.warn('Error in fetchAllStudentProgressFromDb:', err);
    return {};
  }
}

// ── Quiz & Simulation Assessments ──

export async function recordQuizAttemptInDb(attempt: QuizAttemptRecord): Promise<void> {
  if (!supabase) return;
  try {
    const dbPayload: DbQuizAttempt = {
      id: attempt.id,
      user_id: attempt.userId,
      module_id: attempt.moduleId,
      score: attempt.score,
      total_questions: attempt.totalQuestions,
      correct_answers: attempt.correctCount,
      disaster_type: attempt.disasterType || null,
      created_at: attempt.completedAt || new Date().toISOString(),
    };

    const { error } = await supabase.from('quiz_attempts').upsert(dbPayload, { onConflict: 'id' });
    if (error) console.warn('Error recording quiz attempt in Supabase:', error);
  } catch (err) {
    console.warn('Error in recordQuizAttemptInDb:', err);
  }
}

export async function fetchAllQuizAttemptsFromDb(): Promise<QuizAttemptRecord[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return [];

    return data.map((row: DbQuizAttempt) => ({
      id: row.id,
      userId: row.user_id,
      moduleId: row.module_id,
      moduleTitle: `${row.module_id} Assessment`,
      score: row.score,
      totalQuestions: row.total_questions,
      correctCount: row.correct_answers,
      mistakesCount: Math.max(0, row.total_questions - row.correct_answers),
      disasterType: (row.disaster_type || 'fire') as DisasterType,
      completedAt: row.created_at || new Date().toISOString(),
      status: row.score >= 70 ? 'passed' : 'completed',
    }));
  } catch {
    return [];
  }
}

export async function recordSimulationAttemptInDb(attempt: SimulationAttempt): Promise<void> {
  if (!supabase) return;
  try {
    const dbPayload: DbSimulationAttempt = {
      id: attempt.id,
      user_id: attempt.userId,
      scenario_id: attempt.scenarioId,
      score: attempt.score,
      timeline: attempt.decisions,
      evacuation_time_seconds: Math.round(
        attempt.decisions.reduce((sum, d) => sum + d.responseTimeMs, 0) / 1000
      ),
      completed_at: attempt.completedAt || new Date().toISOString(),
    };

    const { error } = await supabase.from('simulation_attempts').upsert(dbPayload, { onConflict: 'id' });
    if (error) console.warn('Error recording simulation attempt in Supabase:', error);
  } catch (err) {
    console.warn('Error in recordSimulationAttemptInDb:', err);
  }
}

export async function fetchAllSimulationAttemptsFromDb(): Promise<SimulationAttempt[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('simulation_attempts')
      .select('*')
      .order('completed_at', { ascending: false });
    if (error || !data) return [];

    return data.map((row: DbSimulationAttempt) => ({
      id: row.id,
      scenarioId: row.scenario_id,
      userId: row.user_id,
      startedAt: row.completed_at || new Date().toISOString(),
      completedAt: row.completed_at || new Date().toISOString(),
      decisions: (row.timeline as any[]) || [],
      score: row.score || { overall: 0, decisionAccuracy: 0, responseTime: 0, evacuationDecisions: 0 },
      status: 'completed',
    }));
  } catch {
    return [];
  }
}

// ── Drill Check-ins ──

export async function updateDrillParticipantInDb(
  drillId: string,
  userId: string,
  status: string,
  classId?: string
): Promise<void> {
  if (!supabase) return;
  try {
    const { error } = await supabase.from('drill_participants').upsert(
      {
        id: `${drillId}-${userId}`,
        drill_id: drillId,
        user_id: userId,
        class_id: classId || null,
        status,
        arrived_at: status === 'safe' ? new Date().toISOString() : null,
      },
      { onConflict: 'id' }
    );

    if (error) console.warn('Error updating drill participant in Supabase:', error);
  } catch (err) {
    console.warn('Error in updateDrillParticipantInDb:', err);
  }
}

// ── Admin: Scenarios ──
export async function fetchScenariosFromDb(): Promise<Scenario[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase.from('scenarios').select('*');
    if (error) return [];
    return data.map((r: any) => ({
      id: r.id,
      title: r.title,
      disasterType: r.disaster_type,
      difficulty: r.difficulty,
      estimatedMinutes: r.estimated_minutes,
      description: r.description,
      location: r.location,
      engineType: r.engine_type,
      url: r.url,
      steps: r.steps || [],
    }));
  } catch {
    return [];
  }
}

export async function upsertScenarioToDb(scenario: Scenario): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from('scenarios').upsert({
      id: scenario.id,
      title: scenario.title,
      disaster_type: scenario.disasterType,
      difficulty: scenario.difficulty,
      estimated_minutes: scenario.estimatedMinutes,
      description: scenario.description,
      location: scenario.location,
      engine_type: scenario.engineType,
      url: scenario.url,
      steps: scenario.steps,
    }, { onConflict: 'id' });
  } catch (err) {
    console.warn(err);
  }
}

export async function deleteScenarioFromDb(scenarioId: string): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from('scenarios').delete().eq('id', scenarioId);
  } catch (err) {
    console.warn(err);
  }
}

// ── Admin: District Schools ──
export async function fetchDistrictSchoolsFromDb(): Promise<DistrictSchoolSummary[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase.from('district_schools').select('*');
    if (error) return [];
    return data.map((r: any) => ({
      schoolId: r.school_id,
      schoolName: r.school_name,
      district: r.district,
      preparednessScore: r.preparedness_score,
      studentsTotal: r.students_total,
      studentsTrained: r.students_trained,
      teachersTrained: r.teachers_trained,
      drillsCompleted: r.drills_completed,
      lastDrillDate: r.last_drill_date,
      riskLevel: r.risk_level,
    }));
  } catch {
    return [];
  }
}

export async function upsertDistrictSchoolToDb(school: DistrictSchoolSummary): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from('district_schools').upsert({
      school_id: school.schoolId,
      school_name: school.schoolName,
      district: school.district,
      preparedness_score: school.preparednessScore,
      students_total: school.studentsTotal,
      students_trained: school.studentsTrained,
      teachers_trained: school.teachersTrained,
      drills_completed: school.drillsCompleted,
      last_drill_date: school.lastDrillDate,
      risk_level: school.riskLevel,
    }, { onConflict: 'school_id' });
  } catch (err) {
    console.warn(err);
  }
}

export async function deleteDistrictSchoolFromDb(schoolId: string): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from('district_schools').delete().eq('school_id', schoolId);
  } catch (err) {
    console.warn(err);
  }
}
