/**
 * Appointment Types
 * 
 * TypeScript interfaces and enums for the appointment booking system
 */

export enum AppointmentStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
    NO_SHOW = 'NO_SHOW'
}

export interface Appointment {
    id: string;
    barbershop: {
        id: string;
        name: string;
    };
    barber: {
        id: string;
        firstName: string;
        lastName: string;
        profileImageUrl?: string;
    };
    service: {
        id: string;
        name: string;
        price: number;
        durationMinutes: number;
    };
    appointmentDateTime: string; // ISO 8601 format
    endDateTime: string; // ISO 8601 format
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    status: AppointmentStatus;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAppointmentRequest {
    barberId: string;
    serviceId: string;
    appointmentDateTime: string; // ISO 8601 format
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    notes?: string;
}

export interface UpdateAppointmentRequest {
    appointmentDateTime?: string;
    serviceId?: string;
    status?: AppointmentStatus;
    notes?: string;
    customerPhone?: string;
}

export interface AppointmentFilters {
    barberId?: string;
    startDate?: string; // YYYY-MM-DD
    endDate?: string; // YYYY-MM-DD
    status?: AppointmentStatus;
    page?: number;
    size?: number;
}
