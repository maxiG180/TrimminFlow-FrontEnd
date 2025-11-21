'use client';

import { useParams } from 'next/navigation';
import BookingWizard from '@/components/booking/BookingWizard';

export default function PublicBookingPage() {
    const params = useParams();
    const barbershopId = params.barbershopId as string;

    return <BookingWizard barbershopId={barbershopId} />;
}
