'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader, TrendingUp, DollarSign, Calendar, Users, Award } from 'lucide-react';

interface AnalyticsData {
    totalAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    noShowAppointments: number;
    totalRevenue: number;
    averageRevenue: number;
    popularServices: Array<{ serviceName: string; bookingCount: number; revenue: number }>;
    barberPerformance: Array<{ barberName: string; completedAppointments: number; revenue: number }>;
    todayAppointments: number;
    weekAppointments: number;
    monthAppointments: number;
}

export default function AnalyticsPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const { t } = useLanguage();
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (user?.barbershopId) {
            loadAnalytics();
        }
    }, [user]);

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/analytics`,
                {
                    credentials: 'include',
                }
            );

            if (response.ok) {
                const data = await response.json();
                setAnalytics(data);
            } else {
                setError(t.analytics.failedToLoad);
            }
        } catch (err) {
            setError(t.analytics.failedToLoad);
            console.error(err);
        } finally {
            setLoading(false);
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
            <div className="flex-1 p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">{t.analytics.title}</h1>
                    <p className="text-gray-400">{t.analytics.subtitle}</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-xl">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader className="w-8 h-8 text-yellow-400 animate-spin" />
                    </div>
                ) : analytics ? (
                    <div className="space-y-6">
                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Total Revenue */}
                            <div className="bg-gradient-to-br from-yellow-400/10 to-amber-500/10 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-400 text-sm">{t.analytics.totalRevenue}</span>
                                    <DollarSign className="w-5 h-5 text-yellow-400" />
                                </div>
                                <div className="text-3xl font-bold text-white">€{analytics.totalRevenue.toFixed(2)}</div>
                                <div className="text-xs text-gray-500 mt-1">{t.analytics.averagePerAppointment}: €{analytics.averageRevenue.toFixed(2)}/appt</div>
                            </div>

                            {/* Total Appointments */}
                            <div className="bg-gradient-to-br from-blue-400/10 to-blue-500/10 backdrop-blur-sm border border-blue-400/20 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-400 text-sm">{t.analytics.totalAppointments}</span>
                                    <Calendar className="w-5 h-5 text-blue-400" />
                                </div>
                                <div className="text-3xl font-bold text-white">{analytics.totalAppointments}</div>
                                <div className="text-xs text-gray-500 mt-1">{analytics.completedAppointments} {t.analytics.completed}</div>
                            </div>

                            {/* This Week */}
                            <div className="bg-gradient-to-br from-green-400/10 to-green-500/10 backdrop-blur-sm border border-green-400/20 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-400 text-sm">{t.analytics.thisWeek}</span>
                                    <TrendingUp className="w-5 h-5 text-green-400" />
                                </div>
                                <div className="text-3xl font-bold text-white">{analytics.weekAppointments}</div>
                                <div className="text-xs text-gray-500 mt-1">{analytics.todayAppointments} {t.analytics.todayCount}</div>
                            </div>

                            {/* Completion Rate */}
                            <div className="bg-gradient-to-br from-purple-400/10 to-purple-500/10 backdrop-blur-sm border border-purple-400/20 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-400 text-sm">{t.analytics.completionRate}</span>
                                    <Award className="w-5 h-5 text-purple-400" />
                                </div>
                                <div className="text-3xl font-bold text-white">
                                    {analytics.totalAppointments > 0
                                        ? ((analytics.completedAppointments / analytics.totalAppointments) * 100).toFixed(1)
                                        : 0}%
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{analytics.noShowAppointments} {t.analytics.noShows}</div>
                            </div>
                        </div>

                        {/* Charts Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Popular Services */}
                            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-yellow-400" />
                                    {t.analytics.popularServices}
                                </h2>
                                <div className="space-y-3">
                                    {analytics.popularServices.slice(0, 5).map((service, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-white font-medium">{service.serviceName}</span>
                                                    <span className="text-gray-400 text-sm">{service.bookingCount} {t.analytics.bookings}</span>
                                                </div>
                                                <div className="w-full bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2 rounded-full transition-all"
                                                        style={{
                                                            width: `${(service.bookingCount / analytics.popularServices[0]?.bookingCount) * 100}%`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <span className="text-green-400 font-bold ml-4">€{service.revenue.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Barber Performance */}
                            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-blue-400" />
                                    {t.analytics.barberPerformance}
                                </h2>
                                <div className="space-y-3">
                                    {analytics.barberPerformance.slice(0, 5).map((barber, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-white font-medium">{barber.barberName}</span>
                                                    <span className="text-gray-400 text-sm">{barber.completedAppointments} {t.analytics.completedAppointments}</span>
                                                </div>
                                                <div className="w-full bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full transition-all"
                                                        style={{
                                                            width: `${(barber.completedAppointments / analytics.barberPerformance[0]?.completedAppointments) * 100}%`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <span className="text-green-400 font-bold ml-4">€{barber.revenue.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-400 py-20">
                        {t.analytics.noData}
                    </div>
                )}
            </div>
        </div>
    );
}
