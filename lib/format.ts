import { DAY } from '@/lib/crumbs';

const time = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
const day = (d: Date, opts: Intl.DateTimeFormatOptions) => d.toLocaleDateString('en-US', opts);
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

// Short label for lists: "Today, 4:52 PM", "Sun, 8:05 PM", "Aug 12".
export function when(ts: number) {
  const d = new Date(ts);
  const diff = Math.round((startOfDay(new Date()) - startOfDay(d)) / DAY);
  if (diff === 0) return `Today, ${time(d)}`;
  if (diff === 1) return `Yesterday, ${time(d)}`;
  if (diff < 7) return `${day(d, { weekday: 'short' })}, ${time(d)}`;
  return day(d, { month: 'short', day: 'numeric' });
}

// "Tue, Aug 12, at 11:48 PM"
export const full = (ts: number) =>
  `${day(new Date(ts), { weekday: 'short', month: 'short', day: 'numeric' })}, at ${time(new Date(ts))}`;

// "Tue, Dec 1"
export const dayLabel = (ts: number) =>
  day(new Date(ts), { weekday: 'short', month: 'short', day: 'numeric' });

// "Aug 12"
export const shortDate = (ts: number) => day(new Date(ts), { month: 'short', day: 'numeric' });

export function ago(ts: number) {
  const days = Math.floor((Date.now() - ts) / DAY);
  const unit = (n: number, s: string) => `${n} ${s}${n === 1 ? '' : 's'} ago`;
  if (days < 1) return 'today';
  if (days < 7) return unit(days, 'day');
  if (days < 30) return unit(Math.floor(days / 7), 'week');
  if (days < 365) return unit(Math.floor(days / 30), 'month');
  return unit(Math.floor(days / 365), 'year');
}

export const plural = (n: number, s: string) => `${n} ${s}${n === 1 ? '' : 's'}`;

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export const hourLabel = (h: number) => `${h % 12 || 12} ${h < 12 ? 'AM' : 'PM'}`;

export type Schedule = { mode: 'surprise' | 'fixed'; day: number; hour: number };

export const scheduleLabel = (s: Schedule) =>
  s.mode === 'surprise'
    ? 'Surprise me, any day and time'
    : `Every ${DAYS[s.day]} at ${hourLabel(s.hour)}`;
