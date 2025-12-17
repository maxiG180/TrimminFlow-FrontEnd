import { Service, CreateServiceRequest, UpdateServiceRequest } from '@/types/service';
import { PageResponse, PaginationParams } from '@/types/pagination';
import apiClient from '../axios';

/**
 * Service API - CRUD operations for managing barbershop services
 */
export const serviceApi = {
    async create(barbershopId: string, data: CreateServiceRequest): Promise<Service> {
        const response = await apiClient.post<Service>('/services', data, {
            headers: { 'X-Barbershop-Id': barbershopId },
        });
        return response.data;
    },

    async getAll(barbershopId: string): Promise<Service[]> {
        const response = await apiClient.get<Service[]>('/services/all', {
            headers: { 'X-Barbershop-Id': barbershopId },
        });
        return response.data;
    },

    async getPaginated(barbershopId: string, params: PaginationParams = {}): Promise<PageResponse<Service>> {
        const { page = 0, size = 10, search, activeOnly = false } = params;
        const response = await apiClient.get<PageResponse<Service>>('/services', {
            headers: { 'X-Barbershop-Id': barbershopId },
            params: { page, size, search: search || undefined, activeOnly },
        });
        return response.data;
    },

    async getActive(barbershopId: string): Promise<Service[]> {
        const response = await apiClient.get<Service[]>('/services/active', {
            headers: { 'X-Barbershop-Id': barbershopId },
        });
        return response.data;
    },

    async getById(barbershopId: string, serviceId: string): Promise<Service> {
        const response = await apiClient.get<Service>(`/services/${serviceId}`, {
            headers: { 'X-Barbershop-Id': barbershopId },
        });
        return response.data;
    },

    async update(barbershopId: string, serviceId: string, data: UpdateServiceRequest): Promise<Service> {
        const response = await apiClient.put<Service>(`/services/${serviceId}`, data, {
            headers: { 'X-Barbershop-Id': barbershopId },
        });
        return response.data;
    },

    async delete(barbershopId: string, serviceId: string): Promise<void> {
        await apiClient.delete(`/services/${serviceId}`, {
            headers: { 'X-Barbershop-Id': barbershopId },
        });
    },

    async hardDelete(barbershopId: string, serviceId: string): Promise<void> {
        await apiClient.delete(`/services/${serviceId}/hard`, {
            headers: { 'X-Barbershop-Id': barbershopId },
        });
    },
};
