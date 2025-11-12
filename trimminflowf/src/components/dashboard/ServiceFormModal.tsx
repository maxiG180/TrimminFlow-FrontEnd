'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Service, CreateServiceRequest } from '@/types/service';

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formData: CreateServiceRequest;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  editingService: Service | null;
  error: string;
}

export function ServiceFormModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onChange,
  editingService,
  error,
}: ServiceFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">
            {editingService ? 'Edit Service' : 'Add New Service'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
              Service Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={onChange}
              required
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
              placeholder="e.g., Classic Haircut"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={onChange}
              rows={3}
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Describe the service..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-white mb-2">
                Price (€) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={onChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label htmlFor="durationMinutes" className="block text-sm font-medium text-white mb-2">
                Duration (min) *
              </label>
              <input
                type="number"
                id="durationMinutes"
                name="durationMinutes"
                value={formData.durationMinutes}
                onChange={onChange}
                required
                min="1"
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-xl hover:from-yellow-500 hover:to-amber-600 transition-all font-medium"
            >
              {editingService ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
