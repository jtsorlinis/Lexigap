const MELBOURNE_TIMEZONE = 'Australia/Melbourne';
const DAY_IN_MS = 24 * 60 * 60 * 1000;

// Always derive the day in Melbourne regardless of the browser's local timezone.
const melbourneDateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: MELBOURNE_TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

function toIsoDate(parts: Intl.DateTimeFormatPart[]): string {
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  if (!year || !month || !day) {
    throw new Error('Unable to derive Melbourne date parts.');
  }

  return `${year}-${month}-${day}`;
}

export function getMelbourneIsoDate(referenceDate: Date = new Date()): string {
  return toIsoDate(melbourneDateFormatter.formatToParts(referenceDate));
}

export function isoDateToUtcMs(isoDate: string): number {
  const [year, month, day] = isoDate.split('-').map((value) => Number.parseInt(value, 10));

  if (!year || !month || !day) {
    throw new Error(`Invalid ISO date: ${isoDate}`);
  }

  return Date.UTC(year, month - 1, day);
}

export function daysBetweenIsoDates(startIsoDate: string, endIsoDate: string): number {
  // ISO dates are interpreted as calendar days (UTC midnight) for stable puzzle numbering.
  const deltaMs = isoDateToUtcMs(endIsoDate) - isoDateToUtcMs(startIsoDate);
  return Math.floor(deltaMs / DAY_IN_MS);
}

export { MELBOURNE_TIMEZONE };
