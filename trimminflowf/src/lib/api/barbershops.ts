import { Barbershop } from '@/types';
import { API_BASE_URL, ApiError, CreateBarbershopRequest } from './config';

export const barbershopApi = {
    /**
     * Create a new barbershop
     */
    async create(data: CreateBarbershopRequest): Promise<Barbershop> {
        try {
            const response = await fetch(`${API_BASE_URL}/barbershops`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new ApiError(
                    response.status,
                    errorData.message || `Failed to create barbershop: ${response.statusText}`,
                    errorData
                );
            }

            return await response.json();
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Network error: Could not connect to the server');
        }
    },

    /**
     * Get all barbershops
     */
    async getAll(): Promise<Barbershop[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/barbershops`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new ApiError(
                    response.status,
                    errorData.message || `Failed to fetch barbershops: ${response.statusText}`,
                    errorData
                );
            }

            return await response.json();
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Network error: Could not connect to the server');
        }
    },

    /**
     * Get barbershop by ID
     */
    async getById(id: string): Promise<Barbershop> {
        try {
            const response = await fetch(`${API_BASE_URL}/barbershops/${id}`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new ApiError(
                    response.status,
                    errorData.message || `Failed to fetch barbershop: ${response.statusText}`,
                    errorData
                );
            }

            return await response.json();
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Network error: Could not connect to the server');
        }
    },
};
