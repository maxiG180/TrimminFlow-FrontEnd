export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface BusinessHours {
  id: string;
  barbershopId: string;
  dayOfWeek: DayOfWeek;
  isOpen: boolean;
  openTime?: string; // Format: "HH:mm" (e.g., "09:00")
  closeTime?: string; // Format: "HH:mm" (e.g., "18:00")
  createdAt: string;
  updatedAt: string;
}

export interface SetBusinessHoursRequest {
  dayOfWeek: DayOfWeek;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
}

export interface BusinessHoursResponse extends BusinessHours {}

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
  SUNDAY: 'Sunday',
};
