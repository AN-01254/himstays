const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isIsoDate(value: string): boolean {
  if (!ISO.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function todayInKolkata(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function addDays(iso: string, days: number): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function daysBetween(start: string, end: string): number {
  const [startYear, startMonth, startDay] = start.split("-").map(Number);
  const [endYear, endMonth, endDay] = end.split("-").map(Number);
  const startUtc = Date.UTC(startYear, startMonth - 1, startDay);
  const endUtc = Date.UTC(endYear, endMonth - 1, endDay);
  return Math.round((endUtc - startUtc) / 86_400_000);
}

export function eachNight(checkIn: string, checkOut: string): string[] {
  const count = daysBetween(checkIn, checkOut);
  if (count <= 0) return [];
  return Array.from({ length: count }, (_, index) => addDays(checkIn, index));
}

export function weekdayIndex(iso: string): number {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

function format(iso: string, options: Intl.DateTimeFormatOptions): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "UTC",
    ...options,
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function formatDay(iso: string): string {
  return format(iso, { day: "numeric", month: "short" });
}

export function formatLong(iso: string): string {
  return format(iso, { weekday: "short", day: "numeric", month: "short" });
}

export function formatWeekday(iso: string): string {
  return format(iso, { weekday: "short" });
}

export function formatDayNumber(iso: string): string {
  return format(iso, { day: "numeric" });
}

export function inr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function elevationLabel(meters: number): string {
  return `${meters.toLocaleString("en-IN")} m`;
}
