import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trimminflow-backend-production.up.railway.app/api/v1';

/**
 * Custom API Error class
 * Matches the ApiError used in api.ts for consistency
 */
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

/**
 * Axios instance with httpOnly cookie authentication
 *
 * 🔒 PRODUCTION-READY SECURITY:
 * - JWT token stored in httpOnly cookie (set by backend)
 * - Protected from XSS attacks (JavaScript cannot access httpOnly cookies)
 * - Browser automatically sends cookies with every request
 * - No manual token management needed
 *
 * This instance automatically:
 * 1. Sends cookies with every request (withCredentials: true)
 * 2. Handles authentication errors (401) and triggers logout
 * 3. Extracts backend error messages properly
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ✅ CRITICAL! Send cookies with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * No request interceptor needed!
 *
 * With httpOnly cookies, the browser automatically sends the cookie with every request.
 * We don't need to manually add Authorization headers anymore.
 *
 * The backend's JwtAuthenticationFilter will:
 * 1. Read the JWT from the httpOnly cookie
 * 2. Validate the token
 * 3. Set the authentication in Spring Security context
 */

/**
 * Response Interceptor
 *
 * Runs AFTER every response is received
 * Properly extracts backend error messages and throws ApiError
 */
apiClient.interceptors.response.use(
  (response) => {
    // If response is successful, just return it
    return response;
  },
  (error: AxiosError) => {
    // Handle response errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorData = error.response.data as any;
      const status = error.response.status;

      // Handle 401 Unauthorized or 403 Forbidden (invalid session)
      if (status === 401 || status === 403) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }
      }

      // Extract error message from backend
      let errorMessage = `Request failed with status ${status}`;

      // Handle validation errors (field errors from backend)
      if (errorData?.fieldErrors) {
        const fieldMessages = Object.entries(errorData.fieldErrors)
          .map(([field, message]) => `${field}: ${message}`)
          .join(', ');
        errorMessage = `Validation errors: ${fieldMessages}`;
      }
      // Handle standard error messages
      else if (errorData?.message) {
        errorMessage = errorData.message;
      }
      // Handle error field
      else if (errorData?.error) {
        errorMessage = errorData.error;
      }
      // Handle status text fallback
      else if (error.response.statusText) {
        errorMessage = error.response.statusText;
      }

      // Throw custom ApiError with extracted message
      throw new ApiError(status, errorMessage, errorData);
    }
    else if (error.request) {
      // The request was made but no response was received
      console.error('Network error - no response received');
      throw new ApiError(
        500,
        'Cannot connect to server. Please ensure the backend is running.',
        { originalError: error.message }
      );
    }
    else {
      // Something happened in setting up the request
      console.error('Error setting up request:', error.message);
      throw new ApiError(500, error.message || 'An unexpected error occurred');
    }
  }
);

export default apiClient;
