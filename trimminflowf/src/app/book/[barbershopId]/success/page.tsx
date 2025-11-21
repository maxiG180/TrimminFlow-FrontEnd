'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';

export default function BookingSuccessPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const barbershopId = params.barbershopId as string;

    const date = searchParams.get('date');
    const time = searchParams.get('time');
    const barber = searchParams.get('barber');
    const service = searchParams.get('service');

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
            >
                <div className="flex justify-center mb-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                        className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30"
                    >
                        <CheckCircle className="w-10 h-10 text-green-400" />
                    </motion.div>
                </div>

                <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
                <p className="text-gray-400 mb-8">Your appointment has been successfully scheduled.</p>

                <div className="bg-white/5 rounded-2xl p-6 mb-8 space-y-4 text-left">
                    <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-yellow-400 mt-0.5" />
                        <div>
                            <p className="text-sm text-gray-400">Date</p>
                            <p className="text-white font-medium">{date}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-yellow-400 mt-0.5" />
                        <div>
                            <p className="text-sm text-gray-400">Time</p>
                            <p className="text-white font-medium">{time}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-yellow-400 mt-0.5" />
                        <div>
                            <p className="text-sm text-gray-400">Service</p>
                            <p className="text-white font-medium">{service} with {barber}</p>
                        </div>
                    </div>
                </div>

                <Link
                    href={`/book/${barbershopId}`}
                    className="block w-full py-3 px-6 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold rounded-xl hover:from-yellow-500 hover:to-amber-600 transition-all transform hover:scale-[1.02]"
                >
                    Book Another Appointment
                </Link>
            </motion.div>
        </div>
    );
}
