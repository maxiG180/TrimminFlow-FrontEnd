import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createServiceSchema, CreateServiceFormData } from '@/lib/validations';
import { Service } from '@/types/service';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';

interface ServiceFormProps {
  onSubmit: (data: CreateServiceFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Service;
  isLoading?: boolean;
}

export function ServiceForm({ onSubmit, onCancel, initialData, isLoading = false }: ServiceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateServiceFormData>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description || '',
          price: initialData.price,
          durationMinutes: initialData.durationMinutes,
        }
      : {
          name: '',
          description: '',
          price: 0,
          durationMinutes: 30,
        },
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {initialData ? 'Edit Service' : 'Add New Service'}
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
          <Input
            label="Service Name"
            {...register('name')}
            error={errors.name?.message}
            placeholder="e.g., Haircut"
            required
          />

          <TextArea
            label="Description"
            {...register('description')}
            error={errors.description?.message}
            placeholder="Describe your service..."
            rows={3}
          />

          <Input
            label="Price (€)"
            type="number"
            step="0.01"
            {...register('price', { valueAsNumber: true })}
            error={errors.price?.message}
            placeholder="15.00"
            required
          />

          <Input
            label="Duration (minutes)"
            type="number"
            {...register('durationMinutes', { valueAsNumber: true })}
            error={errors.durationMinutes?.message}
            placeholder="30"
            required
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Saving...' : initialData ? 'Update Service' : 'Create Service'}
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
