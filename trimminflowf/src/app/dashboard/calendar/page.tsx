'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { appointmentApi, barberApi, serviceApi } from '@/lib/api';
import { Appointment, AppointmentStatus, CreateAppointmentRequest } from '@/types/appointment';
import { BarberResponse } from '@/types/barber';
import { Service } from '@/types/service';
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns';

export default function CalendarPage() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBarber, setSelectedBarber] = useState('all');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [barbers, setBarbers] = useState<BarberResponse[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Form state
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

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('appointmentFormData', JSON.stringify(formData));
  }, [formData]);

  // Load form data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('appointmentFormData');
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (e) {
        console.error('Failed to parse saved form data');
      }
    }
  }, []);

  useEffect(() => {
    if (user?.barbershopId) {
      loadData();
    }
  }, [user, currentDate, selectedBarber]);

  // websocket connection setup
  useEffect(() => {
    // import sockjs dynamically so it works with nextjs
    import('sockjs-client').then((SockJS) => {
      import('@stomp/stompjs').then(({ Client }) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://trimminflow-backend-production.up.railway.app/api/v1';
        const wsUrl = apiUrl.replace(/\/api\/v1\/?$/, '') + '/ws';
        const socket = new SockJS.default(wsUrl);
        const stompClient = new Client({
          webSocketFactory: () => socket,
          onConnect: () => {
            console.log('Connected to WebSocket');
            stompClient.subscribe('/topic/appointments', (message: any) => {
              const updatedAppointment: Appointment = JSON.parse(message.body);

              // update the list immediately when we get a message
              setAppointments((prev) => {
                const index = prev.findIndex(a => a.id === updatedAppointment.id);
                if (index !== -1) {
                  // update existing appointment
                  const newArr = [...prev];
                  newArr[index] = updatedAppointment;
                  return newArr;
                } else {
                  // add new appointment
                  return [...prev, updatedAppointment];
                }
              });
            });
          },
          onStompError: (frame: any) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
          },
        });

        stompClient.activate();

        return () => {
          stompClient.deactivate();
        };
      });
    });
  }, []);

  const loadData = async () => {
    if (!user?.barbershopId) return;

    try {
      setLoading(true);
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = addDays(weekStart, 7);

      const [appointmentsRes, barbersRes, servicesRes] = await Promise.all([
        appointmentApi.getAll(user.barbershopId, {
          startDate: format(weekStart, 'yyyy-MM-dd'),
          endDate: format(weekEnd, 'yyyy-MM-dd'),
          barberId: selectedBarber !== 'all' ? selectedBarber : undefined,
        }),
        barberApi.getAll(user.barbershopId),
        serviceApi.getAll(user.barbershopId),
      ]);

      setAppointments(appointmentsRes.content || []);
      setBarbers(barbersRes);
      setServices(servicesRes);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.barbershopId) return;

    try {
      setFormError('');
      await appointmentApi.create(user.barbershopId, formData);
      setShowCreateModal(false);
      resetForm();
      loadData();
    } catch (error: any) {
      setFormError(error.response?.data?.message || error.message || 'Failed to create appointment');
    }
  };

  const handleCancelAppointment = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    if (!user?.barbershopId) return;

    try {
      await appointmentApi.cancel(user.barbershopId, id);
      setSelectedAppointment(null);
      loadData();
    } catch (error: any) {
      alert(error.message || 'Failed to cancel appointment');
    }
  };

  const resetForm = () => {
    setFormData({
      barberId: '',
      serviceId: '',
      appointmentDateTime: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      notes: '',
    });
    localStorage.removeItem('appointmentFormData');
    setFormError('');
  };

  const getStatusColor = (status: AppointmentStatus) => {
    const colors: Record<AppointmentStatus, string> = {
      [AppointmentStatus.PENDING]: 'from-yellow-400/20 to-amber-500/20 border-yellow-400/30',
      [AppointmentStatus.CONFIRMED]: 'from-green-400/20 to-emerald-500/20 border-green-400/30',
      [AppointmentStatus.CANCELLED]: 'from-red-400/20 to-rose-500/20 border-red-400/30',
      [AppointmentStatus.COMPLETED]: 'from-blue-400/20 to-cyan-500/20 border-blue-400/30',
      [AppointmentStatus.NO_SHOW]: 'from-gray-400/20 to-slate-500/20 border-gray-400/30',
    };
    return colors[status] || colors.PENDING;
  };

  const getWeekDates = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const weekDates = getWeekDates();

  const timeSlots = Array.from({ length: 11 }, (_, i) => {
    const hour = 9 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const getAppointmentsForSlot = (date: Date, time: string) => {
    return appointments.filter(apt => {
      if (apt.status === 'CANCELLED') return false;
      const aptDate = parseISO(apt.appointmentDateTime);
      const aptTime = format(aptDate, 'HH:00');
      return isSameDay(aptDate, date) && aptTime === time;
    });
  };

  const navigateWeek = (direction: number) => {
    setCurrentDate(addDays(currentDate, direction * 7));
  };

  if (loading) {
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
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <DashboardSidebar />

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
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-xl hover:from-yellow-500 hover:to-amber-600 transition-all flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              New Appointment
            </button>
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
                {format(weekDates[0], 'MMMM yyyy')}
              </h2>
              <button
                onClick={() => navigateWeek(1)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all text-sm"
              >
                Today
              </button>
            </div>

            <select
              value={selectedBarber}
              onChange={(e) => setSelectedBarber(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-yellow-400/50 focus:outline-none"
            >
              <option value="all" className="bg-gray-800 text-white">All Barbers</option>
              {barbers.map(barber => (
                <option key={barber.id} value={barber.id} className="bg-gray-800 text-white">
                  {barber.firstName} {barber.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Calendar Grid */}
          <div className="rounded-3xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl border border-white/10 p-6 overflow-x-auto">
            <div className="min-w-[1000px]">
              {/* Week Header */}
              <div className="grid grid-cols-8 gap-2 mb-4">
                <div className="p-4"></div>
                {weekDates.map((date, i) => {
                  const isToday = isSameDay(date, new Date());
                  return (
                    <div
                      key={i}
                      className={`p-4 rounded-xl text-center ${isToday
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black'
                        : 'bg-white/5 text-white'
                        }`}
                    >
                      <div className="font-bold">{format(date, 'EEE')}</div>
                      <div className={`text-2xl font-bold ${isToday ? 'text-black' : 'text-gray-400'}`}>
                        {format(date, 'd')}
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
                      const slotAppointments = getAppointmentsForSlot(date, time);
                      return (
                        <div
                          key={dateIdx}
                          className={`p-3 rounded-lg min-h-[80px] ${slotAppointments.length > 0
                            ? `bg-gradient-to-r ${getStatusColor(slotAppointments[0].status)} border`
                            : 'bg-white/5 border border-white/10'
                            } hover:border-yellow-400/50 transition-all cursor-pointer`}
                          onClick={() => {
                            if (slotAppointments.length > 0) {
                              setSelectedAppointment(slotAppointments[0]);
                            } else {
                              // Create new date object combining date and time
                              const [hours, minutes] = time.split(':');
                              const newDate = new Date(date);
                              newDate.setHours(parseInt(hours), parseInt(minutes));

                              setFormData(prev => ({
                                ...prev,
                                appointmentDateTime: format(newDate, "yyyy-MM-dd'T'HH:mm")
                              }));
                              setShowCreateModal(true);
                            }
                          }}
                        >
                          {slotAppointments.map((apt, idx) => (
                            <div key={idx} className="mb-2 flex items-start gap-2">
                              {apt.barber.profileImageUrl && (
                                <img
                                  src={apt.barber.profileImageUrl}
                                  alt="Barber"
                                  className="w-8 h-8 rounded-full object-cover border border-yellow-400/50"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-white text-sm truncate">{apt.customerName}</p>
                                <p className="text-xs text-gray-400 mt-0.5 truncate">{apt.service.name}</p>
                                <p className="text-xs text-yellow-400 mt-0.5 truncate">
                                  {apt.barber.firstName} {apt.barber.lastName}
                                </p>
                              </div>
                            </div>
                          ))}
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

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-white/10"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">New Appointment</h2>
              <button
                onClick={() => { setShowCreateModal(false); resetForm(); }}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Barber *</label>
                <select
                  required
                  value={formData.barberId}
                  onChange={(e) => setFormData({ ...formData, barberId: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-yellow-400/50 focus:outline-none"
                >
                  <option value="" className="bg-gray-800 text-white">Select barber</option>
                  {barbers.map((barber) => (
                    <option key={barber.id} value={barber.id} className="bg-gray-800 text-white">
                      {barber.firstName} {barber.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Service *</label>
                <select
                  required
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-yellow-400/50 focus:outline-none"
                >
                  <option value="" className="bg-gray-800 text-white">Select service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id} className="bg-gray-800 text-white">
                      {service.name} ({service.durationMinutes} min - ${service.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.appointmentDateTime}
                  onChange={(e) => setFormData({ ...formData, appointmentDateTime: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-yellow-400/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-yellow-400/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Customer Email *</label>
                <input
                  type="email"
                  required
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-yellow-400/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Customer Phone</label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-yellow-400/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-yellow-400/50 focus:outline-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-black py-2 rounded-lg hover:from-yellow-500 hover:to-amber-600 font-medium"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); resetForm(); }}
                  className="flex-1 border border-white/10 py-2 rounded-lg hover:bg-white/5 text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div >
        </div >
      )
      }

      {/* View/Edit Modal */}
      {
        selectedAppointment && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 w-full max-w-md border border-white/10"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Appointment Details</h2>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-3 text-gray-300">
                <div>
                  <span className="font-semibold text-white">Customer:</span> {selectedAppointment.customerName}
                </div>
                <div>
                  <span className="font-semibold text-white">Email:</span> {selectedAppointment.customerEmail}
                </div>
                {selectedAppointment.customerPhone && (
                  <div>
                    <span className="font-semibold text-white">Phone:</span> {selectedAppointment.customerPhone}
                  </div>
                )}
                <div>
                  <span className="font-semibold text-white">Barber:</span> {selectedAppointment.barber.firstName} {selectedAppointment.barber.lastName}
                </div>
                <div>
                  <span className="font-semibold text-white">Service:</span> {selectedAppointment.service.name}
                </div>
                <div>
                  <span className="font-semibold text-white">Duration:</span> {selectedAppointment.service.durationMinutes} minutes
                </div>
                <div>
                  <span className="font-semibold text-white">Price:</span> ${selectedAppointment.service.price}
                </div>
                <div>
                  <span className="font-semibold text-white">Date:</span> {format(parseISO(selectedAppointment.appointmentDateTime), 'PPP')}
                </div>
                <div>
                  <span className="font-semibold text-white">Time:</span> {format(parseISO(selectedAppointment.appointmentDateTime), 'p')}
                </div>
                <div>
                  <span className="font-semibold text-white">Status:</span>{' '}
                  <span className={`px-2 py-1 rounded text-sm bg-gradient-to-r ${getStatusColor(selectedAppointment.status)} border`}>
                    {selectedAppointment.status}
                  </span>
                </div>
                {selectedAppointment.notes && (
                  <div>
                    <span className="font-semibold text-white">Notes:</span> {selectedAppointment.notes}
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-6">
                {selectedAppointment.status !== 'CANCELLED' && (
                  <button
                    onClick={() => handleCancelAppointment(selectedAppointment.id)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white py-2 rounded-lg hover:from-red-600 hover:to-rose-700 font-medium"
                  >
                    Cancel Appointment
                  </button>
                )}
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="flex-1 border border-white/10 py-2 rounded-lg hover:bg-white/5 text-white"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )
      }
    </div >
  );
}
