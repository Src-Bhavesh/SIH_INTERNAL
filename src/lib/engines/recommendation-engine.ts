// ═══════════════════════════════════════════════════════════════
// SurakshaOS — Recommendation Engine (Mock AI)
// Rule-based recommendation system with LLM abstraction layer.
// ═══════════════════════════════════════════════════════════════

import { Recommendation, StudentPreparedness, PreparednessScore, AIAnalysis, Weakness } from '../types';
import { generateId } from '../utils';

// ── AI Provider Abstraction ──
export interface AIProvider {
  generateRecommendations(context: string): Promise<string[]>;
  analyzePreparedness(context: string): Promise<string>;
}

/**
 * Mock AI provider — uses rules-based logic, no API key needed
 */
export class MockAIProvider implements AIProvider {
  async generateRecommendations(context: string): Promise<string[]> {
    // Simulated delay
    await new Promise(r => setTimeout(r, 100));
    return [
      'Focus on areas with lowest scores first',
      'Complete at least one simulation per disaster type',
      'Practice evacuation routes regularly',
    ];
  }

  async analyzePreparedness(context: string): Promise<string> {
    await new Promise(r => setTimeout(r, 100));
    return 'Analysis based on current performance data suggests focusing on evacuation procedures and response time improvement.';
  }
}

// Active provider (can be swapped to OpenAI later)
let activeProvider: AIProvider = new MockAIProvider();

export function setAIProvider(provider: AIProvider) {
  activeProvider = provider;
}

export function getAIProvider(): AIProvider {
  return activeProvider;
}

// ── Rule-Based Recommendation Logic ──

/**
 * Generate personalized recommendations for a student
 */
export function generateStudentRecommendations(prep: StudentPreparedness): Recommendation[] {
  const recs: Recommendation[] = [];
  const now = new Date().toISOString();

  // Check training completion
  const allModules = ['mod-earthquake', 'mod-fire', 'mod-flood'];
  const missingModules = allModules.filter(m => !prep.completedModules.includes(m));
  
  for (const moduleId of missingModules) {
    const moduleName = moduleId.replace('mod-', '').charAt(0).toUpperCase() + moduleId.replace('mod-', '').slice(1);
    recs.push({
      id: generateId(),
      targetType: 'student',
      targetId: prep.userId,
      title: `Complete ${moduleName} Safety Module`,
      description: `You haven't completed the ${moduleName} safety module yet. Complete it to improve your preparedness score.`,
      priority: 'high',
      actionType: 'module',
      actionId: moduleId,
      reason: `${moduleName} module not completed`,
      isCompleted: false,
      createdAt: now,
    });
  }

  // Check weak areas
  if (prep.responseTime < 70) {
    recs.push({
      id: generateId(),
      targetType: 'student',
      targetId: prep.userId,
      title: 'Improve Response Time',
      description: 'Your response time is below average. Practice quick decision-making with timed simulations.',
      priority: 'medium',
      actionType: 'simulation',
      actionId: 'scenario-earthquake-01',
      reason: `Response time score: ${prep.responseTime}% (target: 70%+)`,
      isCompleted: false,
      createdAt: now,
    });
  }

  if (prep.decisionMaking < 70) {
    recs.push({
      id: generateId(),
      targetType: 'student',
      targetId: prep.userId,
      title: 'Strengthen Decision Making',
      description: 'Your decision-making accuracy needs improvement. Retake simulations focusing on correct safety choices.',
      priority: 'high',
      actionType: 'simulation',
      actionId: 'scenario-fire-01',
      reason: `Decision making score: ${prep.decisionMaking}% (target: 70%+)`,
      isCompleted: false,
      createdAt: now,
    });
  }

  if (prep.weakAreas.includes('evacuation_procedure')) {
    recs.push({
      id: generateId(),
      targetType: 'student',
      targetId: prep.userId,
      title: 'Fire Evacuation Refresher',
      description: 'Your evacuation procedure knowledge needs strengthening. Complete the fire evacuation simulation.',
      priority: 'high',
      actionType: 'simulation',
      actionId: 'scenario-fire-01',
      reason: 'Evacuation procedure identified as weak area',
      isCompleted: false,
      createdAt: now,
    });
  }

  return recs;
}

/**
 * Generate school-level AI analysis
 */
export function generateSchoolAnalysis(prep: PreparednessScore): AIAnalysis {
  const insights: string[] = [];
  const recommendations: Recommendation[] = [];
  const now = new Date().toISOString();

  // Analyze components
  for (const component of prep.components) {
    if (component.score >= 90) {
      insights.push(`${component.name} is performing excellently at ${component.score}%.`);
    } else if (component.score < 75) {
      insights.push(`${component.name} needs attention — currently at ${component.score}%.`);
    }
  }

  // Overall trend
  if (prep.overall >= 80) {
    insights.push('The institution demonstrates good overall preparedness.');
  } else if (prep.overall >= 60) {
    insights.push('Preparedness is moderate. Targeted interventions can significantly improve readiness.');
  } else {
    insights.push('Critical attention needed. The institution is not adequately prepared for disaster scenarios.');
  }

  // Weakness-based insights
  for (const weakness of prep.weaknesses) {
    insights.push(`${weakness.area}: ${weakness.description} (impact: ${weakness.impact} points)`);
  }

  return {
    summary: `Institutional Disaster Readiness Index: ${prep.overall}/100 (${prep.level.replace('_', ' ').toUpperCase()}). ${prep.weaknesses.length} areas need improvement.`,
    insights,
    weaknesses: prep.weaknesses,
    recommendations,
    generatedAt: now,
    isAIGenerated: true,
  };
}

/**
 * Identify students needing attention in a class
 */
export function identifyStudentsNeedingAttention(
  students: { userId: string; name: string; preparedness: StudentPreparedness }[]
): { userId: string; name: string; score: number; weaknesses: string[]; recommendation: string }[] {
  return students
    .filter(s => s.preparedness.overall < 75)
    .map(s => ({
      userId: s.userId,
      name: s.name,
      score: s.preparedness.overall,
      weaknesses: s.preparedness.weakAreas,
      recommendation: s.preparedness.overall < 50
        ? 'Requires immediate attention — complete basic safety modules'
        : 'Needs improvement — practice simulations for weak areas',
    }))
    .sort((a, b) => a.score - b.score);
}
