'use client';

import { useParams } from 'next/navigation';
import BookingWizard from '@/components/booking/BookingWizard';

export default function IndividualBarberBookingPage() {
    const params = useParams();
    const barbershopId = params.barbershopId as string;
    const barberId = params.barberId as string;

    return (
        <BookingWizard
            barbershopId={barbershopId}
            preSelectedBarberId={barberId}
        />
    );
}
