'use client';

import React from 'react';
import { cn, getPreparednessColor, getPreparednessLabel, getPreparednessLevel } from '@/lib/utils';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
  animate?: boolean;
}

export default function ScoreRing({
  score,
  size = 140,
  strokeWidth = 10,
  className,
  showLabel = true,
  animate = true,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const level = getPreparednessLevel(score);

  // 25% Sage green for high scores, 10% Baby pink for medium, 5% Alert for critical
  const strokeColor = (() => {
    switch (level) {
      case 'excellent': return '#587B64'; // Sage Green
      case 'good': return '#769E83';      // Light Sage Green
      case 'needs_improvement': return '#E26D85'; // Baby Pink Accent
      case 'critical': return '#DC2626';  // Alert
      default: return '#E8E2D5';
    }
  })();

  const labelColor = (() => {
    switch (level) {
      case 'excellent': return 'text-[#375340] bg-[#EBF1EC] border-[#C5D7C8]';
      case 'good': return 'text-[#375340] bg-[#EBF1EC] border-[#C5D7C8]';
      case 'needs_improvement': return 'text-[#9B2C46] bg-[#FDE8EC] border-[#F8CCD5]';
      case 'critical': return 'text-[#991B1B] bg-[#FEF2F2] border-[#FECACA]';
      default: return 'text-[#5E6660] bg-[#F4EFE6] border-[#E8E2D5]';
    }
  })();

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle in warm almond */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#EFEBE2"
            strokeWidth={strokeWidth}
          />
          {/* Score arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={animate ? 'score-ring-animate' : ''}
            style={animate ? { strokeDashoffset: offset } : undefined}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold tracking-tight text-[#1C221E]">{score}</span>
          <span className="text-xs text-[#5E6660] font-medium">/100</span>
        </div>
      </div>
      {showLabel && (
        <span className={cn('text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border', labelColor)}>
          {getPreparednessLabel(level)}
        </span>
      )}
    </div>
  );
}
