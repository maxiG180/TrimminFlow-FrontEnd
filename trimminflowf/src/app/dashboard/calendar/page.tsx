'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Scissors,
  LayoutDashboard,
  Users,
  QrCode,
  Settings,
  LogOut,
} from 'lucide-react';
export default function CalendarPage() {
  const [selectedNav, setSelectedNav] = useState('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBarber, setSelectedBarber] = useState('all');

  // TODO: Fetch from API - empty for now
  const mockBarbers: any[] = [];
  const mockAppointments: any[] = [];

  // Get current week dates
  const getWeekDates = () => {
    const start = new Date(currentDate);
    start.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Monday
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  // Filter appointments by selected barber
  const filteredAppointments = selectedBarber === 'all'
    ? mockAppointments
    : mockAppointments.filter(apt => apt.barberId === selectedBarber);

  // Generate time slots (9:00 to 19:00)
  const timeSlots = Array.from({ length: 11 }, (_, i) => {
    const hour = 9 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const getAppointmentForSlot = (date: Date, time: string) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredAppointments.find(
      apt => apt.appointmentDate === dateStr && apt.startTime === time
    );
  };

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
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
            <p className="text-xs text-gray-400">Calendar</p>
          </div>
        </div>

        <nav className="space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
            { id: 'calendar', label: 'Calendar', icon: CalendarIcon, href: '/dashboard/calendar' },
            { id: 'customers', label: 'Customers', icon: Users, href: '/dashboard/customers' },
            { id: 'qr', label: 'QR Codes', icon: QrCode, href: '/dashboard/qr' },
            { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/settings' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
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
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all w-full">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8 space-y-6">
          {/* Header */}
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-yellow-200 bg-clip-text text-transparent mb-2">
                Calendar
              </h1>
              <p className="text-gray-400 text-lg">Manage your appointments</p>
            </div>
            <Link
              href="/dashboard/appointments/new"
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-xl hover:from-yellow-500 hover:to-amber-600 transition-all flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              New Appointment
            </Link>
          </motion.div>

          {/* Calendar Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateWeek(-1)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold text-white">
                {weekDates[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={() => navigateWeek(1)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedBarber}
                onChange={(e) => setSelectedBarber(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-yellow-400/50 focus:outline-none"
              >
                <option value="all">All Barbers</option>
                {mockBarbers.map(barber => (
                  <option key={barber.id} value={barber.id}>{barber.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="rounded-3xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl border border-white/10 p-6 overflow-x-auto">
            <div className="min-w-[1000px]">
              {/* Week Header */}
              <div className="grid grid-cols-8 gap-2 mb-4">
                <div className="p-4"></div>
                {weekDates.map((date, i) => {
                  const isToday = date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
                  return (
                    <div
                      key={i}
                      className={`p-4 rounded-xl text-center ${
                        isToday
                          ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black'
                          : 'bg-white/5 text-white'
                      }`}
                    >
                      <div className="font-bold">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className={`text-2xl font-bold ${isToday ? 'text-black' : 'text-gray-400'}`}>
                        {date.getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Time Slots */}
              <div className="space-y-2">
                {timeSlots.map((time, timeIdx) => (
                  <div key={timeIdx} className="grid grid-cols-8 gap-2">
                    <div className="p-4 flex items-center justify-center text-gray-400 font-medium">
                      {time}
                    </div>
                    {weekDates.map((date, dateIdx) => {
                      const appointment = getAppointmentForSlot(date, time);
                      return (
                        <div
                          key={dateIdx}
                          className={`p-3 rounded-lg min-h-[80px] ${
                            appointment
                              ? 'bg-gradient-to-r from-yellow-400/20 to-amber-500/20 border border-yellow-400/30'
                              : 'bg-white/5 border border-white/10'
                          } hover:border-yellow-400/50 transition-all cursor-pointer`}
                        >
                          {appointment && (
                            <div>
                              <p className="font-bold text-white text-sm">{appointment.customer?.name}</p>
                              <p className="text-xs text-gray-400 mt-1">{appointment.service?.name}</p>
                              <p className="text-xs text-yellow-400 mt-1">{appointment.barber?.name}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
