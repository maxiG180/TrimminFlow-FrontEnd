import { Customer } from '@/types';
import { Appointment } from '@/types/appointment';
import { PageResponse, PaginationParams } from '@/types/pagination';
import apiClient from '../axios';

/**
 * Customer API
 */
export const customerApi = {
    async getAll(barbershopId: string, params: PaginationParams = {}): Promise<PageResponse<Customer>> {
        const { page = 0, size = 10, search } = params;
        const response = await apiClient.get<PageResponse<Customer>>('/customers', {
            headers: { 'X-Barbershop-Id': barbershopId },
            params: { page, size, search: search || undefined },
        });
        return response.data;
    },

    async getById(barbershopId: string, customerId: string): Promise<Customer> {
        const response = await apiClient.get<Customer>(`/customers/${customerId}`, {
            headers: { 'X-Barbershop-Id': barbershopId },
        });
        return response.data;
    },

    async getAppointments(barbershopId: string, customerId: string, params: PaginationParams = {}): Promise<PageResponse<Appointment>> {
        const { page = 0, size = 10 } = params;
        const response = await apiClient.get<PageResponse<Appointment>>(`/customers/${customerId}/appointments`, {
            headers: { 'X-Barbershop-Id': barbershopId },
            params: { page, size },
        });
        return response.data;
    }
};
