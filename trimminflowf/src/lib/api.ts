import { Barbershop, Customer } from '@/types';
import { Service, CreateServiceRequest, UpdateServiceRequest } from '@/types/service';
import { Barber, BarberResponse, CreateBarberRequest, UpdateBarberRequest } from '@/types/barber';
import { BusinessHours, BusinessHoursResponse, SetBusinessHoursRequest } from '@/types/businessHours';
import { PageResponse, PaginationParams } from '@/types/pagination';
import apiClient, { publicApiClient } from './axios';
import { Appointment, CreateAppointmentRequest, UpdateAppointmentRequest, AppointmentFilters } from '@/types/appointment';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trimminflow-backend-production.up.railway.app/api/v1';

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
   * Get barbershop by ID (public endpoint - no auth required)
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

export const authApi = {
  /**
   * Register a new barbershop owner
   * Creates both the barbershop and owner user account
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      console.log('📝 Registration attempt:', { email: data.email, barbershopName: data.barbershopName });

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ✅ Include credentials for CORS
        body: JSON.stringify(data),
      });

      console.log('📡 Registration response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Registration failed:', errorData);

        // Handle validation errors from backend
        if (errorData.fieldErrors) {
          const fieldMessages = Object.entries(errorData.fieldErrors)
            .map(([field, message]) => `${field}: ${message}`)
            .join(', ');
          throw new ApiError(
            response.status,
            `Validation errors: ${fieldMessages}`,
            errorData
          );
        }

        throw new ApiError(
          response.status,
          errorData.message || errorData.error || `Registration failed: ${response.statusText}`,
          errorData
        );
      }

      const result = await response.json();
      console.log('✅ Registration successful:', result.email);
      return result;
    } catch (error) {
      console.error('❌ Registration error:', error);

      if (error instanceof ApiError) {
        throw error;
      }

      // Better error message for network failures
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new ApiError(500, 'Cannot connect to server. Please ensure the backend is running.');
      }

      throw new ApiError(500, 'Network error: Could not connect to the server');
    }
  },
};

/**
 * Service API
 *
 * CRUD operations for managing barbershop services
 * Uses axios with automatic JWT token injection
 */
export const serviceApi = {
  /**
   * Create a new service
   *
   * @param barbershopId - The barbershop's UUID
   * @param data - Service creation data
   * @returns Created service
   */
  async create(barbershopId: string, data: CreateServiceRequest): Promise<Service> {
    const response = await apiClient.post<Service>('/services', data, {
      headers: {
        'X-Barbershop-Id': barbershopId,
      },
    });
    return response.data;
  },

  /**
   * Get all services for a barbershop (non-paginated)
   *
   * @param barbershopId - The barbershop's UUID
   * @returns List of all services
   */
  async getAll(barbershopId: string): Promise<Service[]> {
    const response = await apiClient.get<Service[]>('/services/all', {
      headers: {
        'X-Barbershop-Id': barbershopId,
      },
    });
    return response.data;
  },

  /**
   * Get services with pagination and optional search
   *
   * @param barbershopId - The barbershop's UUID
   * @param params - Pagination and search parameters
   * @returns Paginated services
   */
  async getPaginated(
    barbershopId: string,
    params: PaginationParams = {}
  ): Promise<PageResponse<Service>> {
    const { page = 0, size = 10, search, activeOnly = false } = params;
    const response = await apiClient.get<PageResponse<Service>>('/services', {
      headers: {
        'X-Barbershop-Id': barbershopId,
      },
      params: {
        page,
        size,
        search: search || undefined,
        activeOnly,
      },
    });
    return response.data;
  },

  /**
   * Get all active services for a barbershop
   *
   * @param barbershopId - The barbershop's UUID
   * @returns List of active services
   */
  async getActive(barbershopId: string): Promise<Service[]> {
    const response = await apiClient.get<Service[]>('/services/active');
    return response.data;
  },

  /**
   * Get a specific service by ID
   *
   * @param barbershopId - The barbershop's UUID
   * @param serviceId - The service's UUID
   * @returns Service details
   */
  async getById(barbershopId: string, serviceId: string): Promise<Service> {
    const response = await apiClient.get<Service>(`/services/${serviceId}`, {
      headers: {
        'X-Barbershop-Id': barbershopId,
      },
    });
    return response.data;
  },

  /**
   * Update an existing service
   *
   * @param barbershopId - The barbershop's UUID
   * @param serviceId - The service's UUID
   * @param data - Update data (only provided fields will be updated)
   * @returns Updated service
   */
  async update(
    barbershopId: string,
    serviceId: string,
    data: UpdateServiceRequest
  ): Promise<Service> {
    const response = await apiClient.put<Service>(`/services/${serviceId}`, data, {
      headers: {
        'X-Barbershop-Id': barbershopId,
      },
    });
    return response.data;
  },

  /**
   * Delete a service (soft delete)
   *
   * @param barbershopId - The barbershop's UUID
   * @param serviceId - The service's UUID
   */
  async delete(barbershopId: string, serviceId: string): Promise<void> {
    await apiClient.delete(`/services/${serviceId}`, {
      headers: {
        'X-Barbershop-Id': barbershopId,
      },
    });
  },

  /**
   * Permanently delete a service
   *
   * @param barbershopId - The barbershop's UUID
   * @param serviceId - The service's UUID
   */
  async hardDelete(barbershopId: string, serviceId: string): Promise<void> {
    await apiClient.delete(`/services/${serviceId}/hard`, {
      headers: {
        'X-Barbershop-Id': barbershopId,
      },
    });
  },
};

/**
 * Barber API
 *
 * CRUD operations for managing barbers
 */
export const barberApi = {
  /**
   * Create a new barber
   */
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
      headers: {
        'X-Barbershop-Id': barbershopId,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get all barbers (non-paginated)
   */
  async getAll(barbershopId: string): Promise<BarberResponse[]> {
    const response = await apiClient.get<BarberResponse[]>('/barbers/all', {
      headers: {
        'X-Barbershop-Id': barbershopId,
      },
    });
    return response.data;
  },

  /**
   * Get barbers with pagination and optional search
   */
  async getPaginated(
    barbershopId: string,
    params: PaginationParams = {}
  ): Promise<PageResponse<BarberResponse>> {
    const { page = 0, size = 10, search, activeOnly = false } = params;
    const response = await apiClient.get<PageResponse<BarberResponse>>('/barbers', {
      headers: {
        'X-Barbershop-Id': barbershopId,
      },
      params: {
        page,
        size,
        search: search || undefined,
        activeOnly,
      },
    });
    return response.data;
  },

  /**
   * Get a specific barber by ID
   */
  async getById(barbershopId: string, barberId: string): Promise<BarberResponse> {
    const response = await apiClient.get<BarberResponse>(`/barbers/${barberId}`, {
      headers: {
        'X-Barbershop-Id': barbershopId,
      },
    });
    return response.data;
  },

  /**
   * Update an existing barber
   */
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
      headers: {
        'X-Barbershop-Id': barbershopId,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Delete a barber (soft delete)
   */
  async delete(barbershopId: string, barberId: string): Promise<void> {
    await apiClient.delete(`/barbers/${barberId}`, {
      headers: {
        'X-Barbershop-Id': barbershopId,
      },
    });
  },

  /**
   * Permanently delete a barber
   */
  async hardDelete(barbershopId: string, barberId: string): Promise<void> {
    await apiClient.delete(`/barbers/${barberId}/hard`, {
      headers: {
        'X-Barbershop-Id': barbershopId,
      },
    });
  },
  /**
   * Get all active barbers (paginated, but we'll fetch a large page for the UI)
   */
  async getActive(barbershopId: string): Promise<BarberResponse[]> {
    const response = await apiClient.get<PageResponse<BarberResponse>>('/barbers/active', {
      params: {
        size: 100,
      },
    });
    return response.data.content;
  },
};

/**
 * Business Hours API
 *
 * Manage shop opening hours
 */
export const businessHoursApi = {
  /**
   * Set business hours for a specific day
   */
  async setHours(
    barbershopId: string,
    data: SetBusinessHoursRequest
  ): Promise<BusinessHoursResponse> {
    const response = await apiClient.post<BusinessHoursResponse>('/business-hours', data, {
      headers: {
        'X-Barbershop-Id': barbershopId,
      },
    });
    return response.data;
  },

  /**
   * Get all business hours for the barbershop
   */
  async getAll(barbershopId: string): Promise<BusinessHoursResponse[]> {
    const response = await apiClient.get<BusinessHoursResponse[]>('/business-hours', {
      headers: {
        'X-Barbershop-Id': barbershopId,
      },
    });
    return response.data;
  },
};

/**
 * Appointment API
 */
export const appointmentApi = {
  async create(barbershopId: string, data: CreateAppointmentRequest): Promise<Appointment> {
    const response = await publicApiClient.post<Appointment>('/appointments', data, {
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
    const response = await publicApiClient.get<string[]>('/appointments/availability', {
      params: { barberId, date, serviceDuration },
    });
    return response.data;
  },
};

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

export { ApiError };