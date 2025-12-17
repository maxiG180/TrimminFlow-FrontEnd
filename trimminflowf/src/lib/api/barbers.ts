import { BarberResponse, CreateBarberRequest, UpdateBarberRequest } from '@/types/barber';
import { PageResponse, PaginationParams } from '@/types/pagination';
import apiClient from '../axios';

/**
 * Barber API - CRUD operations for managing barbers
 */
export const barberApi = {
    async create(barbershopId: string, data: CreateBarberRequest & { image?: File }): Promise<BarberResponse> {
        const formData = new FormData();
        formData.append('firstName', data.firstName);
        formData.append('lastName', data.lastName);
        if (data.email) formData.append('email', data.email);
        if (data.phone) formData.append('phone', data.phone);
        if (data.bio) formData.append('bio', data.bio);
        if (data.profileImageUrl) formData.append('profileImageUrl', data.profileImageUrl);
        if (data.image) formData.append('image', data.image);

        const response = await apiClient.post<BarberResponse>('/barbers', formData, {
            headers: { 'X-Barbershop-Id': barbershopId, 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    async getAll(barbershopId: string): Promise<BarberResponse[]> {
        const response = await apiClient.get<BarberResponse[]>('/barbers/all', {
            headers: { 'X-Barbershop-Id': barbershopId },
        });
        return response.data;
    },

    async getPaginated(barbershopId: string, params: PaginationParams = {}): Promise<PageResponse<BarberResponse>> {
        const { page = 0, size = 10, search, activeOnly = false } = params;
        const response = await apiClient.get<PageResponse<BarberResponse>>('/barbers', {
            headers: { 'X-Barbershop-Id': barbershopId },
            params: { page, size, search: search || undefined, activeOnly },
        });
        return response.data;
    },

    async getById(barbershopId: string, barberId: string): Promise<BarberResponse> {
        const response = await apiClient.get<BarberResponse>(`/barbers/${barberId}`, {
            headers: { 'X-Barbershop-Id': barbershopId },
        });
        return response.data;
    },

    async update(
        barbershopId: string,
        barberId: string,
        data: UpdateBarberRequest & { image?: File; removeProfileImage?: boolean }
    ): Promise<BarberResponse> {
        const formData = new FormData();
        if (data.firstName) formData.append('firstName', data.firstName);
        if (data.lastName) formData.append('lastName', data.lastName);
        if (data.email !== undefined) formData.append('email', data.email || '');
        if (data.phone !== undefined) formData.append('phone', data.phone || '');
        if (data.bio !== undefined) formData.append('bio', data.bio || '');
        if (data.profileImageUrl !== undefined) formData.append('profileImageUrl', data.profileImageUrl || '');
        if (data.isActive !== undefined) formData.append('isActive', String(data.isActive));
        if (data.image) formData.append('image', data.image);
        if (data.removeProfileImage) formData.append('removeProfileImage', String(data.removeProfileImage));

        const response = await apiClient.put<BarberResponse>(`/barbers/${barberId}`, formData, {
            headers: { 'X-Barbershop-Id': barbershopId, 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    async delete(barbershopId: string, barberId: string): Promise<void> {
        await apiClient.delete(`/barbers/${barberId}`, {
            headers: { 'X-Barbershop-Id': barbershopId },
        });
    },
};
