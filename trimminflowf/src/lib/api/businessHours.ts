import { BusinessHoursResponse, SetBusinessHoursRequest } from '@/types/businessHours';
import apiClient from '../axios';

/**
 * Business Hours API - Manage shop opening hours
 */
export const businessHoursApi = {
    async setHours(barbershopId: string, data: SetBusinessHoursRequest): Promise<BusinessHoursResponse> {
        const response = await apiClient.post<BusinessHoursResponse>('/business-hours', data, {
            headers: { 'X-Barbershop-Id': barbershopId },
        });
        return response.data;
    },

    async getAll(barbershopId: string): Promise<BusinessHoursResponse[]> {
        const response = await apiClient.get<BusinessHoursResponse[]>('/business-hours', {
            headers: { 'X-Barbershop-Id': barbershopId },
        });
        return response.data;
    },
};
