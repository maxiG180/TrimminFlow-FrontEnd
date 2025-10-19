import { Barbershop } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export interface CreateBarbershopRequest {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  description?: string;
  timezone?: string;
  businessHours?: string; // JSON string format: {"monday": "9:00-18:00", ...}
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

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const barbershopApi = {
  /**
   * Create a new barbershop
   * @param data - Barbershop creation data
   * @returns Created barbershop with generated ID and timestamps
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
        throw new ApiError(response.status, 'Failed to fetch barbershops');
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
        throw new ApiError(response.status, 'Failed to fetch barbershop');
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

export const authApi = {
  /**
   * Register a new barbershop owner
   * Creates both the barbershop and owner user account
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
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
          errorData.message || `Registration failed: ${response.statusText}`,
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

export { ApiError };