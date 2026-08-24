// ═══════════════════════════════════════════════════════════════
// SurakshaOS — Data Layer Index
// Re-exports all seed data and lookup functions
// ═══════════════════════════════════════════════════════════════

export { users, getUserByEmail, getUserById, getUsersByRole, getStudentsByClass } from './users';
export { school, buildings, classes, emergencyContacts, assemblyPoints, blockBGraph, getBuildingById, getClassById, getClassesByTeacher, getClassesByBuilding } from './schools';
export { scenarios, getScenarioById, getScenariosByDisaster } from './scenarios';
export {
  allBadges,
  studentPreparedness,
  simulationAttempts,
  drills,
  emergencyEvents,
  schoolPreparedness,
  preparednessHistory,
  alerts,
  recommendations,
  disasterModules,
  districtSchools,
  getStudentPreparedness,
  getSimulationAttemptsByUser,
  getDrillById,
  getModuleById,
} from './scores';
