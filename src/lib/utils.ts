import { FoodCategory, UrgencyLevel } from '../types';

/**
 * Calculates estimated meal servings based on quantity (kg) and category factor.
 * - Cooked Meals: 2.333x factor -> exactly 35 meals for 15 kg!
 * - Rice & Grains: 3.0x factor
 * - Bakery & Bread: 5.0x factor
 * - Raw Produce: 2.5x factor
 * - Packaged / Dairy: 2.0x factor
 */
export function calculateServings(qtyKg: number, category: FoodCategory | string): number {
  const kg = Math.max(0, Number(qtyKg) || 0);
  let factor = 2.33333333; // Default cooked food factor
  const cat = (category || '').toLowerCase();

  if (cat.includes('cooked')) {
    factor = 2.33333333;
  } else if (cat.includes('rice') || cat.includes('grain')) {
    factor = 3.0;
  } else if (cat.includes('bakery') || cat.includes('bread')) {
    factor = 5.0;
  } else if (cat.includes('produce') || cat.includes('fruit') || cat.includes('veg')) {
    factor = 2.5;
  } else if (cat.includes('dairy')) {
    factor = 2.5;
  } else if (cat.includes('packaged')) {
    factor = 2.0;
  }

  return Math.max(1, Math.round(kg * factor));
}

/**
 * Recalculates urgency level live based on available_until timestamp.
 * - Critical: < 1 hour remaining (Red)
 * - High: 1-2 hours remaining (Orange)
 * - Medium: 2-4 hours remaining (Amber/Yellow)
 * - Low: > 4 hours remaining (Green)
 */
export function getLiveUrgency(availableUntilIso: string): UrgencyLevel {
  if (!availableUntilIso) return 'medium';
  const deadline = new Date(availableUntilIso).getTime();
  const now = Date.now();
  const diffHours = (deadline - now) / (1000 * 60 * 60);

  if (diffHours <= 1) return 'critical';
  if (diffHours <= 2) return 'high';
  if (diffHours <= 4) return 'medium';
  return 'low';
}

/**
 * Formats remaining time until expiration in a human-friendly string.
 */
export function formatTimeRemaining(availableUntilIso: string): string {
  if (!availableUntilIso) return 'Time unspecified';
  const deadline = new Date(availableUntilIso).getTime();
  const now = Date.now();
  const diffMs = deadline - now;

  if (diffMs <= 0) return 'Expired';
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d remaining`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m left`;
  }
  return `${minutes} mins left`;
}

export function formatDateTime(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
