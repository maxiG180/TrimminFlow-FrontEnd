import React from 'react';
import { BusinessHoursFormData } from '@/lib/validations';
import { DayOfWeek, DAY_LABELS } from '@/types/businessHours';
import { Clock } from 'lucide-react';

interface BusinessHoursEditorProps {
  day: DayOfWeek;
  value: BusinessHoursFormData;
  onChange: (data: BusinessHoursFormData) => void;
}

export function BusinessHoursEditor({ day, value, onChange }: BusinessHoursEditorProps) {

  const handleIsOpenChange = (checked: boolean) => {
    onChange({
      ...value,
      isOpen: checked,
      // If opening, ensure defaults if missing
      openTime: checked ? (value.openTime || '09:00') : value.openTime,
      closeTime: checked ? (value.closeTime || '18:00') : value.closeTime,
    });
  };

  const handleChange = (field: keyof BusinessHoursFormData, val: string) => {
    onChange({
      ...value,
      [field]: val,
    });
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-yellow-400/20 transition-all">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-black" />
            </div>
            <h3 className="text-lg font-semibold text-white">{DAY_LABELS[day]}</h3>
          </div>

          {/* Toggle Open/Closed */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value.isOpen}
              onChange={(e) => handleIsOpenChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-400 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-yellow-400 peer-checked:to-amber-500"></div>
            <span className="ms-3 text-sm font-medium text-gray-300">
              {value.isOpen ? 'Open' : 'Closed'}
            </span>
          </label>
        </div>

        {/* Time Inputs */}
        {value.isOpen && (
          <div className="space-y-3 mb-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Open Time</label>
                <input
                  type="time"
                  value={value.openTime || ''}
                  onChange={(e) => handleChange('openTime', e.target.value)}
                  className="w-full px-3 py-2 bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Close Time</label>
                <input
                  type="time"
                  value={value.closeTime || ''}
                  onChange={(e) => handleChange('closeTime', e.target.value)}
                  className="w-full px-3 py-2 bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
