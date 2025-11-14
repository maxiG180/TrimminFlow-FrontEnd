import React from 'react';
import { BarberResponse } from '@/types/barber';
import { Mail, Phone, Edit, Trash2, User } from 'lucide-react';

interface BarberCardProps {
  barber: BarberResponse;
  onEdit: (barber: BarberResponse) => void;
  onDelete: (barberId: string) => void;
}

export function BarberCard({ barber, onEdit, onDelete }: BarberCardProps) {
  return (
    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-yellow-400/30 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{barber.fullName}</h3>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                barber.isActive
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
              }`}
            >
              {barber.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(barber)}
            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all"
            aria-label="Edit barber"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(barber.id)}
            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
            aria-label="Delete barber"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {barber.bio && (
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{barber.bio}</p>
      )}

      <div className="space-y-2 text-sm">
        {barber.email && (
          <div className="flex items-center gap-2 text-gray-400">
            <Mail className="w-4 h-4" />
            <span className="truncate">{barber.email}</span>
          </div>
        )}
        {barber.phone && (
          <div className="flex items-center gap-2 text-gray-400">
            <Phone className="w-4 h-4" />
            <span>{barber.phone}</span>
          </div>
        )}
      </div>
    </div>
  );
}
