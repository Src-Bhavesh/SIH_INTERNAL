import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(date: string): string {
  return new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
}

export function getPreparednessLevel(score: number): 'excellent' | 'good' | 'needs_improvement' | 'critical' {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 50) return 'needs_improvement';
  return 'critical';
}

export function getPreparednessColor(level: string): string {
  switch (level) {
    case 'excellent': return 'text-emerald-500';
    case 'good': return 'text-blue-500';
    case 'needs_improvement': return 'text-amber-500';
    case 'critical': return 'text-red-500';
    default: return 'text-gray-500';
  }
}

export function getPreparednessLabel(level: string): string {
  switch (level) {
    case 'excellent': return 'Excellent';
    case 'good': return 'Good';
    case 'needs_improvement': return 'Needs Improvement';
    case 'critical': return 'Critical';
    default: return 'Unknown';
  }
}

export function getDisasterIcon(type: string): string {
  switch (type) {
    case 'earthquake': return '🫨';
    case 'fire': return '🔥';
    case 'flood': return '🌊';
    case 'cyclone': return '🌀';
    case 'lightning': return '⚡';
    case 'heatwave': return '🌡️';
    case 'landslide': return '⛰️';
    case 'chemical': return '☣️';
    default: return '⚠️';
  }
}

export function getDisasterColor(type: string): string {
  switch (type) {
    case 'earthquake': return '#8B5E3C';
    case 'fire': return '#EF4444';
    case 'flood': return '#3B82F6';
    case 'cyclone': return '#8B5CF6';
    case 'lightning': return '#F59E0B';
    case 'heatwave': return '#F97316';
    case 'landslide': return '#6B7280';
    case 'chemical': return '#10B981';
    default: return '#6B7280';
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
