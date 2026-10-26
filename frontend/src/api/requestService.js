import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'
import { MOCK_REQUESTS } from '../mocks/mockRequests'
import { MOCK_FOODS } from '../mocks/mockFoods'

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'
const mockDelay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

let localRequestsStore = [...MOCK_REQUESTS]

export const requestService = {
  /**
   * Submit collection request for food item
   */
  async createRequest({ foodId, notes, estimatedPickupTime }) {
    if (useMocks) {
      await mockDelay(350)
      const foodItem = MOCK_FOODS.find((f) => f.id === foodId)
      const newRequest = {
        id: `req_${Date.now()}`,
        foodId,
        food: foodItem || { id: foodId, title: 'Rescued Item' },
        receiver: {
          id: 'usr_ngo_1',
          name: 'Food For All Community Care',
          role: 'ngo',
          phone: '+1 (555) 345-6789'
        },
        status: 'Requested',
        notes: notes || '',
        estimatedPickupTime: estimatedPickupTime || new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
        createdAt: new Date().toISOString()
      }
      localRequestsStore.unshift(newRequest)
      return newRequest
    }

    return apiClient.post(ENDPOINTS.REQUESTS.CREATE, { foodId, notes, estimatedPickupTime })
  },

  /**
   * Get requests created by logged-in receiver/NGO
   */
  async getMyRequests() {
    if (useMocks) {
      await mockDelay(250)
      return localRequestsStore
    }
    return apiClient.get(ENDPOINTS.REQUESTS.MY_REQUESTS)
  },

  /**
   * Get incoming requests for donor's active listings
   */
  async getIncomingRequests() {
    if (useMocks) {
      await mockDelay(250)
      return localRequestsStore
    }
    return apiClient.get(ENDPOINTS.REQUESTS.INCOMING)
  },

  /**
   * Donor accepts collection request
   */
  async acceptRequest(id) {
    if (useMocks) {
      await mockDelay(300)
      const req = localRequestsStore.find((r) => r.id === id)
      if (req) req.status = 'Accepted'
      return req
    }
    return apiClient.patch(ENDPOINTS.REQUESTS.ACCEPT(id))
  },

  /**
   * Donor rejects collection request
   */
  async rejectRequest(id) {
    if (useMocks) {
      await mockDelay(300)
      const req = localRequestsStore.find((r) => r.id === id)
      if (req) req.status = 'Rejected'
      return req
    }
    return apiClient.patch(ENDPOINTS.REQUESTS.REJECT(id))
  },

  /**
   * Mark collection as successfully completed
   */
  async confirmCollection(id) {
    if (useMocks) {
      await mockDelay(300)
      const req = localRequestsStore.find((r) => r.id === id)
      if (req) {
        req.status = 'Collected'
        req.collectedAt = new Date().toISOString()
      }
      return req
    }
    return apiClient.patch(ENDPOINTS.REQUESTS.CONFIRM_COLLECTION(id))
  },

  /**
   * Submit post-collection rating and feedback
   */
  async submitFeedback(id, { rating, feedback }) {
    if (useMocks) {
      await mockDelay(300)
      const req = localRequestsStore.find((r) => r.id === id)
      if (req) {
        req.rating = rating
        req.feedback = feedback
      }
      return { success: true }
    }
    return apiClient.post(ENDPOINTS.REQUESTS.SUBMIT_FEEDBACK(id), { rating, feedback })
  }
}
