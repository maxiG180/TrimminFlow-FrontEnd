'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, X, Clock, Calendar as CalendarIcon, User, Scissors, Check, Ban, AlertCircle } from 'lucide-react';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { appointmentApi, barberApi, serviceApi, businessHoursApi } from '@/lib/api';
import { Appointment, AppointmentStatus, CreateAppointmentRequest } from '@/types/appointment';
import { BarberResponse } from '@/types/barber';
import { Service } from '@/types/service';
import { BusinessHours, DayOfWeek } from '@/types/businessHours';
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth,
  isSameDay, parseISO, isToday
} from 'date-fns';

export default function CalendarPage() {
  const { user } = useAuth();

  // State
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Data State
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [barbers, setBarbers] = useState<BarberResponse[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([]);
  const [loading, setLoading] = useState(true);

  // UI State
  const [selectedBarber, setSelectedBarber] = useState('all');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Reschedule State
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');

  // Form State
  const [formData, setFormData] = useState<CreateAppointmentRequest>({
    barberId: '',
    serviceId: '',
    appointmentDateTime: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    notes: '',
  });
  const [formError, setFormError] = useState<string>('');

  const loadData = useCallback(async () => {
    if (!user?.barbershopId) return;

    try {
      setLoading(true);
      // Fetch data for the entire month window (including padding days)
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);
      const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
      const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

      const [appointmentsRes, barbersRes, servicesRes, businessHoursRes] = await Promise.all([
        appointmentApi.getAll(user.barbershopId, {
          startDate: format(calendarStart, 'yyyy-MM-dd'),
          endDate: format(calendarEnd, 'yyyy-MM-dd'),
          barberId: selectedBarber !== 'all' ? selectedBarber : undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
        }),
        barberApi.getAll(user.barbershopId),
        serviceApi.getAll(user.barbershopId),
        businessHoursApi.getAll(user.barbershopId),
      ]);

      setAppointments(appointmentsRes.content || []);
      setBarbers(barbersRes);
      setServices(servicesRes);
      setBusinessHours(businessHoursRes);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [user, currentMonth, selectedBarber, statusFilter]);

  // Initial Load
  useEffect(() => {
    if (user?.barbershopId) {
      loadData();
    }
  }, [user, loadData]);

  // WebSocket
  useEffect(() => {
    import('sockjs-client').then((SockJS) => {
      import('@stomp/stompjs').then(({ Client }) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://trimminflow-backend-production.up.railway.app/api/v1';
        const wsUrl = apiUrl.replace(/\/api\/v1\/?$/, '') + '/ws';
        const socket = new SockJS.default(wsUrl);
        const stompClient = new Client({
          webSocketFactory: () => socket,
          onConnect: () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            stompClient.subscribe('/topic/appointments', (message: any) => {
              const updatedAppointment: Appointment = JSON.parse(message.body);
              setAppointments((prev) => {
                const index = prev.findIndex(a => a.id === updatedAppointment.id);
                if (index !== -1) {
                  const newArr = [...prev];
                  newArr[index] = updatedAppointment;
                  return newArr;
                }
                return [...prev, updatedAppointment];
              });

              // Also update selected appointment if it's the one being modified
              if (selectedAppointment && selectedAppointment.id === updatedAppointment.id) {
                setSelectedAppointment(updatedAppointment);
              }
            });
          },
        });
        stompClient.activate();
        return () => stompClient.deactivate();
      });
    });
  }, [selectedAppointment]);

  // Calendar Logic
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  const getDaysInMonth = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({ start: startDate, end: endDate });
  };

  // Business Logic
  const getDaySchedule = (date: Date) => {
    const dayName = format(date, 'EEEE').toUpperCase() as DayOfWeek;
    return businessHours.find(h => h.dayOfWeek === dayName);
  };

  const getDailyAppointments = (date: Date) => {
    return appointments.filter(apt =>
      isSameDay(parseISO(apt.appointmentDateTime), date)
    ).sort((a, b) =>
      new Date(a.appointmentDateTime).getTime() - new Date(b.appointmentDateTime).getTime()
    );
  };

  const getStatusColor = (status: AppointmentStatus) => {
    const colors: Record<AppointmentStatus, string> = {
      [AppointmentStatus.PENDING]: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
      [AppointmentStatus.CONFIRMED]: 'bg-green-400/10 text-green-400 border-green-400/20',
      [AppointmentStatus.CANCELLED]: 'bg-red-400/10 text-red-400 border-red-400/20',
      [AppointmentStatus.COMPLETED]: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
      [AppointmentStatus.NO_SHOW]: 'bg-gray-400/10 text-gray-400 border-gray-400/20',
    };
    return colors[status] || colors.PENDING;
  };

  // Handling
  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.barbershopId) return;

    try {
      setFormError('');
      await appointmentApi.create(user.barbershopId, formData);
      setShowCreateModal(false);
      loadData();

      // Reset form but keep the selected date
      setFormData(prev => ({
        ...prev,
        barberId: '',
        serviceId: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        notes: ''
      }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setFormError(error.response?.data?.message || error.message || 'Failed to create appointment');
    }
  };

  const handleUpdateStatus = async (status: AppointmentStatus) => {
    if (!selectedAppointment || !user?.barbershopId) return;
    try {
      await appointmentApi.update(user.barbershopId, selectedAppointment.id, {
        status,
      });
      loadData();
      // Close modal if cancelled, or just update view
      if (status === AppointmentStatus.CANCELLED) {
        setSelectedAppointment(null);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Failed to update status', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update status';
      alert(errorMessage);
    }
  };

  const handleReschedule = async () => {
    if (!selectedAppointment || !user?.barbershopId || !rescheduleDate) return;
    try {
      await appointmentApi.update(user.barbershopId, selectedAppointment.id, {
        appointmentDateTime: rescheduleDate,
      });
      setIsRescheduling(false);
      loadData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Failed to reschedule', error);
      alert(error.response?.data?.message || 'Failed to reschedule appointment');
    }
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
  };

  const selectedDaySchedule = getDaySchedule(selectedDate);
  const selectedDayAppointments = getDailyAppointments(selectedDate);

  if (loading && appointments.length === 0) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <DashboardSidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header Section */}
        <header className="px-8 py-6 border-b border-white/10 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-yellow-200 bg-clip-text text-transparent">
              Appointments
            </h1>
            <p className="text-gray-400 text-sm mt-1">Manage schedules and bookings</p>
          </div>

          <button
            onClick={() => {
              // Pre-fill date with current selected date time (e.g. 9am)
              const defaultTime = new Date(selectedDate);
              defaultTime.setHours(9, 0, 0, 0);
              setFormData(prev => ({
                ...prev,
                appointmentDateTime: format(defaultTime, "yyyy-MM-dd'T'HH:mm")
              }));
              setShowCreateModal(true);
            }}
            className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-yellow-400/20"
          >
            <Plus className="w-5 h-5" />
            New Booking
          </button>
        </header>

        {/* Content Grid */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">

          {/* Calendar Side (Left) */}
          <div className="flex-1 p-8 overflow-y-auto border-r border-white/10">
            {/* Controls */}
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
                  <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="w-48 text-center font-bold text-lg">
                    {format(currentMonth, 'MMMM yyyy')}
                  </div>
                  <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <button onClick={goToToday} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium">
                  Today
                </button>
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <select
                  value={selectedBarber}
                  onChange={(e) => setSelectedBarber(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-yellow-400/50 text-sm flex-1"
                >
                  <option value="all">All Barbers</option>
                  {barbers.map(barber => (
                    <option key={barber.id} value={barber.id}>{barber.firstName}</option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as AppointmentStatus | 'all')}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-yellow-400/50 text-sm flex-1"
                >
                  <option value="all">All Statuses</option>
                  {Object.values(AppointmentStatus).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="bg-gray-900/90 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {day}
                </div>
              ))}

              {getDaysInMonth().map((day, i) => {
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isTodayDate = isToday(day);
                const dayApps = getDailyAppointments(day);

                return (
                  <div
                    key={i}
                    onClick={() => handleDayClick(day)}
                    className={`
                      min-h-[100px] p-3 flex flex-col gap-2 cursor-pointer transition-all
                      ${isCurrentMonth ? 'bg-gray-800/40 hover:bg-gray-800/60' : 'bg-gray-900/40 opacity-50'}
                      ${isSelected ? 'ring-2 ring-inset ring-yellow-400 bg-yellow-400/5' : ''}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`
                        w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium
                        ${isTodayDate ? 'bg-yellow-400 text-black' : 'text-gray-300'}
                      `}>
                        {format(day, 'd')}
                      </span>
                      {dayApps.length > 0 && (
                        <span className="bg-white/10 text-gray-300 text-[10px] px-1.5 py-0.5 rounded-full">
                          {dayApps.length}
                        </span>
                      )}
                    </div>

                    {/* Tiny indicators for appointments */}
                    <div className="flex-1 flex flex-col gap-1 justify-end">
                      {dayApps.slice(0, 3).map((apt, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 overflow-hidden">
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${apt.status === AppointmentStatus.CONFIRMED || apt.status === AppointmentStatus.COMPLETED ? 'bg-green-400' :
                            apt.status === AppointmentStatus.PENDING ? 'bg-yellow-400' :
                              apt.status === AppointmentStatus.CANCELLED ? 'bg-red-400' : 'bg-gray-400'
                            }`} />
                          <span className="text-[10px] text-gray-400 truncate">
                            {format(parseISO(apt.appointmentDateTime), 'HH:mm')}
                          </span>
                        </div>
                      ))}
                      {dayApps.length > 3 && (
                        <span className="text-[10px] text-gray-500 pl-1">+ {dayApps.length - 3} more</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details Sidebar (Right) */}
          <div className="w-full lg:w-[400px] bg-gray-900/50 backdrop-blur-xl border-l border-white/10 flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-white/10 bg-gray-900/80">
              <h2 className="text-2xl font-bold text-white mb-2">{format(selectedDate, 'EEEE')}</h2>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <CalendarIcon className="w-4 h-4" />
                <span>{format(selectedDate, 'MMMM d, yyyy')}</span>
              </div>

              <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-200">Business Hours</h3>
                  {!selectedDaySchedule?.isOpen && (
                    <span className="px-2 py-0.5 bg-red-400/10 text-red-400 text-xs rounded border border-red-400/20">Closed</span>
                  )}
                  {selectedDaySchedule?.isOpen && (
                    <span className="px-2 py-0.5 bg-green-400/10 text-green-400 text-xs rounded border border-green-400/20">Open</span>
                  )}
                </div>
                {selectedDaySchedule?.isOpen ? (
                  <p className="text-2xl font-mono text-white">
                    {selectedDaySchedule.openTime} - {selectedDaySchedule.closeTime}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 italic">No working hours set for this day</p>
                )}
              </div>
            </div>

            {/* Timeline / Appointments List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedDayAppointments.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 pb-20">
                  <Clock className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-lg font-medium">No appointments</p>
                  <p className="text-sm opacity-60">This day is completely free.</p>
                </div>
              ) : (
                <div className="relative border-l border-white/10 ml-3 pl-6 space-y-8">
                  {selectedDayAppointments.map(apt => (
                    <div
                      key={apt.id}
                      className="relative group cursor-pointer"
                      onClick={() => {
                        setSelectedAppointment(apt);
                        setIsRescheduling(false);
                      }}
                    >
                      {/* Timeline dot */}
                      <div className={`
                         absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2 border-gray-900 shadow-[0_0_0_4px_rgba(31,41,55,1)] 
                         ${apt.status === AppointmentStatus.CONFIRMED || apt.status === AppointmentStatus.COMPLETED ? 'bg-green-400' :
                          apt.status === AppointmentStatus.PENDING ? 'bg-yellow-400' : 'bg-gray-400'}
                       `} />

                      <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors group-hover:border-yellow-400/30">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-white text-lg">{format(parseISO(apt.appointmentDateTime), 'h:mm a')}</h4>
                            <p className="text-sm text-gray-400">{apt.service.durationMinutes} min</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(apt.status)}`}>
                            {apt.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mb-3">
                          {apt.barber.profileImageUrl ? (
                            <img src={apt.barber.profileImageUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center"><User className="w-4 h-4" /></div>
                          )}
                          <div className="text-sm">
                            <p className="text-gray-300">{apt.barber.firstName}</p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-white font-medium flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            {apt.customerName}
                          </p>
                          <p className="text-gray-400 text-sm flex items-center gap-2">
                            <Scissors className="w-4 h-4 text-gray-500" />
                            {apt.service.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </main>

      {/* CREATE APPOINTMENT MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          // ... (Reuse Create Modal Logic from before) 
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 rounded-2xl p-6 w-full max-w-lg border border-white/10 max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Same form as before */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">New Appointment</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              {formError && (
                <div className="mb-4 p-3 bg-red-400/10 border border-red-400/20 text-red-400 rounded-xl text-sm">
                  {formError}
                </div>
              )}
              <form onSubmit={handleCreateAppointment} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Barber</label>
                    <select
                      required
                      value={formData.barberId}
                      onChange={(e) => setFormData({ ...formData, barberId: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-yellow-400/50 focus:outline-none"
                    >
                      <option value="" className="bg-gray-900">Select Barber</option>
                      {barbers.map((b) => (
                        <option key={b.id} value={b.id} className="bg-gray-900">{b.firstName} {b.lastName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Service</label>
                    <select
                      required
                      value={formData.serviceId}
                      onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-yellow-400/50 focus:outline-none"
                    >
                      <option value="" className="bg-gray-900">Select Service</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id} className="bg-gray-900">{s.name} (${s.price})</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.appointmentDateTime}
                    onChange={(e) => setFormData({ ...formData, appointmentDateTime: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-yellow-400/50 focus:outline-none"
                  />
                </div>
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Customer Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Name" required value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-yellow-400/50 focus:outline-none" />
                    <input placeholder="Phone" value={formData.customerPhone} onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-yellow-400/50 focus:outline-none" />
                  </div>
                  <input placeholder="Email" type="email" required value={formData.customerEmail} onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-yellow-400/50 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Notes</label>
                  <textarea rows={3} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-yellow-400/50 focus:outline-none" />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold py-3 rounded-xl hover:from-yellow-500 hover:to-amber-600 transition-all mt-4">Confirm Booking</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIEW / MANAGE APPOINTMENT MODAL */}
      <AnimatePresence>
        {selectedAppointment && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-white/10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Booking Details</h2>
                <button onClick={() => setSelectedAppointment(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center text-yellow-400">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{selectedAppointment.customerName}</h3>
                    <p className="text-gray-400 text-sm">{selectedAppointment.customerEmail}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{selectedAppointment.customerPhone}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Info Rows */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-gray-400">Service</span>
                      <div className="text-right">
                        <span className="text-white font-medium block">{selectedAppointment.service.name}</span>
                        <span className="text-xs text-gray-500">{selectedAppointment.service.price} € • {selectedAppointment.service.durationMinutes} min</span>
                      </div>
                    </div>

                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400">Barber</span>
                      <span className="text-white font-medium">{selectedAppointment.barber.firstName} {selectedAppointment.barber.lastName}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-gray-400">Date & Time</span>
                      {isRescheduling ? (
                        <div className="flex gap-2">
                          <input
                            type="datetime-local"
                            className="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-yellow-400"
                            value={rescheduleDate}
                            onChange={(e) => setRescheduleDate(e.target.value)}
                          />
                          <button onClick={handleReschedule} className="text-green-400 hover:text-green-300"><Check className="w-5 h-5" /></button>
                          <button onClick={() => setIsRescheduling(false)} className="text-red-400 hover:text-red-300"><X className="w-5 h-5" /></button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">
                            {format(parseISO(selectedAppointment.appointmentDateTime), 'MMM d, h:mm a')}
                          </span>
                          {(selectedAppointment.status === AppointmentStatus.PENDING || selectedAppointment.status === AppointmentStatus.CONFIRMED) && (
                            <button
                              onClick={() => {
                                setRescheduleDate(selectedAppointment.appointmentDateTime);
                                setIsRescheduling(true);
                              }}
                              className="text-xs text-yellow-400 hover:underline"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400">Status</span>
                      <span className={`px-2 py-0.5 rounded text-xs border ${getStatusColor(selectedAppointment.status)}`}>
                        {selectedAppointment.status}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {(selectedAppointment.status === AppointmentStatus.PENDING || selectedAppointment.status === AppointmentStatus.CONFIRMED) && (
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                      <button
                        onClick={() => handleUpdateStatus(AppointmentStatus.COMPLETED)}
                        className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-green-400/10 text-green-400 border border-green-400/20 hover:bg-green-400/20 transition-all font-medium text-xs"
                      >
                        <Check className="w-5 h-5 mb-1" />
                        Complete
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(AppointmentStatus.NO_SHOW)}
                        className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-gray-400/10 text-gray-400 border border-gray-400/20 hover:bg-gray-400/20 transition-all font-medium text-xs"
                      >
                        <AlertCircle className="w-5 h-5 mb-1" />
                        No Show
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to cancel this appointment?')) {
                            handleUpdateStatus(AppointmentStatus.CANCELLED);
                          }
                        }}
                        className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-red-400/10 text-red-400 border border-red-400/20 hover:bg-red-400/20 transition-all font-medium text-xs"
                      >
                        <Ban className="w-5 h-5 mb-1" />
                        Cancel
                      </button>
                    </div>
                  )}

                  {selectedAppointment.status === AppointmentStatus.CANCELLED && (
                    <div className="text-center p-3 bg-red-500/10 rounded-xl text-red-400 text-sm border border-red-500/20">
                      This appointment has been cancelled.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
