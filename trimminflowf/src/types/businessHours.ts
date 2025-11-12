export interface BusinessHours {
  id: string;
  barbershopId: string;
  dayOfWeek: string;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SetBusinessHoursRequest {
  dayOfWeek: string;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
}

export const DAYS_OF_WEEK = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
] as const;

export type DayOfWeek = typeof DAYS_OF_WEEK[number];
