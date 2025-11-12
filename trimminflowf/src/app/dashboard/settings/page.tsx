'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  QrCode,
  Settings,
  LogOut,
  Clock,
  Save,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { businessHoursApi } from '@/lib/api';
import { BusinessHours, DAYS_OF_WEEK } from '@/types/businessHours';

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [businessHours, setBusinessHours] = useState<Record<string, BusinessHours>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const loadBusinessHours = useCallback(async () => {
    if (!user?.barbershopId) return;

    try {
      setIsLoading(true);
      const hours = await businessHoursApi.getAll(user.barbershopId);
      const hoursMap: Record<string, BusinessHours> = {};
      hours.forEach((h) => {
        hoursMap[h.dayOfWeek] = h;
      });
      setBusinessHours(hoursMap);
    } catch (err) {
      console.error('Failed to load business hours', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.barbershopId]);

  useEffect(() => {
    loadBusinessHours();
  }, [loadBusinessHours]);

  const handleToggleDay = (day: string) => {
    setBusinessHours((prev) => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        isOpen: !(prev[day]?.isOpen ?? true),
      } as BusinessHours,
    }));
  };

  const handleTimeChange = (day: string, field: 'openTime' | 'closeTime', value: string) => {
    setBusinessHours((prev) => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        [field]: value,
      } as BusinessHours,
    }));
  };

  const handleSave = async () => {
    if (!user?.barbershopId) return;

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      for (const day of DAYS_OF_WEEK) {
        const hours = businessHours[day];
        await businessHoursApi.set(user.barbershopId, {
          dayOfWeek: day,
          isOpen: hours?.isOpen ?? false,
          openTime: hours?.openTime,
          closeTime: hours?.closeTime,
        });
      }
      setSuccess('Business hours saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save business hours');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]">
      {/* Sidebar */}
      <div className="w-64 bg-black/20 backdrop-blur-xl border-r border-white/10 p-6">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center">
            <Scissors className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="text-white font-bold">TRIMMINFLOW</h2>
            <p className="text-xs text-gray-400">Settings</p>
          </div>
        </div>

        <nav className="space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
            { id: 'calendar', label: 'Calendar', icon: Calendar, href: '/dashboard/calendar' },
            { id: 'services', label: 'Services', icon: Scissors, href: '/dashboard/services' },
            { id: 'barbers', label: 'Barbers', icon: Users, href: '/dashboard/barbers' },
            { id: 'customers', label: 'Customers', icon: Users, href: '/dashboard/customers' },
            { id: 'qr', label: 'QR Codes', icon: QrCode, href: '/dashboard/qr' },
            { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/settings' },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = item.id === 'settings';
            return (
              <Link
                key={item.id}
                href={item.href}
                className={'flex items-center gap-3 px-4 py-3 rounded-xl transition-all ' + (
                  isActive
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400">Manage your barbershop settings</p>
          </div>

          {/* Business Hours Section */}
          <div className="rounded-3xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Business Hours</h2>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400">
                {success}
              </div>
            )}

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {DAYS_OF_WEEK.map((day) => {
                  const hours = businessHours[day];
                  const isOpen = hours?.isOpen ?? true;
                  const displayDay = day.charAt(0) + day.slice(1).toLowerCase();

                  return (
                    <div
                      key={day}
                      className="flex items-center gap-4 p-4 bg-black/20 rounded-xl"
                    >
                      <div className="flex items-center gap-3 w-32">
                        <input
                          type="checkbox"
                          checked={isOpen}
                          onChange={() => handleToggleDay(day)}
                          className="w-5 h-5 rounded border-gray-600 text-yellow-400 focus:ring-yellow-400"
                        />
                        <span className="text-white font-medium">{displayDay}</span>
                      </div>

                      {isOpen ? (
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex items-center gap-2">
                            <label className="text-gray-400 text-sm">Open:</label>
                            <input
                              type="time"
                              value={hours?.openTime || '09:00'}
                              onChange={(e) => handleTimeChange(day, 'openTime', e.target.value)}
                              className="px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="text-gray-400 text-sm">Close:</label>
                            <input
                              type="time"
                              value={hours?.closeTime || '18:00'}
                              onChange={(e) => handleTimeChange(day, 'closeTime', e.target.value)}
                              className="px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">Closed</span>
                      )}
                    </div>
                  );
                })}

                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-xl hover:from-yellow-500 hover:to-amber-600 transition-all flex items-center justify-center gap-2 font-medium disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {isSaving ? 'Saving...' : 'Save Business Hours'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
