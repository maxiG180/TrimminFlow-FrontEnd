// API Base URL configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trimminflow-backend-production.up.railway.app/api/v1';

// Custom API Error class
export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// Shared request types
export interface CreateBarbershopRequest {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    description?: string;
    timezone?: string;
    businessHours?: string;
    qrCodeUrl?: string;
}

export interface RegisterRequest {
    barbershopName: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
}

export interface RegisterResponse {
    userId: string;
    barbershopId: string;
    email: string;
    message: string;
}
