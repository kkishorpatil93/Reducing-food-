import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../api/authService'
import { clearAuthToken } from '../api/apiClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verify active session on app load
  useEffect(() => {
    let isMounted = true
    const initAuth = async () => {
      try {
        const response = await authService.getMe()
        if (isMounted && response?.user) {
          setUser(response.user)
        }
      } catch (err) {
        // Unauthenticated guest session - normal behavior
        if (isMounted) setUser(null)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    initAuth()

    // Global listener for 401 unauthorized intercepted by apiClient
    const handleUnauthorized = () => {
      setUser(null)
      clearAuthToken()
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => {
      isMounted = false
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [])

  const login = useCallback(async ({ email, password }) => {
    const response = await authService.login({ email, password })
    if (response?.user) {
      setUser(response.user)
    }
    return response
  }, [])

  const register = useCallback(async (userData) => {
    const response = await authService.register(userData)
    if (response?.user) {
      setUser(response.user)
    }
    return response
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      setUser(null)
      clearAuthToken()
    }
  }, [])

  const value = {
    user,
    role: user?.role || 'guest',
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
