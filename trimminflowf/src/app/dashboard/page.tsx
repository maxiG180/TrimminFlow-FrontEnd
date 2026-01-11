'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Plus,
  ArrowUpRight,
  Scissors,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [activeBarbers, setActiveBarbers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    todayCount: 0,
    todayRevenue: 0,
    totalCustomers: 0,
    weeklyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Fetch dashboard data
  useEffect(() => {
    if (user?.barbershopId) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch analytics data
      const analyticsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/analytics`,
        { credentials: 'include' }
      );

      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();

        // Fetch appointments for today
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
        const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

        const appointmentsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/appointments?startDate=${startOfDay}&endDate=${endOfDay}`,
          { credentials: 'include' }
        );

        let todayRevenue = 0;
        if (appointmentsResponse.ok) {
          const appointmentsData = await appointmentsResponse.json();
          const todayAppts = (appointmentsData.content || appointmentsData).filter((apt: any) => {
            const aptDate = new Date(apt.appointmentDateTime);
            return aptDate.toDateString() === new Date().toDateString();
          });
          setTodayAppointments(todayAppts);
          todayRevenue = todayAppts.reduce((sum: number, apt: any) => sum + (apt.service?.price || 0), 0);
        }

        // Fetch barbers
        const barbersResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/barbers`,
          { credentials: 'include' }
        );

        if (barbersResponse.ok) {
          const barbersData = await barbersResponse.json();
          setActiveBarbers((barbersData.content || barbersData).filter((b: any) => b.active !== false));
        }

        setStats({
          todayCount: analyticsData.todayAppointments || 0,
          todayRevenue: todayRevenue,
          totalCustomers: analyticsData.totalAppointments || 0,
          weeklyRevenue: analyticsData.totalRevenue || 0,
        });
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking auth
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] flex items-center justify-center" suppressHydrationWarning>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const statsData = [
    {
      title: t.dashboard.todayAppointments,
      value: stats.todayCount.toString(),
      change: `€${stats.todayRevenue.toFixed(2)}`,
      iconSvg: '/svg_custom/clock-svgrepo-com.svg',
      gradient: 'from-yellow-400 to-amber-500',
      bgGradient: 'from-yellow-400/10 to-amber-500/10',
    },
    {
      title: t.dashboard.totalAppointments,
      value: stats.totalCustomers.toString(),
      change: 'All time',
      iconSvg: '/svg_custom/people-who-support-svgrepo-com.svg',
      gradient: 'from-amber-400 to-yellow-500',
      bgGradient: 'from-amber-400/10 to-yellow-500/10',
    },
    {
      title: t.dashboard.weeklyRevenue,
      value: `€${stats.weeklyRevenue.toFixed(2)}`,
      change: 'All time',
      iconSvg: '/svg_custom/euro-banknote-svgrepo-com.svg',
      gradient: 'from-yellow-600 to-amber-700',
      bgGradient: 'from-yellow-600/10 to-amber-700/10',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'CONFIRMED':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'CANCELLED':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="p-6" suppressHydrationWarning>


      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 pt-20 lg:pt-8">
          {/* Header */}
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-yellow-200 bg-clip-text text-transparent mb-1 sm:mb-2">
                Welcome back, {user.firstName}!
              </h1>
              <p className="text-gray-400 text-sm sm:text-base lg:text-lg">Here's what's happening with your barbershop today.</p>
            </div>
            <Link
              href="/dashboard/appointments/new"
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-xl hover:from-yellow-500 hover:to-amber-600 transition-all flex items-center justify-center gap-2 font-medium text-sm sm:text-base whitespace-nowrap"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              {t.dashboard.newAppointment}
            </Link>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {statsData.map((stat, index) => (
              <motion.div
                key={index}
                className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl border border-white/10 p-4 sm:p-6 hover:border-yellow-400/40 transition-all cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.01 }}
              >
                {/* Decorative gradient blob */}
                <div className={`absolute -top-12 -right-12 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br ${stat.bgGradient} rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity`}></div>

                {/* Accent line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`}></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <p className="text-gray-300 font-semibold text-xs sm:text-sm uppercase tracking-wide">{stat.title}</p>
                    <Image
                      src={stat.iconSvg}
                      alt={stat.title}
                      width={48}
                      height={48}
                      className={`object-contain group-hover:scale-110 transition-transform ${stat.iconSvg.includes('people-who-support')
                        ? 'w-12 h-12 sm:w-16 sm:h-16'
                        : 'w-10 h-10 sm:w-12 sm:h-12'
                        }`}
                    />
                  </div>
                  <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2 sm:mb-3 tracking-tight">{stat.value}</p>
                  <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-black/30 rounded-lg w-fit">
                    <Image
                      src={stat.iconSvg}
                      alt={stat.title}
                      width={14}
                      height={14}
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                    />
                    <span className="text-xs font-bold text-yellow-400">{stat.change}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Today's Appointments */}
            <motion.div
              className="lg:col-span-2 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl border border-white/10 p-4 sm:p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Image
                    src="/svg_custom/clock-svgrepo-com.svg"
                    alt="Calendar"
                    width={28}
                    height={28}
                    className="w-7 h-7"
                  />
                  {t.dashboard.todayAppointments}
                </h2>
                <Link href="/dashboard/calendar" className="text-yellow-400 hover:text-yellow-300 text-sm font-medium flex items-center gap-1">
                  {t.dashboard.viewAll}
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-3">
                {todayAppointments.length > 0 ? (
                  todayAppointments.map((apt) => (
                    <div key={apt.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-white">{apt.customerName}</span>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${apt.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                          {apt.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">{apt.service.name}</span>
                        <span className="text-yellow-400 font-semibold">€{apt.service.price}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {apt.barber.firstName} {apt.barber.lastName} • {new Date(apt.appointmentDateTime).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-8">{t.dashboard.noAppointments}</p>
                )}
              </div>
            </motion.div>

            {/* Quick Stats Sidebar */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {/* Active Barbers */}
              <div className="rounded-3xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl border border-white/10 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Image
                    src="/img/logo.png"
                    alt="Barbers"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                  {t.dashboard.activeBarbers}
                </h3>
                <div className="space-y-3">
                  {activeBarbers.length > 0 ? (
                    activeBarbers.map((barber) => (
                      <div key={barber.id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center text-black font-bold">
                          {barber.firstName[0]}{barber.lastName[0]}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm">{barber.firstName} {barber.lastName}</p>
                          <p className="text-green-400 text-xs">● Active</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-center py-4 text-sm">{t.dashboard.noBarbers}</p>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-3xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl border border-white/10 p-6">
                <h3 className="text-lg font-bold text-white mb-4">{t.dashboard.quickActions}</h3>
                <div className="space-y-2">
                  <Link
                    href="/dashboard/appointments/new"
                    className="block w-full px-4 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-xl hover:from-yellow-500 hover:to-amber-600 transition-all font-medium text-center"
                  >
                    {t.dashboard.addAppointment}
                  </Link>
                  <Link
                    href="/dashboard/customers"
                    className="block w-full px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all font-medium text-center"
                  >
                    {t.dashboard.manageCustomers}
                  </Link>
                  <Link
                    href="/dashboard/calendar"
                    className="block w-full px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all font-medium text-center"
                  >
                    {t.dashboard.viewCalendar}
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
