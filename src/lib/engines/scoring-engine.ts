// ═══════════════════════════════════════════════════════════════
// SurakshaOS — Simulation Scoring Engine
// Calculates per-simulation scores and the Institutional
// Disaster Readiness Index (IDRI).
// ═══════════════════════════════════════════════════════════════

import { SimulationDecision, SimulationScore, ScoreBreakdownItem, PreparednessScore, PreparednessComponent, Weakness } from '../types';
import { getPreparednessLevel } from '../utils';

interface ScoringWeights {
  decisionAccuracy: number;
  responseTime: number;
  safetyCompliance: number;
  evacuationDecisions: number;
}

const DEFAULT_WEIGHTS: ScoringWeights = {
  decisionAccuracy: 0.40,
  responseTime: 0.20,
  safetyCompliance: 0.20,
  evacuationDecisions: 0.20,
};

/**
 * Calculate a simulation score from a list of decisions
 */
export function calculateSimulationScore(
  decisions: SimulationDecision[],
  weights: ScoringWeights = DEFAULT_WEIGHTS
): SimulationScore {
  if (decisions.length === 0) {
    return {
      overall: 0,
      decisionAccuracy: 0,
      responseTime: 0,
      safetyCompliance: 0,
      evacuationDecisions: 0,
      breakdown: [],
    };
  }

  // Decision Accuracy: % of correct decisions
  const correctCount = decisions.filter(d => d.isCorrect).length;
  const decisionAccuracy = Math.round((correctCount / decisions.length) * 100);

  // Response Time: Score based on average response time (lower is better)
  const avgResponseMs = decisions.reduce((sum, d) => sum + d.responseTimeMs, 0) / decisions.length;
  // Optimal: <3s = 100, >15s = 0, linear scale
  const responseTime = Math.round(Math.max(0, Math.min(100, 100 - ((avgResponseMs / 1000 - 3) / 12) * 100)));

  // Safety Compliance: % of safe decisions
  const safeCount = decisions.filter(d => d.isSafe).length;
  const safetyCompliance = Math.round((safeCount / decisions.length) * 100);

  // Evacuation Decisions: weighted by phase (later phases matter more)
  const evacuationScore = calculateEvacuationScore(decisions);

  // Overall
  const overall = Math.round(
    decisionAccuracy * weights.decisionAccuracy +
    responseTime * weights.responseTime +
    safetyCompliance * weights.safetyCompliance +
    evacuationScore * weights.evacuationDecisions
  );

  const breakdown: ScoreBreakdownItem[] = [
    {
      label: 'Decision Accuracy',
      score: decisionAccuracy,
      maxScore: 100,
      feedback: decisionAccuracy === 100
        ? 'All decisions were correct!'
        : `${decisions.length - correctCount} incorrect decision(s). Review the feedback for each step.`,
    },
    {
      label: 'Response Time',
      score: responseTime,
      maxScore: 100,
      feedback: responseTime >= 80
        ? 'Quick decision-making under pressure!'
        : 'Try to make decisions faster — in real emergencies, every second counts.',
    },
    {
      label: 'Safety Compliance',
      score: safetyCompliance,
      maxScore: 100,
      feedback: safetyCompliance === 100
        ? 'All safety protocols followed.'
        : `${decisions.length - safeCount} unsafe decision(s). Never compromise on safety.`,
    },
    {
      label: 'Evacuation Decisions',
      score: evacuationScore,
      maxScore: 100,
      feedback: evacuationScore >= 80
        ? 'Excellent evacuation decision-making.'
        : 'Improve your evacuation route choices and assembly point procedures.',
    },
  ];

  return {
    overall,
    decisionAccuracy,
    responseTime,
    safetyCompliance,
    evacuationDecisions: evacuationScore,
    breakdown,
  };
}

function calculateEvacuationScore(decisions: SimulationDecision[]): number {
  // Weight later decisions more heavily (evacuation phases)
  let totalWeight = 0;
  let weightedScore = 0;

  decisions.forEach((d, i) => {
    const phaseWeight = 1 + (i / decisions.length); // 1.0 to ~2.0
    totalWeight += phaseWeight;
    weightedScore += (d.isCorrect ? 100 : d.isSafe ? 40 : 0) * phaseWeight;
  });

  return totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
}

// ── IDRI Calculation ──

interface IDRIInput {
  studentPreparedness: number;
  teacherPreparedness: number;
  trainingCompletion: number;
  simulationPerformance: number;
  drillPerformance: number;
  emergencyPlan: number;
  responseCoordination: number;
}

const IDRI_WEIGHTS: Record<keyof IDRIInput, number> = {
  studentPreparedness: 0.25,
  teacherPreparedness: 0.15,
  trainingCompletion: 0.15,
  simulationPerformance: 0.15,
  drillPerformance: 0.15,
  emergencyPlan: 0.10,
  responseCoordination: 0.05,
};

const IDRI_LABELS: Record<keyof IDRIInput, { name: string; icon: string }> = {
  studentPreparedness: { name: 'Student Preparedness', icon: '🎓' },
  teacherPreparedness: { name: 'Teacher Preparedness', icon: '👩‍🏫' },
  trainingCompletion: { name: 'Training Completion', icon: '📚' },
  simulationPerformance: { name: 'Simulation Performance', icon: '🎮' },
  drillPerformance: { name: 'Drill Performance', icon: '🏃' },
  emergencyPlan: { name: 'Emergency Plan', icon: '📋' },
  responseCoordination: { name: 'Response Coordination', icon: '📡' },
};

/**
 * Calculate the Institutional Disaster Readiness Index (IDRI)
 */
export function calculateIDRI(input: IDRIInput): PreparednessScore {
  let overall = 0;
  const components: PreparednessComponent[] = [];
  const weaknesses: Weakness[] = [];

  for (const [key, value] of Object.entries(input) as [keyof IDRIInput, number][]) {
    const weight = IDRI_WEIGHTS[key];
    const label = IDRI_LABELS[key];
    overall += value * weight;

    components.push({
      name: label.name,
      score: value,
      weight: weight * 100,
      icon: label.icon,
    });

    // Identify weaknesses (below 80 is a weakness)
    if (value < 80) {
      const impact = -Math.round((80 - value) * weight * 100) / 100;
      weaknesses.push({
        area: label.name,
        impact: Math.round(impact),
        description: `${label.name} score is ${value}% — below the 80% target`,
      });
    }
  }

  overall = Math.round(overall);
  const level = getPreparednessLevel(overall);

  // Sort weaknesses by impact
  weaknesses.sort((a, b) => a.impact - b.impact);

  // Generate recommendations
  const recommendations = weaknesses.map(w => {
    switch (w.area) {
      case 'Student Preparedness':
        return 'Encourage more students to complete disaster simulations and training modules';
      case 'Teacher Preparedness':
        return 'Schedule teacher disaster preparedness training workshop';
      case 'Training Completion':
        return 'Assign pending training modules to students who have not completed them';
      case 'Simulation Performance':
        return 'Review simulation weak areas and conduct targeted practice sessions';
      case 'Drill Performance':
        return 'Conduct more frequent drills with focus on identified weak areas';
      case 'Emergency Plan':
        return 'Update and complete the school emergency plan documentation';
      case 'Response Coordination':
        return 'Practice assembly point attendance verification procedures';
      default:
        return `Improve ${w.area} to meet the 80% target`;
    }
  });

  return {
    overall,
    level,
    components,
    weaknesses,
    recommendations,
    calculatedAt: new Date().toISOString(),
  };
}
