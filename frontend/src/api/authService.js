import apiClient, { setAuthToken, clearAuthToken } from './apiClient'
import { ENDPOINTS } from './endpoints'
import { MOCK_USERS } from '../mocks/mockAuth'

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'

// Helper to simulate network latency for mocks
const mockDelay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))

export const authService = {
  /**
   * Log in user
   */
  async login({ email, password }) {
    if (useMocks) {
      await mockDelay()
      const foundUser = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      )
      if (!foundUser) {
        const error = new Error('Invalid email or password.')
        error.code = 'INVALID_CREDENTIALS'
        error.status = 401
        throw error
      }
      setAuthToken('mock_jwt_token_' + foundUser.id)
      return { user: foundUser, token: 'mock_jwt_token_' + foundUser.id }
    }

    const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, { email, password })
    if (response?.token) setAuthToken(response.token)
    return response
  },

  /**
   * Register a new user with specific role
   */
  async register({ name, email, password, role, phone, organizationName }) {
    if (useMocks) {
      await mockDelay()
      const existing = MOCK_USERS.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
      if (existing) {
        const error = new Error('An account with this email address already exists.')
        error.code = 'EMAIL_EXISTS'
        error.status = 400
        throw error
      }
      const newUser = {
        id: `usr_${Date.now()}`,
        name,
        email,
        role: role || 'receiver',
        phone,
        organizationName,
        joinedDate: new Date().toISOString()
      }
      MOCK_USERS.push(newUser)
      setAuthToken('mock_jwt_token_' + newUser.id)
      return { user: newUser, token: 'mock_jwt_token_' + newUser.id }
    }

    const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, {
      name,
      email,
      password,
      role,
      phone,
      organizationName,
    })
    if (response?.token) setAuthToken(response.token)
    return response
  },

  /**
   * Log out user
   */
  async logout() {
    clearAuthToken()
    if (useMocks) {
      await mockDelay(150)
      return { success: true }
    }
    return apiClient.post(ENDPOINTS.AUTH.LOGOUT)
  },

  /**
   * Fetch current authenticated session
   */
  async getMe() {
    if (useMocks) {
      await mockDelay(200)
      // Default to restaurant user in mock development mode
      return { user: MOCK_USERS[0] }
    }
    return apiClient.get(ENDPOINTS.AUTH.ME)
  }
}
