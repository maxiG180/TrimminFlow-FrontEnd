import { Appointment, CreateAppointmentRequest, UpdateAppointmentRequest, AppointmentFilters } from '@/types/appointment';
import { PageResponse } from '@/types/pagination';
import apiClient from '../axios';

/**
 * Appointment API
 */
export const appointmentApi = {
    async create(barbershopId: string, data: CreateAppointmentRequest): Promise<Appointment> {
        const response = await apiClient.post<Appointment>('/appointments', data, {
            headers: { 'X-Barbershop-Id': barbershopId },
        });
        return response.data;
    },

    async getAll(barbershopId: string, filters?: AppointmentFilters): Promise<PageResponse<Appointment>> {
        const response = await apiClient.get<PageResponse<Appointment>>('/appointments', {
            headers: { 'X-Barbershop-Id': barbershopId },
            params: filters,
        });
        return response.data;
    },

    async getById(barbershopId: string, appointmentId: string): Promise<Appointment> {
        const response = await apiClient.get<Appointment>(`/appointments/${appointmentId}`, {
            headers: { 'X-Barbershop-Id': barbershopId },
        });
        return response.data;
    },

    async update(barbershopId: string, appointmentId: string, data: UpdateAppointmentRequest): Promise<Appointment> {
        const response = await apiClient.put<Appointment>(`/appointments/${appointmentId}`, data, {
            headers: { 'X-Barbershop-Id': barbershopId },
        });
        return response.data;
    },

    async cancel(barbershopId: string, appointmentId: string): Promise<void> {
        await apiClient.delete(`/appointments/${appointmentId}`, {
            headers: { 'X-Barbershop-Id': barbershopId },
        });
    },

    async getAvailableSlots(barberId: string, date: string, serviceDuration: number): Promise<string[]> {
        const response = await apiClient.get<string[]>('/appointments/availability', {
            params: { barberId, date, serviceDuration },
        });
        return response.data;
    },
};
