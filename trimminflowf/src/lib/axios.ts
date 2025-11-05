import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

/**
 * Axios instance with JWT authentication interceptor
 *
 * This instance automatically:
 * 1. Adds the JWT token to every request's Authorization header
 * 2. Handles token expiration and authentication errors
 *
 * HOW IT WORKS:
 * - Request interceptor: Runs before every request, adds "Authorization: Bearer <token>" header
 * - Response interceptor: Catches 401 errors and can trigger logout/refresh
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Function to set the token getter
 * This will be called by the AuthProvider to provide access to the token
 */
let tokenGetter: (() => string | null) | null = null;

export function setTokenGetter(getter: () => string | null) {
  tokenGetter = getter;
}

/**
 * Request Interceptor
 *
 * Runs BEFORE every request is sent
 * Adds the JWT token from memory to the Authorization header
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get token from memory via the tokenGetter function
    const token = tokenGetter?.();

    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 *
 * Runs AFTER every response is received
 * Handles authentication errors (401) and other common errors
 */
apiClient.interceptors.response.use(
  (response) => {
    // If response is successful, just return it
    return response;
  },
  (error) => {
    // Handle response errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx

      if (error.response.status === 401) {
        // Unauthorized - token expired or invalid
        // We can dispatch a custom event that the AuthContext can listen to
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }
      }

      if (error.response.status === 403) {
        // Forbidden - user doesn't have permission
        console.error('Access forbidden:', error.response.data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network error - no response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
