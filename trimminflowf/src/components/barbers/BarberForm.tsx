import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBarberSchema, CreateBarberFormData, updateBarberSchema, UpdateBarberFormData } from '@/lib/validations';
import { BarberResponse } from '@/types/barber';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { Button } from '@/components/ui/Button';
import { CloudinaryUpload } from '@/components/ui/CloudinaryUpload';
import { X } from 'lucide-react';

interface BarberFormProps {
  onSubmit: (data: CreateBarberFormData | UpdateBarberFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: BarberResponse;
  isLoading?: boolean;
}

export function BarberForm({ onSubmit, onCancel, initialData, isLoading = false }: BarberFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateBarberFormData | UpdateBarberFormData>({
    resolver: zodResolver(initialData ? updateBarberSchema : createBarberSchema) as any,
    defaultValues: initialData
      ? {
          firstName: initialData.firstName,
          lastName: initialData.lastName,
          email: initialData.email || '',
          phone: initialData.phone || '',
          bio: initialData.bio || '',
          profileImageUrl: initialData.profileImageUrl || '',
        }
      : {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          bio: '',
          profileImageUrl: '',
        },
  });

  const profileImageUrl = watch('profileImageUrl');

  const handleImageUpload = (url: string) => {
    setValue('profileImageUrl', url, { shouldValidate: true });
  };

  const handleImageRemove = () => {
    setValue('profileImageUrl', '', { shouldValidate: true });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {initialData ? 'Edit Barber' : 'Add New Barber'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              {...register('firstName')}
              error={errors.firstName?.message}
              placeholder="John"
              required
            />

            <Input
              label="Last Name"
              {...register('lastName')}
              error={errors.lastName?.message}
              placeholder="Doe"
              required
            />
          </div>

          <Input
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            placeholder="john.doe@example.com"
          />

          <Input
            label="Phone"
            type="tel"
            {...register('phone')}
            error={errors.phone?.message}
            placeholder="+1 234 567 8900"
          />

          <TextArea
            label="Bio"
            {...register('bio')}
            error={errors.bio?.message}
            placeholder="Tell us about this barber..."
            rows={3}
          />

          {/* Cloudinary Upload Widget */}
          <CloudinaryUpload
            onUploadSuccess={handleImageUpload}
            currentImageUrl={profileImageUrl}
            onRemove={handleImageRemove}
          />

          {/* Manual URL Input (Alternative/Fallback) */}
          <details className="text-sm">
            <summary className="cursor-pointer text-gray-400 hover:text-gray-300 mb-2">
              Or enter image URL manually
            </summary>
            <div className="mt-2">
              <Input
                label="Profile Image URL"
                type="url"
                {...register('profileImageUrl')}
                error={errors.profileImageUrl?.message}
                placeholder="https://example.com/image.jpg"
                helperText="Paste an image URL from any source"
              />
            </div>
          </details>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Saving...' : initialData ? 'Update Barber' : 'Add Barber'}
            </Button>
            <Button type="button" onClick={onCancel} variant="secondary" disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
