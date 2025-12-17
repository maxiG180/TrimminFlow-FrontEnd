'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { businessHoursApi } from '@/lib/api';
import { BusinessHoursResponse, DAYS_OF_WEEK, DayOfWeek } from '@/types/businessHours';
import { BusinessHoursFormData } from '@/lib/validations';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { BusinessHoursEditor } from '@/components/businessHours/BusinessHoursEditor';
import { Loader, Clock, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  // State
  // We keep track of the form data for each day
  const [hoursState, setHoursState] = useState<Record<string, BusinessHoursFormData>>({});
  const [initialState, setInitialState] = useState<Record<string, BusinessHoursFormData>>({});

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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

      // Convert to map for state
      const hoursMap: Record<string, BusinessHoursFormData> = {};

      // Initialize all days with defaults or fetched values
      DAYS_OF_WEEK.forEach(day => {
        const found = hours.find(h => h.dayOfWeek === day);
        hoursMap[day] = {
          dayOfWeek: day,
          isOpen: found?.isOpen ?? (day !== 'SUNDAY' && day !== 'SATURDAY'), // Default week days open
          openTime: found?.openTime || '09:00',
          closeTime: found?.closeTime || '18:00',
        };
      });

      setHoursState(hoursMap);
      setInitialState(JSON.parse(JSON.stringify(hoursMap))); // Deep copy for comparison across re-renders
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load business hours');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDayChange = (day: string, data: BusinessHoursFormData) => {
    setHoursState(prev => ({
      ...prev,
      [day]: data
    }));
  };

  const handleSaveAll = async () => {
    if (!user?.barbershopId) return;

    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      // Create an array of promises for all days
      // We send all of them to ensure consistency, or we could optimize to send only changed ones.
      // For simplicity and robustness, let's send all.
      const promises = DAYS_OF_WEEK.map(day => {
        const data = hoursState[day];
        return businessHoursApi.setHours(user.barbershopId, {
          dayOfWeek: data.dayOfWeek,
          isOpen: data.isOpen,
          openTime: data.isOpen ? data.openTime : undefined,
          closeTime: data.isOpen ? data.closeTime : undefined,
        });
      });

      await Promise.all(promises);

      setSuccessMessage('Business hours updated successfully!');
      setInitialState(JSON.parse(JSON.stringify(hoursState))); // Update baseline
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = JSON.stringify(hoursState) !== JSON.stringify(initialState); // Simple comparison

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
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400">Manage your barbershop settings and business hours</p>
          </div>

          <Button
            onClick={handleSaveAll}
            disabled={isSaving || !hasChanges}
            className={`flex items-center gap-2 ${hasChanges ? 'animate-pulse' : ''}`}
          >
            {isSaving ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
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
                  value={hoursState[day] || {
                    dayOfWeek: day,
                    isOpen: false,
                    openTime: '09:00',
                    closeTime: '18:00'
                  }}
                  onChange={(data) => handleDayChange(day, data)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Logo Upload Section */}
        <div className="mt-6 bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Barbershop Logo</h2>
              <p className="text-gray-400 text-sm">Upload your logo to appear on the booking page</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Current Logo Preview */}
            <div className="flex-shrink-0">
              {user.barbershop?.logoUrl ? (
                <div className="relative group">
                  <img
                    src={user.barbershop.logoUrl}
                    alt="Barbershop Logo"
                    className="w-32 h-32 rounded-xl object-cover border-2 border-yellow-400/20"
                  />
                  <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm">Current Logo</span>
                  </div>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-4xl font-bold text-black">
                  {user.barbershop?.name?.charAt(0) || '?'}
                </div>
              )}
            </div>

            {/* Upload Button */}
            <div className="flex-1">
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file || !user?.barbershopId) return;

                    try {
                      const formData = new FormData();
                      formData.append('file', file);

                      const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/barbershops/${user.barbershopId}/upload-logo`,
                        {
                          method: 'POST',
                          credentials: 'include',
                          body: formData,
                        }
                      );

                      if (response.ok) {
                        setSuccessMessage('Logo uploaded successfully! Refresh to see changes.');
                        setTimeout(() => window.location.reload(), 1500);
                      } else {
                        setError('Failed to upload logo. Please try again.');
                      }
                    } catch (err) {
                      setError('Failed to upload logo. Please try again.');
                    }
                  }}
                />
                <div className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-semibold rounded-lg transition-all shadow-md hover:shadow-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload New Logo
                </div>
              </label>
              <p className="text-gray-500 text-xs mt-2">Recommended: Square image, at least 400x400px (JPG, PNG)</p>
            </div>
          </div>
        </div>

        {/* Email Reminders Toggle */}
        <div className="mt-6 bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">24-Hour Reminder Emails</h3>
                <p className="text-gray-400 text-sm">Send automatic email reminders to customers 24 hours before their appointment</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={user.barbershop?.reminderEmailsEnabled ?? true}
                onChange={async (e) => {
                  if (!user?.barbershopId) return;

                  try {
                    const response = await fetch(
                      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/barbershops/${user.barbershopId}/reminder-settings`,
                      {
                        method: 'PUT',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ reminderEmailsEnabled: e.target.checked }),
                      }
                    );

                    if (response.ok) {
                      setSuccessMessage(`Reminder emails ${e.target.checked ? 'enabled' : 'disabled'} successfully!`);
                      setTimeout(() => window.location.reload(), 1500);
                    } else {
                      setError('Failed to update settings. Please try again.');
                    }
                  } catch (err) {
                    setError('Failed to update settings. Please try again.');
                  }
                }}
              />
              <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
