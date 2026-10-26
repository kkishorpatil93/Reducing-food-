import axios from 'axios'

/**
 * Central Axios HTTP Client
 * 
 * Security & Auth Policy:
 * 1. `withCredentials: true` is enabled by default to transmit secure httpOnly cookies.
 * 2. In-memory token management: If the backend chooses JWT Bearer tokens instead of cookies,
 *    tokens are kept strictly in memory (never in localStorage to prevent XSS exfiltration).
 * 3. Global Interceptors handle 401 (Unauthorized) and 403 (Forbidden) consistently.
 */

let inMemoryToken = null

export const setAuthToken = (token) => {
  inMemoryToken = token
}

export const getAuthToken = () => inMemoryToken

export const clearAuthToken = () => {
  inMemoryToken = null
}

const baseURL = import.meta.env.VITE_API_BASE_URL || ''

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
})

// Request Interceptor: Attach in-memory token if present
apiClient.interceptors.request.use(
  (config) => {
    if (inMemoryToken) {
      config.headers.Authorization = `Bearer ${inMemoryToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Global 401 / 403 & Error Normalization
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status
    const customError = {
      status,
      code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
      message: error.response?.data?.error?.message || error.message || 'Network request failed',
      details: error.response?.data?.error?.details || [],
    }

    if (status === 401) {
      clearAuthToken()
      // Dispatch custom event so AuthContext can handle logout without circular import
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    } else if (status === 403) {
      window.dispatchEvent(new CustomEvent('auth:forbidden'))
    }

    return Promise.reject(customError)
  }
)

export default apiClient
