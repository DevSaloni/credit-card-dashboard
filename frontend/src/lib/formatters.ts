/**
 * Formats a number into Indian Rupee currency format (e.g. ₹1,24,560.00 or ₹912.62)
 */
export function formatINR(amount: number, showDecimals: boolean = true): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0.00';
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(absAmount);

  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Compact Indian Rupee formatter (e.g. ₹1.25L, ₹45K)
 */
export function formatCompactINR(amount: number): string {
  if (isNaN(amount) || amount === null) return '₹0';
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}k`;
  }
  return formatINR(amount, false);
}

/**
 * Formats a number with comma separators (e.g. 2,450 or 10,000)
 */
export function formatNumber(num: number): string {
  if (isNaN(num) || num === null) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
}

/**
 * Safely parses any date representation (ISO string, epoch ms, Date object)
 */
export function parseDate(value: string | number | Date): Date {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  if (typeof value === 'number') return new Date(value);
  
  // Check if string is numeric timestamp
  if (/^\d+$/.test(value)) {
    return new Date(Number(value));
  }
  
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

/**
 * Formats a date into a standard readable display: "03 Oct 2025"
 */
export function formatDate(value: string | number | Date): string {
  const date = parseDate(value);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * Formats time into "09:03 PM"
 */
export function formatTime(value: string | number | Date): string {
  const date = parseDate(value);
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Formats date and time: "03 Oct 2025, 09:03 PM"
 */
export function formatDateTime(value: string | number | Date): string {
  return `${formatDate(value)}, ${formatTime(value)}`;
}

/**
 * Formats month key e.g. "2025-10" to "Oct 2025"
 */
export function formatMonthYear(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  }).format(date);
}
