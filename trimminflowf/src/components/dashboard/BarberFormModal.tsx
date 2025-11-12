'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Barber, CreateBarberRequest } from '@/types/barber';

interface BarberFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formData: CreateBarberRequest;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  editingBarber: Barber | null;
  error: string;
}

export function BarberFormModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onChange,
  editingBarber,
  error,
}: BarberFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">
            {editingBarber ? 'Edit Barber' : 'Add New Barber'}
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-white mb-2">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={onChange}
                required
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                placeholder="John"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-white mb-2">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={onChange}
                required
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={onChange}
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-white mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={onChange}
              rows={3}
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Experienced barber with 10+ years..."
            />
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
              {editingBarber ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
