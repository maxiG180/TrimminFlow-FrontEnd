'use client';

import { useParams, useSearchParams } from 'next/navigation';
import BookingWizard from '@/components/booking/BookingWizard';

export default function PublicBookingPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const barbershopId = params.barbershopId as string;
    const barberId = searchParams.get('barberId');

    return <BookingWizard barbershopId={barbershopId} preSelectedBarberId={barberId || undefined} />;
}
