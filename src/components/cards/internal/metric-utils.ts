import { RESOLVED_STATUSES } from "@/lib/constants";

/**
 * Calculates the percentage change between two values
 * @param current - Current value
 * @param baseline - Baseline value to compare against
 * @returns Percentage change (can be positive or negative)
 */
export function calculatePercentageChange(current: number, baseline: number): number {
  if (baseline === 0) return 0;
  return ((current - baseline) / baseline) * 100;
}

/**
 * Calculates resolution rate from status counts
 * @param statusCounts - Object mapping status to count
 * @returns Resolution rate as a percentage
 */
export function calculateResolutionRate(statusCounts: Record<string, number>): number {
  const total = Object.values(statusCounts).reduce((acc, curr) => acc + curr, 0);
  if (total === 0) return 0;

  const resolvedCount = RESOLVED_STATUSES.reduce((acc, status) => acc + (statusCounts[status] || 0), 0);
  return (resolvedCount / total) * 100;
}

/**
 * Calculates escalation rate from status counts
 * @param statusCounts - Object mapping status to count
 * @returns Escalation rate as a percentage
 */
export function calculateEscalationRate(statusCounts: Record<string, number>): number {
  const total = Object.values(statusCounts).reduce((acc, curr) => acc + curr, 0);
  if (total === 0) return 0;

  const escalations = statusCounts["blocked_needs_human"] || 0;
  return (escalations / total) * 100;
}

/**
 * Formats duration in seconds to HH:MM:SS format
 * @param duration - Duration in seconds (string or number)
 * @returns Formatted time string
 */
export function formatDuration(duration: string | number): string {
  const numDuration = typeof duration === 'string' ? parseFloat(duration) : duration;
  const totalSeconds = Math.floor(numDuration);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ].join(':');
}

/**
 * Formats percentage values with 2 decimal places
 * @param value - Percentage value (string or number)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: string | number): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return `${numValue.toFixed(2)}%`;
}

/**
 * Generates trend text based on change direction
 * @param change - Percentage change value
 * @param baseText - Base text to append direction to
 * @returns Trend description text
 */
export function generateTrendText(change: number, baseText: string): string {
  const direction = change > 0 ? "up" : "down";
  return `${baseText} ${direction}`;
} 