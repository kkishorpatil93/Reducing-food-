import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'
import { MOCK_NOTIFICATIONS } from '../mocks/mockNotifications'

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'
const mockDelay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

let localNotifs = [...MOCK_NOTIFICATIONS]

export const notificationService = {
  async getNotifications() {
    if (useMocks) {
      await mockDelay()
      return [...localNotifs]
    }
    return apiClient.get(ENDPOINTS.NOTIFICATIONS.LIST)
  },

  async markAsRead(id) {
    if (useMocks) {
      await mockDelay(150)
      localNotifs = localNotifs.map((n) => (n.id === id ? { ...n, read: true } : n))
      return { success: true }
    }
    return apiClient.patch(ENDPOINTS.NOTIFICATIONS.MARK_READ(id))
  },

  async markAllAsRead() {
    if (useMocks) {
      await mockDelay(150)
      localNotifs = localNotifs.map((n) => ({ ...n, read: true }))
      return { success: true }
    }
    return apiClient.post(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ)
  },

  async deleteNotification(id) {
    if (useMocks) {
      await mockDelay(150)
      localNotifs = localNotifs.filter((n) => n.id !== id)
      return { success: true }
    }
    return apiClient.delete(`/api/notifications/${id}`)
  }
}
