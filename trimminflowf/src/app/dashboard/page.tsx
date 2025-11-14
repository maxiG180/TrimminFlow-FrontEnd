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
import { mockAppointments, mockBarbers, mockStats } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/layout/DashboardSidebar';

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Show loading state while checking auth
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Get today's appointments
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = mockAppointments.filter(apt => apt.appointmentDate === today);

  const statsData = [
    {
      title: "Today's Appointments",
      value: mockStats.todayAppointments,
      change: `€${(mockStats.weeklyRevenue / 7).toFixed(2)}`,
      iconSvg: '/svg_custom/schedule-svgrepo-com.svg',
      gradient: 'from-yellow-500 to-amber-600',
      bgGradient: 'from-yellow-500/10 to-amber-600/10',
    },
    {
      title: 'Total Customers',
      value: mockStats.totalCustomers,
      change: '+3 new',
      iconSvg: '/svg_custom/people-who-support-svgrepo-com.svg',
      gradient: 'from-amber-500 to-yellow-600',
      bgGradient: 'from-amber-500/10 to-yellow-600/10',
    },
    {
      title: 'Weekly Revenue',
      value: `€${mockStats.weeklyRevenue.toFixed(2)}`,
      change: '+18%',
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
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8 space-y-8">
          {/* Header */}
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-yellow-200 bg-clip-text text-transparent mb-2">
                Welcome back, {user.firstName}!
              </h1>
              <p className="text-gray-400 text-lg">Here's what's happening with your barbershop today.</p>
            </div>
            <Link
              href="/dashboard/appointments/new"
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-xl hover:from-yellow-500 hover:to-amber-600 transition-all flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              New Appointment
            </Link>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statsData.map((stat, index) => (
              <motion.div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl border border-white/10 p-6 hover:border-yellow-400/40 transition-all cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                {/* Decorative gradient blob */}
                <div className={`absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br ${stat.bgGradient} rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity`}></div>

                {/* Accent line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`}></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-300 font-semibold text-sm uppercase tracking-wide">{stat.title}</p>
                    <Image
                      src={stat.iconSvg}
                      alt={stat.title}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-contain group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <p className="text-5xl font-black text-white mb-3 tracking-tight">{stat.value}</p>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-black/30 rounded-lg w-fit">
                    <Image
                      src="/svg_custom/euro-banknote-svgrepo-com.svg"
                      alt="Trending"
                      width={14}
                      height={14}
                      className="w-3.5 h-3.5"
                    />
                    <span className="text-xs font-bold text-yellow-400">{stat.change}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Appointments */}
            <motion.div
              className="lg:col-span-2 rounded-3xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl border border-white/10 p-6"
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
                  Today's Appointments
                </h2>
                <Link href="/dashboard/calendar" className="text-yellow-400 hover:text-yellow-300 text-sm font-medium flex items-center gap-1">
                  View All
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-3">
                {todayAppointments.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No appointments today</p>
                ) : (
                  todayAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-4 rounded-xl bg-black/20 border border-white/5 hover:border-yellow-400/30 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center">
                            <span className="text-black font-bold">
                              {apt.customer?.name.charAt(0) || '?'}
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-white">{apt.customer?.name || 'Unknown'}</p>
                            <p className="text-sm text-gray-400">
                              {apt.service?.name} • {apt.barber?.name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-white">{apt.startTime}</p>
                          <span
                            className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              apt.status
                            )}`}
                          >
                            {apt.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
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
                  Active Barbers
                </h3>
                <div className="space-y-3">
                  {mockBarbers.map((barber) => (
                    <div key={barber.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center">
                        <span className="text-black font-bold text-sm">{barber.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white text-sm">{barber.name}</p>
                        <p className="text-xs text-gray-400">
                          {barber.isActive ? 'Available' : 'Unavailable'}
                        </p>
                      </div>
                      {barber.isActive && (
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-3xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl border border-white/10 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Link
                    href="/dashboard/appointments/new"
                    className="block w-full px-4 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-xl hover:from-yellow-500 hover:to-amber-600 transition-all font-medium text-center"
                  >
                    Add Appointment
                  </Link>
                  <Link
                    href="/dashboard/customers"
                    className="block w-full px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all font-medium text-center"
                  >
                    Manage Customers
                  </Link>
                  <Link
                    href="/dashboard/calendar"
                    className="block w-full px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all font-medium text-center"
                  >
                    View Calendar
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
