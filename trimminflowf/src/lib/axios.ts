import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

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
