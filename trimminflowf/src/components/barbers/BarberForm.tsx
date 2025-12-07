import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBarberSchema, CreateBarberFormData, updateBarberSchema, UpdateBarberFormData } from '@/lib/validations';
import { BarberResponse } from '@/types/barber';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { Button } from '@/components/ui/Button';
import { X, Upload } from 'lucide-react';

interface BarberFormProps {
  onSubmit: (data: (CreateBarberFormData | UpdateBarberFormData) & { image?: File }) => Promise<void>;
  onCancel: () => void;
  initialData?: BarberResponse;
  isLoading?: boolean;
}

export function BarberForm({ onSubmit, onCancel, initialData, isLoading = false }: BarberFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.profileImageUrl || null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onFormSubmit = (data: CreateBarberFormData | UpdateBarberFormData) => {
    onSubmit({ ...data, image: selectedFile || undefined });
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

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Profile Image
            </label>

            {previewUrl && (
              <div className="relative w-24 h-24 mb-2">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full rounded-full object-cover border-2 border-yellow-400/30"
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 cursor-pointer transition-all">
                <Upload className="w-4 h-4" />
                {selectedFile ? 'Change Image' : 'Upload Image'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {selectedFile && (
                <span className="text-sm text-gray-400 truncate max-w-[150px]">
                  {selectedFile.name}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Max 5MB • JPG, PNG, WebP
            </p>
          </div>

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
