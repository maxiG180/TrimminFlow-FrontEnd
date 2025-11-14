'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { businessHoursApi } from '@/lib/api';
import { BusinessHoursResponse, DAYS_OF_WEEK, DayOfWeek } from '@/types/businessHours';
import { BusinessHoursFormData } from '@/lib/validations';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { BusinessHoursEditor } from '@/components/businessHours/BusinessHoursEditor';
import { Loader, Clock } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  // State
  const [businessHours, setBusinessHours] = useState<Record<string, BusinessHoursResponse>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [savingDay, setSavingDay] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Load business hours
  useEffect(() => {
    if (user?.barbershopId) {
      loadBusinessHours();
    }
  }, [user]);

  const loadBusinessHours = async () => {
    if (!user?.barbershopId) return;

    try {
      setIsLoading(true);
      setError('');

      const hours = await businessHoursApi.getAll(user.barbershopId);

      // Convert array to map for easy lookup
      const hoursMap: Record<string, BusinessHoursResponse> = {};
      hours.forEach((h) => {
        hoursMap[h.dayOfWeek] = h;
      });

      setBusinessHours(hoursMap);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load business hours');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: BusinessHoursFormData) => {
    if (!user?.barbershopId) return;

    setSavingDay(data.dayOfWeek);
    setError('');
    setSuccessMessage('');

    try {
      const response = await businessHoursApi.setHours(user.barbershopId, {
        dayOfWeek: data.dayOfWeek,
        isOpen: data.isOpen,
        openTime: data.isOpen ? data.openTime : undefined,
        closeTime: data.isOpen ? data.closeTime : undefined,
      });

      // Update local state
      setBusinessHours((prev) => ({
        ...prev,
        [data.dayOfWeek]: response,
      }));

      setSuccessMessage(`${data.dayOfWeek} hours updated successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save business hours');
    } finally {
      setSavingDay(null);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <Loader className="w-8 h-8 text-yellow-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <DashboardSidebar />

      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your barbershop settings and business hours</p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-xl">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 text-green-300 rounded-xl">
            {successMessage}
          </div>
        )}

        {/* Business Hours Section */}
        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Business Hours</h2>
              <p className="text-gray-400 text-sm">Set your shop's opening hours for each day</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader className="w-8 h-8 text-yellow-400 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {DAYS_OF_WEEK.map((day) => (
                <BusinessHoursEditor
                  key={day}
                  day={day}
                  hours={businessHours[day]}
                  onSave={handleSave}
                  isLoading={savingDay === day}
                />
              ))}
            </div>
          )}
        </div>

        {/* Additional Settings Sections can be added here */}
        <div className="mt-6 bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-2">Additional Settings</h3>
          <p className="text-gray-400">More settings will be available soon...</p>
        </div>
      </div>
    </div>
  );
}
