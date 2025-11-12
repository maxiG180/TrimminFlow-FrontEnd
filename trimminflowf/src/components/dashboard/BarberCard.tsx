'use client';

import React from 'react';
import { Edit2, Trash2, Mail, Phone, User } from 'lucide-react';
import { Barber } from '@/types/barber';

interface BarberCardProps {
  barber: Barber;
  onEdit: (barber: Barber) => void;
  onDelete: (barberId: string) => void;
}

export function BarberCard({ barber, onEdit, onDelete }: BarberCardProps) {
  const fullName = `${barber.firstName} ${barber.lastName}`;
  const initials = `${barber.firstName[0]}${barber.lastName[0]}`.toUpperCase();

  return (
    <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl border border-white/10 hover:border-yellow-400/30 transition-all">
      {/* Header with Avatar */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl font-bold text-black">{initials}</span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-white mb-1">{fullName}</h3>
          {barber.bio && (
            <p className="text-gray-400 text-sm line-clamp-2">{barber.bio}</p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(barber)}
            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all"
            title="Edit barber"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(barber.id)}
            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
            title="Delete barber"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 pt-4 border-t border-white/10">
        {barber.email && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Mail className="w-4 h-4" />
            <span className="truncate">{barber.email}</span>
          </div>
        )}
        {barber.phone && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Phone className="w-4 h-4" />
            <span>{barber.phone}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <User className="w-4 h-4" />
            <span>Barber</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            barber.isActive
              ? 'bg-green-500/20 text-green-400'
              : 'bg-gray-500/20 text-gray-400'
          }`}>
            {barber.isActive ? 'Active' : 'Inactive'}
          </div>
        </div>
      </div>
    </div>
  );
}
