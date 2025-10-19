'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Scissors, Calendar, Clock, User, Phone, Mail, Check, ArrowLeft } from 'lucide-react';
import { mockBarbershop, mockBarbers, mockServices } from '@/lib/mockData';
import Link from 'next/link';

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  // Generate next 7 days
  const getNextWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const nextWeekDates = getNextWeekDates();

  const handleBooking = () => {
    // In a real app, this would send the booking to the backend
    console.log('Booking:', {
      service: selectedService,
      barber: selectedBarber,
      date: selectedDate,
      time: selectedTime,
      customer: customerInfo,
    });
    setStep(5); // Confirmation step
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6">Select a Service</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {mockServices.map((service) => (
                <motion.button
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service.id);
                    setStep(2);
                  }}
                  className={`p-6 rounded-2xl text-left transition-all ${
                    selectedService === service.id
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black'
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-xl">{service.name}</h3>
                    <span className="text-2xl font-bold">€{service.price}</span>
                  </div>
                  <p className={`text-sm mb-2 ${selectedService === service.id ? 'text-black/70' : 'text-gray-400'}`}>
                    {service.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{service.durationMinutes} min</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <h2 className="text-3xl font-bold text-white mb-6">Choose Your Barber</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {mockBarbers.map((barber) => (
                <motion.button
                  key={barber.id}
                  onClick={() => {
                    setSelectedBarber(barber.id);
                    setStep(3);
                  }}
                  className={`p-6 rounded-2xl text-center transition-all ${
                    selectedBarber === barber.id
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black'
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center mx-auto mb-4">
                    <span className="text-black text-3xl font-bold">{barber.name.charAt(0)}</span>
                  </div>
                  <h3 className="font-bold text-xl mb-2">{barber.name}</h3>
                  <p className={`text-sm ${selectedBarber === barber.id ? 'text-black/70' : 'text-gray-400'}`}>
                    {barber.bio?.substring(0, 60)}...
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <h2 className="text-3xl font-bold text-white mb-6">Pick a Date & Time</h2>

            {/* Date Selection */}
            <div>
              <h3 className="text-white font-semibold mb-3">Select Date</h3>
              <div className="grid grid-cols-7 gap-2">
                {nextWeekDates.map((date, idx) => {
                  const dateStr = date.toISOString().split('T')[0];
                  const isToday = idx === 0;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`p-4 rounded-xl text-center transition-all ${
                        selectedDate === dateStr
                          ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black'
                          : 'bg-white/5 hover:bg-white/10 text-white'
                      }`}
                    >
                      <div className="text-xs mb-1">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div className="text-xl font-bold">{date.getDate()}</div>
                      {isToday && <div className="text-xs mt-1">Today</div>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div>
                <h3 className="text-white font-semibold mb-3">Select Time</h3>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => {
                        setSelectedTime(time);
                        setStep(4);
                      }}
                      className={`p-3 rounded-xl text-center transition-all ${
                        selectedTime === time
                          ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black'
                          : 'bg-white/5 hover:bg-white/10 text-white'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <h2 className="text-3xl font-bold text-white mb-6">Your Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-yellow-400/50 focus:outline-none"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-yellow-400/50 focus:outline-none"
                    placeholder="+351 912 345 678"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Email (Optional)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-yellow-400/50 focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={!customerInfo.name || !customerInfo.phone}
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-xl hover:from-yellow-500 hover:to-amber-600 transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        );

      case 5:
        const service = mockServices.find(s => s.id === selectedService);
        const barber = mockBarbers.find(b => b.id === selectedBarber);

        return (
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-black" />
            </div>
            <h2 className="text-4xl font-bold text-white">Booking Confirmed!</h2>
            <p className="text-gray-400 text-lg">Your appointment has been successfully booked.</p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Service</p>
                <p className="text-white font-bold text-lg">{service?.name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Barber</p>
                <p className="text-white font-bold text-lg">{barber?.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Date</p>
                  <p className="text-white font-bold">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Time</p>
                  <p className="text-white font-bold">{selectedTime}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Customer</p>
                <p className="text-white font-bold">{customerInfo.name}</p>
                <p className="text-gray-400 text-sm">{customerInfo.phone}</p>
              </div>
            </div>

            <p className="text-gray-400 text-sm">
              A confirmation SMS has been sent to {customerInfo.phone}
            </p>

            <Link
              href="/"
              className="inline-block px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all font-medium"
            >
              Return to Home
            </Link>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center">
              <Scissors className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{mockBarbershop.name}</h1>
              <p className="text-xs text-gray-400">Book Your Appointment</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Progress Bar */}
      {step < 5 && (
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-2">
            {['Service', 'Barber', 'Date & Time', 'Details'].map((label, idx) => (
              <div key={idx} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    step > idx + 1
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black'
                      : step === idx + 1
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black'
                      : 'bg-white/10 text-gray-400'
                  }`}
                >
                  {step > idx + 1 ? <Check className="w-5 h-5" /> : idx + 1}
                </div>
                <span
                  className={`ml-2 text-sm ${
                    step >= idx + 1 ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>
                {idx < 3 && (
                  <div
                    className={`h-1 w-12 mx-4 rounded ${
                      step > idx + 1 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-white/10'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
        >
          {renderStep()}
        </motion.div>
      </div>
    </div>
  );
}
