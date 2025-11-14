import React from 'react';
import { Service } from '@/types/service';
import { DollarSign, Clock, Edit, Trash2 } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (serviceId: string) => void;
}

export function ServiceCard({ service, onEdit, onDelete }: ServiceCardProps) {
  return (
    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-yellow-400/30 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{service.name}</h3>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              service.isActive
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}
          >
            {service.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(service)}
            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all"
            aria-label="Edit service"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(service.id)}
            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
            aria-label="Delete service"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {service.description && (
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{service.description}</p>
      )}

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-yellow-400">
          <DollarSign className="w-4 h-4" />
          <span className="font-medium">€{service.price.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-400">
          <Clock className="w-4 h-4" />
          <span>{service.durationMinutes} min</span>
        </div>
      </div>
    </div>
  );
}
