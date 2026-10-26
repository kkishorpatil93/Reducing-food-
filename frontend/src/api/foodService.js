import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'
import { MOCK_FOODS } from '../mocks/mockFoods'

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'
const mockDelay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

let localFoodsStore = [...MOCK_FOODS]

export const foodService = {
  /**
   * Browse foods with filtering, searching, and pagination
   */
  async getFoods({ category, status, search, dietary, page = 1, limit = 9 } = {}) {
    if (useMocks) {
      await mockDelay()
      let filtered = [...localFoodsStore]

      if (category && category !== 'All') {
        filtered = filtered.filter((f) => f.category.toLowerCase() === category.toLowerCase())
      }
      if (status && status !== 'All') {
        filtered = filtered.filter((f) => f.status.toLowerCase() === status.toLowerCase())
      }
      if (dietary && dietary !== 'All') {
        filtered = filtered.filter((f) => f.dietaryTags?.includes(dietary))
      }
      if (search && search.trim()) {
        const q = search.trim().toLowerCase()
        filtered = filtered.filter(
          (f) =>
            f.title.toLowerCase().includes(q) ||
            f.description.toLowerCase().includes(q) ||
            f.pickupLocation.toLowerCase().includes(q)
        )
      }

      const total = filtered.length
      const totalPages = Math.ceil(total / limit) || 1
      const startIndex = (page - 1) * limit
      const items = filtered.slice(startIndex, startIndex + limit)

      return {
        items,
        total,
        page: Number(page),
        totalPages,
        limit: Number(limit),
      }
    }

    return apiClient.get(ENDPOINTS.FOODS.LIST, {
      params: { category, status, search, dietary, page, limit },
    })
  },

  /**
   * Get specific food item details by ID
   */
  async getFoodById(id) {
    if (useMocks) {
      await mockDelay()
      const item = localFoodsStore.find((f) => f.id === id)
      if (!item) {
        const error = new Error('Food listing not found.')
        error.code = 'NOT_FOUND'
        error.status = 404
        throw error
      }
      return item
    }

    return apiClient.get(ENDPOINTS.FOODS.DETAILS(id))
  },

  /**
   * Create a new food listing
   */
  async createFood(foodData) {
    if (useMocks) {
      await mockDelay(400)
      const newItem = {
        id: `food_${Date.now()}`,
        status: 'Available',
        createdAt: new Date().toISOString(),
        donor: {
          id: 'usr_donor_1',
          name: 'Green Bakery & Cafe',
          role: 'restaurant',
          rating: 4.9,
          phone: '+1 (555) 234-5678'
        },
        ...foodData,
      }
      localFoodsStore.unshift(newItem)
      return newItem
    }

    return apiClient.post(ENDPOINTS.FOODS.CREATE, foodData)
  },

  /**
   * Update an existing food listing
   */
  async updateFood(id, updates) {
    if (useMocks) {
      await mockDelay(300)
      const index = localFoodsStore.findIndex((f) => f.id === id)
      if (index === -1) throw new Error('Listing not found.')
      localFoodsStore[index] = { ...localFoodsStore[index], ...updates }
      return localFoodsStore[index]
    }

    return apiClient.patch(ENDPOINTS.FOODS.UPDATE(id), updates)
  },

  /**
   * Cancel / delete a food listing
   */
  async deleteFood(id) {
    if (useMocks) {
      await mockDelay(250)
      localFoodsStore = localFoodsStore.filter((f) => f.id !== id)
      return { success: true }
    }

    return apiClient.delete(ENDPOINTS.FOODS.DELETE(id))
  },

  /**
   * Retrieve donations created by current user
   */
  async getMyDonations() {
    if (useMocks) {
      await mockDelay(300)
      return localFoodsStore.filter((f) => f.donor?.id === 'usr_donor_1')
    }

    return apiClient.get(ENDPOINTS.FOODS.MY_DONATIONS)
  }
}
