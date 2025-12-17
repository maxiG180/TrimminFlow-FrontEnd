import { API_BASE_URL, ApiError, RegisterRequest, RegisterResponse } from './config';

export const authApi = {
    /**
     * Register a new barbershop owner
     */
    async register(data: RegisterRequest): Promise<RegisterResponse> {
        try {
            console.log('📝 Registration attempt:', { email: data.email, barbershopName: data.barbershopName });

            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });

            console.log('📡 Registration response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('❌ Registration failed:', errorData);

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

            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                throw new ApiError(500, 'Cannot connect to server. Please ensure the backend is running.');
            }

            throw new ApiError(500, 'Network error: Could not connect to the server');
        }
    },
};
