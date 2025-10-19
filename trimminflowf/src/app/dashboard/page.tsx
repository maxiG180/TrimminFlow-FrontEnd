'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Plus,
  Users,
  Euro,
  Calendar,
  Clock,
  Scissors,
  TrendingUp,
  ArrowUpRight,
  LayoutDashboard,
  Settings,
  QrCode,
  LogOut,
} from 'lucide-react';
import { mockAppointments, mockBarbers, mockCustomers, mockStats } from '@/lib/mockData';

export default function Dashboard() {
  const [selectedNav, setSelectedNav] = useState('dashboard');

  // Get today's appointments
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = mockAppointments.filter(apt => apt.appointmentDate === today);

  const statsData = [
    {
      title: "Today's Appointments",
      value: mockStats.todayAppointments,
      change: `€${mockStats.weeklyRevenue / 7}`,
      icon: Calendar,
      gradient: 'from-yellow-500 to-amber-600',
      bgGradient: 'from-yellow-500/10 to-amber-600/10',
    },
    {
      title: 'Total Customers',
      value: mockStats.totalCustomers,
      change: '+3 new',
      icon: Users,
      gradient: 'from-amber-500 to-yellow-600',
      bgGradient: 'from-amber-500/10 to-yellow-600/10',
    },
    {
      title: 'Weekly Revenue',
      value: `€${mockStats.weeklyRevenue.toFixed(2)}`,
      change: '+18%',
      icon: Euro,
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
    <div className="flex min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]">
      {/* Sidebar */}
      <div className="w-64 bg-black/20 backdrop-blur-xl border-r border-white/10 p-6">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center">
            <Scissors className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="text-white font-bold">TRIMMINFLOW</h2>
            <p className="text-xs text-gray-400">Dashboard</p>
          </div>
        </div>

        <nav className="space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'calendar', label: 'Calendar', icon: Calendar },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'qr', label: 'QR Codes', icon: QrCode },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.id === 'dashboard' ? '/dashboard' : `/dashboard/${item.id}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  selectedNav === item.id
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all w-full">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

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
                Welcome back!
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
            {statsData.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl border border-white/10 p-6 hover:border-yellow-400/30 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.bgGradient} rounded-full blur-2xl`}></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-gray-400 font-medium">{stat.title}</p>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-black" />
                      </div>
                    </div>
                    <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
                    <p className="text-sm text-gray-400 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-yellow-400" />
                      {stat.change}
                    </p>
                  </div>
                </motion.div>
              );
            })}
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
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-yellow-400" />
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
                  <Scissors className="w-5 h-5 text-yellow-400" />
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
