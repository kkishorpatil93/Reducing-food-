import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'
import { MOCK_ADMIN_USERS, MOCK_REPORTS } from '../mocks/mockAdmin'
import { MOCK_FOODS } from '../mocks/mockFoods'

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'
const mockDelay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

let localUsers = [...MOCK_ADMIN_USERS]
let localReports = [...MOCK_REPORTS]
let localListings = [...MOCK_FOODS]

export const adminService = {
  async getUsers({ search = '', role = 'All' } = {}) {
    if (useMocks) {
      await mockDelay()
      let filtered = [...localUsers]
      if (role !== 'All') {
        filtered = filtered.filter((u) => u.role === role)
      }
      if (search.trim()) {
        const q = search.trim().toLowerCase()
        filtered = filtered.filter(
          (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
        )
      }
      return filtered
    }

    try {
      const data = await apiClient.get('/api/admin/users', { params: { search, role } })
      return data || localUsers
    } catch {
      return localUsers
    }
  },

  async toggleUserBlock(userId) {
    if (useMocks) {
      await mockDelay(200)
      localUsers = localUsers.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'blocked' ? 'active' : 'blocked'
          return { ...u, status: newStatus }
        }
        return u
      })
      return localUsers.find((u) => u.id === userId)
    }

    try {
      return apiClient.patch(`/api/admin/users/${userId}/block`)
    } catch {
      return { success: true }
    }
  },

  async getListings() {
    if (useMocks) {
      await mockDelay()
      return [...localListings]
    }

    try {
      const data = await apiClient.get('/api/donations')
      return Array.isArray(data) ? data : data?.donations || localListings
    } catch {
      return localListings
    }
  },

  async removeListing(listingId) {
    if (useMocks) {
      await mockDelay(200)
      localListings = localListings.filter((l) => l.id !== listingId)
      return { success: true }
    }

    return apiClient.patch(`/api/donations/${listingId}/cancel`)
  },

  async getReports() {
    if (useMocks) {
      await mockDelay()
      return [...localReports]
    }

    try {
      const data = await apiClient.get('/api/reports')
      return data || localReports
    } catch {
      return localReports
    }
  },

  async resolveReport(reportId, resolutionNotes) {
    if (useMocks) {
      await mockDelay(200)
      localReports = localReports.map((r) => {
        if (r.id === reportId) {
          return { ...r, status: 'resolved', resolutionNotes }
        }
        return r
      })
      return { success: true }
    }

    return apiClient.post('/api/reports', { reportId, resolutionNotes, status: 'resolved' })
  }
}
