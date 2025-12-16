'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { format, addDays, isSameDay, parseISO } from 'date-fns';
import {
    Clock,
    User,
    ChevronRight,
    Phone,
    Mail
} from 'lucide-react';
import { barbershopApi, serviceApi, barberApi, appointmentApi } from '@/lib/api';
import { Barbershop } from '@/types';
import { Service } from '@/types/service';
import { BarberResponse } from '@/types/barber';

interface BookingWizardProps {
    barbershopId: string;
    preSelectedBarberId?: string;
}

export default function BookingWizard({ barbershopId, preSelectedBarberId }: BookingWizardProps) {
    const router = useRouter();

    // Data State
    const [barbershop, setBarbershop] = useState<Barbershop | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [barbers, setBarbers] = useState<BarberResponse[]>([]);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [slotsLoading, setSlotsLoading] = useState(false);

    // Wizard State
    const [step, setStep] = useState(1);
    const [selection, setSelection] = useState({
        service: null as Service | null,
        barber: null as BarberResponse | null,
        date: null as Date | null,
        time: null as string | null,
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        notes: ''
    });

    useEffect(() => {
        loadInitialData();
    }, [barbershopId, preSelectedBarberId]);

    useEffect(() => {
        if (selection.date && selection.service && selection.barber) {
            loadAvailableSlots();
        }
    }, [selection.date, selection.barber]);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            const [shopRes, servicesRes, barbersRes] = await Promise.all([
                barbershopApi.getById(barbershopId),
                serviceApi.getActive(barbershopId),
                barberApi.getActive(barbershopId)
            ]);
            setBarbershop(shopRes);
            setServices(servicesRes);
            setBarbers(barbersRes);

            // If a barber is pre-selected, find and set it
            if (preSelectedBarberId) {
                const preSelectedBarber = barbersRes.find(b => b.id === preSelectedBarberId);
                if (preSelectedBarber) {
                    setSelection(prev => ({ ...prev, barber: preSelectedBarber }));
                }
            }
        } catch (error) {
            console.error('Failed to load booking data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadAvailableSlots = async () => {
        if (!selection.date || !selection.service || !selection.barber) return;

        try {
            setSlotsLoading(true);
            const dateStr = format(selection.date, 'yyyy-MM-dd');
            const slots = await appointmentApi.getAvailableSlots(
                selection.barber.id,
                dateStr,
                selection.service.durationMinutes
            );
            setAvailableSlots(slots);
        } catch (error) {
            console.error('Failed to load slots:', error);
        } finally {
            setSlotsLoading(false);
        }
    };

    const handleBooking = async () => {
        if (!selection.service || !selection.barber || !selection.date || !selection.time) return;

        try {
            setLoading(true);
            // Combine date and time
            const dateTimeStr = `${format(selection.date, 'yyyy-MM-dd')}T${selection.time}:00`;

            await appointmentApi.create(barbershopId, {
                barberId: selection.barber.id,
                serviceId: selection.service.id,
                appointmentDateTime: dateTimeStr,
                customerName: selection.customerName,
                customerEmail: selection.customerEmail,
                customerPhone: selection.customerPhone,
                notes: selection.notes
            });

            router.push(`/book/${barbershopId}/success?date=${format(selection.date, 'PPP')}&time=${selection.time}&barber=${selection.barber.firstName}&service=${selection.service.name}`);
        } catch (error: any) {
            alert(error.message || 'Booking failed. Please try again.');
            setLoading(false);
        }
    };

    const nextStep = () => {
        // If we are on Step 1 (Service) and a barber is pre-selected, skip Step 2 (Barber)
        if (step === 1 && preSelectedBarberId) {
            setStep(3);
        } else {
            setStep(s => s + 1);
        }
    };

    const prevStep = () => {
        // If we are on Step 3 (Date) and a barber is pre-selected, go back to Step 1 (Service)
        if (step === 3 && preSelectedBarberId) {
            setStep(1);
        } else {
            setStep(s => s - 1);
        }
    };

    if (loading && !barbershop) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
            </div>
        );
    }

    if (!barbershop) return <div className="text-white text-center p-10">Barbershop not found</div>;

    // Calculate total steps based on whether barber is pre-selected
    const totalSteps = preSelectedBarberId ? 3 : 4;
    // Adjust current step display if pre-selected (Step 3 becomes Step 2, Step 4 becomes Step 3)
    const currentStepDisplay = preSelectedBarberId && step > 1 ? step - 1 : step;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
            {/* Header */}
            <header className="bg-black/50 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-4 mb-4">
                        {/* Logo */}
                        {barbershop.logoUrl ? (
                            <img
                                src={barbershop.logoUrl}
                                alt={barbershop.name}
                                className="w-16 h-16 rounded-xl object-cover border-2 border-yellow-400/20"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-2xl font-bold text-black">
                                {barbershop.name.charAt(0)}
                            </div>
                        )}

                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-white">{barbershop.name}</h1>
                            {barbershop.address && (
                                <p className="text-sm text-gray-400">{barbershop.address}</p>
                            )}
                        </div>

                        <div className="text-right">
                            <div className="text-xs text-gray-500 uppercase tracking-wider">Step</div>
                            <div className="text-lg text-yellow-400 font-bold">
                                {currentStepDisplay} / {totalSteps}
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: `${(currentStepDisplay / totalSteps) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8 pb-24">
                <AnimatePresence mode="wait">

                    {/* STEP 1: SELECT SERVICE */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl font-bold mb-6">Select Service</h2>
                            <div className="grid gap-4">
                                {services.map(service => (
                                    <div
                                        key={service.id}
                                        onClick={() => {
                                            setSelection({ ...selection, service });
                                            nextStep();
                                        }}
                                        className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-yellow-400/50 hover:bg-white/10 transition-all cursor-pointer group flex justify-between items-center"
                                    >
                                        <div>
                                            <h3 className="text-xl font-bold group-hover:text-yellow-400 transition-colors">{service.name}</h3>
                                            <p className="text-gray-400 mt-1">{service.description}</p>
                                            <div className="flex items-center gap-4 mt-3 text-sm">
                                                <span className="flex items-center gap-1 text-gray-300">
                                                    <Clock className="w-4 h-4" /> {service.durationMinutes} min
                                                </span>
                                                <span className="flex items-center gap-1 text-yellow-400 font-bold text-lg">
                                                    ${service.price}
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-6 h-6 text-gray-500 group-hover:text-yellow-400" />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: SELECT BARBER (Skipped if preSelectedBarberId is present) */}
                    {step === 2 && !preSelectedBarberId && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl font-bold mb-6">Select Barber</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {barbers.map(barber => (
                                    <div
                                        key={barber.id}
                                        onClick={() => {
                                            setSelection({ ...selection, barber });
                                            nextStep();
                                        }}
                                        className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-yellow-400/50 hover:bg-white/10 transition-all cursor-pointer group text-center"
                                    >
                                        <div className="w-24 h-24 rounded-full bg-gray-700 mx-auto mb-4 overflow-hidden border-2 border-gray-600 group-hover:border-yellow-400 transition-colors">
                                            {barber.profileImageUrl ? (
                                                <img src={barber.profileImageUrl} alt={barber.firstName} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                                                    {barber.firstName[0]}
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold group-hover:text-yellow-400 transition-colors">
                                            {barber.firstName} {barber.lastName}
                                        </h3>
                                        <p className="text-gray-400 text-sm mt-1">Professional Barber</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: DATE & TIME */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <h2 className="text-3xl font-bold">Select Date & Time</h2>

                            {/* Date Picker (Simple Week View) */}
                            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                                {Array.from({ length: 14 }).map((_, i) => {
                                    const date = addDays(new Date(), i);
                                    const isSelected = selection.date && isSameDay(date, selection.date);
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setSelection({ ...selection, date, time: null })}
                                            className={`min-w-[80px] p-4 rounded-xl border transition-all ${isSelected
                                                ? 'bg-yellow-400 border-yellow-400 text-black'
                                                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="text-sm font-medium opacity-80">{format(date, 'EEE')}</div>
                                            <div className="text-2xl font-bold">{format(date, 'd')}</div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Time Slots */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-gray-300">Available Times</h3>
                                {!selection.date ? (
                                    <p className="text-gray-500">Please select a date first</p>
                                ) : slotsLoading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                                    </div>
                                ) : availableSlots.length === 0 ? (
                                    <p className="text-gray-500">No available slots for this date.</p>
                                ) : (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {availableSlots.map((slot) => {
                                            // Slot is ISO string, extract time HH:mm
                                            const time = format(parseISO(slot), 'HH:mm');
                                            const isSelected = selection.time === time;
                                            return (
                                                <button
                                                    key={slot}
                                                    onClick={() => setSelection({ ...selection, time })}
                                                    className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all ${isSelected
                                                        ? 'bg-yellow-400 border-yellow-400 text-black'
                                                        : 'bg-white/5 border-white/10 text-white hover:border-yellow-400/50'
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: CUSTOMER INFO */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl font-bold mb-6">Your Details</h2>

                            {/* Summary Card */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
                                <h3 className="text-lg font-semibold text-white mb-4">Booking Summary</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Service</span>
                                        <span className="text-white font-medium">{selection.service?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Barber</span>
                                        <span className="text-white font-medium">{selection.barber?.firstName} {selection.barber?.lastName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Date & Time</span>
                                        <span className="text-white font-medium">
                                            {selection.date && format(selection.date, 'PPP')} at {selection.time}
                                        </span>
                                    </div>
                                    <div className="flex justify-between pt-3 border-t border-white/10">
                                        <span className="text-gray-400">Total Price</span>
                                        <span className="text-yellow-400 font-bold text-lg">${selection.service?.price}</span>
                                    </div>
                                </div>
                            </div>

                            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleBooking(); }}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Full Name *</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                        <input
                                            type="text"
                                            required
                                            value={selection.customerName}
                                            onChange={e => setSelection({ ...selection, customerName: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-yellow-400/50 focus:outline-none"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Email Address *</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                        <input
                                            type="email"
                                            required
                                            value={selection.customerEmail}
                                            onChange={e => setSelection({ ...selection, customerEmail: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-yellow-400/50 focus:outline-none"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                        <input
                                            type="tel"
                                            value={selection.customerPhone}
                                            onChange={e => setSelection({ ...selection, customerPhone: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-yellow-400/50 focus:outline-none"
                                            placeholder="(555) 123-4567"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Notes (Optional)</label>
                                    <textarea
                                        value={selection.notes}
                                        onChange={e => setSelection({ ...selection, notes: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-yellow-400/50 focus:outline-none"
                                        rows={3}
                                        placeholder="Any special requests?"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold py-4 rounded-xl hover:from-yellow-500 hover:to-amber-600 transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Confirming Booking...' : 'Confirm Booking'}
                                </button>
                            </form>
                        </motion.div>
                    )}

                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/90 backdrop-blur-lg border-t border-white/10">
                    <div className="max-w-3xl mx-auto flex justify-between items-center">
                        {step > 1 && (
                            <button
                                onClick={prevStep}
                                className="px-6 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors"
                            >
                                Back
                            </button>
                        )}

                        {step === 3 && selection.time && (
                            <button
                                onClick={nextStep}
                                className="ml-auto px-8 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2"
                            >
                                Continue <ChevronRight className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
