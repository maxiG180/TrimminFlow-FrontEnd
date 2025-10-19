'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi, RegisterResponse, ApiError } from '@/lib/api';
import { Button, Input, Card } from '@/components/ui';

// Zod Validation Schema
const registrationSchema = z.object({
  // Owner Information
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),

  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),

  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character (!@#$%^&*, etc.)'),

  // Barbershop Information
  barbershopName: z
    .string()
    .min(3, 'Barbershop name must be at least 3 characters')
    .max(100, 'Barbershop name must be less than 100 characters'),

  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/.test(val),
      'Please enter a valid phone number'
    ),

  address: z
    .string()
    .max(200, 'Address must be less than 200 characters')
    .optional(),
});

// Infer TypeScript type from Zod schema
type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function BarbershopRegistrationForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<RegisterResponse | null>(null);

  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onBlur', // Validate on blur for better UX
  });

  const onSubmit = async (data: RegistrationFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await authApi.register(data);
      setSuccess(response);
      reset(); // Reset form on success
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="lg:p-12">
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-6 py-4 rounded-xl mb-6 backdrop-blur-xl">
          <strong className="font-bold">Error:</strong> {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/20 border border-green-500/50 text-green-300 px-6 py-4 rounded-xl mb-6 backdrop-blur-xl">
          <strong className="font-bold">Success!</strong> {success.message}
          <div className="mt-3 text-sm space-y-1 text-green-200">
            <div><strong>User ID:</strong> {success.userId}</div>
            <div><strong>Barbershop ID:</strong> {success.barbershopId}</div>
            <div><strong>Email:</strong> {success.email}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold font-heading text-white/90 tracking-wide">Owner Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="First Name"
                placeholder="John"
                {...register('firstName')}
                error={errors.firstName?.message}
              />
            </div>

            <div>
              <Input
                label="Last Name"
                placeholder="Doe"
                {...register('lastName')}
                error={errors.lastName?.message}
              />
            </div>
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            {...register('email')}
            error={errors.email?.message}
          />

          <div>
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
            />
            <p className="text-xs text-white/50 mt-2">
              Must be 8+ characters with uppercase, lowercase, number, and special character
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-semibold font-heading text-white/90 tracking-wide">Barbershop Information</h3>

          <Input
            label="Barbershop Name"
            placeholder="Elite Cuts Barbershop"
            {...register('barbershopName')}
            error={errors.barbershopName?.message}
          />

          <Input
            label="Phone Number (Optional)"
            type="tel"
            placeholder="+1-555-0123"
            {...register('phone')}
            error={errors.phone?.message}
          />

          <Input
            label="Address (Optional)"
            placeholder="123 Main Street, Downtown"
            {...register('address')}
            error={errors.address?.message}
          />
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading || isSubmitting}
            className="w-full font-bold"
          >
            Register Barbershop
          </Button>
        </div>
      </form>
    </Card>
  );
}
