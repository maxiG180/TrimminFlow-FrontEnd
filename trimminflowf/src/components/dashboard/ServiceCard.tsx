'use client';

import React from 'react';
import { Edit2, Trash2, Clock, Euro } from 'lucide-react';
import { Service } from '@/types/service';

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (serviceId: string) => void;
}

export function ServiceCard({ service, onEdit, onDelete }: ServiceCardProps) {
  return (
    <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl border border-white/10 hover:border-yellow-400/30 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
          <p className="text-gray-400 text-sm line-clamp-2">
            {service.description || 'No description'}
          </p>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(service)}
            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all"
            title="Edit service"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(service.id)}
            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
            title="Delete service"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-yellow-400">
          <Euro className="w-5 h-5" />
          <span className="font-bold text-lg">{service.price.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{service.durationMinutes} min</span>
        </div>
        <div className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${
          service.isActive
            ? 'bg-green-500/20 text-green-400'
            : 'bg-gray-500/20 text-gray-400'
        }`}>
          {service.isActive ? 'Active' : 'Inactive'}
        </div>
      </div>
    </div>
  );
}
