/**
 * Utility for conditional class name merging
 */
export function cn(...classes: (string | boolean | undefined | null | { [key: string]: boolean })[]): string {
  const result: string[] = [];

  for (const item of classes) {
    if (!item) continue;
    if (typeof item === 'string') {
      result.push(item);
    } else if (typeof item === 'object') {
      for (const [key, value] of Object.entries(item)) {
        if (value) result.push(key);
      }
    }
  }

  return result.join(' ').trim();
}

/**
 * Debounce helper for search input
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Category color mappings for spending charts
 */
export const CATEGORY_COLORS: Record<string, string> = {
  'Shopping': '#10B981',      // Emerald
  'Food & Dining': '#F59E0B',  // Amber
  'Food': '#F59E0B',           // Amber
  'Travel': '#3B82F6',         // Blue
  'Health': '#EC4899',         // Pink
  'Insurance': '#8B5CF6',      // Purple
  'Bills': '#06B6D4',          // Cyan
  'Bills & Utilities': '#06B6D4',
  'Entertainment': '#F43F5E',  // Rose
  'Fuel': '#EAB308',           // Yellow
  'Grocery': '#14B8A6',        // Teal
  'Electronics': '#6366F1',    // Indigo
  'Other': '#64748B',          // Slate
};

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || '#64748B';
}
