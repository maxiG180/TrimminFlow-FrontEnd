import { z } from 'zod';

/**
 * Service Validation Schemas
 */
export const createServiceSchema = z.object({
  name: z
    .string()
    .min(1, 'Service name is required')
    .max(100, 'Service name must be less than 100 characters')
    .trim(),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  price: z
    .number({ message: 'Price must be a number' })
    .min(0, 'Price must be a positive value')
    .max(10000, 'Price must be less than 10,000'),
  durationMinutes: z
    .number({ message: 'Duration must be a number' })
    .int('Duration must be a whole number')
    .min(5, 'Duration must be at least 5 minutes')
    .max(480, 'Duration must be less than 8 hours (480 minutes)'),
});

export const updateServiceSchema = createServiceSchema.partial();

export type CreateServiceFormData = z.infer<typeof createServiceSchema>;
export type UpdateServiceFormData = z.infer<typeof updateServiceSchema>;

/**
 * Barber Validation Schemas
 */
export const createBarberSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes')
    .trim(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes')
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .regex(
      /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/,
      'Please enter a valid phone number'
    )
    .optional()
    .or(z.literal('')),
  bio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  profileImageUrl: z
    .string()
    .url('Please enter a valid URL')
    .max(500, 'Image URL must be less than 500 characters')
    .optional()
    .or(z.literal('')),
});

export const updateBarberSchema = createBarberSchema
  .extend({
    isActive: z.boolean().optional(),
  })
  .partial();

export type CreateBarberFormData = z.infer<typeof createBarberSchema>;
export type UpdateBarberFormData = z.infer<typeof updateBarberSchema>;

/**
 * Business Hours Validation Schema
 */
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const businessHoursSchema = z
  .object({
    dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
    isOpen: z.boolean(),
    openTime: z
      .string()
      .regex(timeRegex, 'Open time must be in HH:MM format (e.g., 09:00)')
      .optional()
      .or(z.literal('')),
    closeTime: z
      .string()
      .regex(timeRegex, 'Close time must be in HH:MM format (e.g., 18:00)')
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => {
      // If not open, times are optional
      if (!data.isOpen) return true;
      // If open, both times must be provided
      return !!data.openTime && !!data.closeTime;
    },
    {
      message: 'Open and close times are required when shop is marked as open',
      path: ['openTime'],
    }
  )
  .refine(
    (data) => {
      if (!data.isOpen || !data.openTime || !data.closeTime) return true;

      const [openHour, openMin] = data.openTime.split(':').map(Number);
      const [closeHour, closeMin] = data.closeTime.split(':').map(Number);

      const openMinutes = openHour * 60 + openMin;
      const closeMinutes = closeHour * 60 + closeMin;

      return openMinutes < closeMinutes;
    },
    {
      message: 'Open time must be before close time',
      path: ['closeTime'],
    }
  )
  .refine(
    (data) => {
      if (!data.isOpen || !data.openTime || !data.closeTime) return true;

      const [openHour, openMin] = data.openTime.split(':').map(Number);
      const [closeHour, closeMin] = data.closeTime.split(':').map(Number);

      const openMinutes = openHour * 60 + openMin;
      const closeMinutes = closeHour * 60 + closeMin;

      const duration = closeMinutes - openMinutes;

      return duration >= 60; // At least 1 hour
    },
    {
      message: 'Business must be open for at least 1 hour',
      path: ['closeTime'],
    }
  );

export type BusinessHoursFormData = z.infer<typeof businessHoursSchema>;
