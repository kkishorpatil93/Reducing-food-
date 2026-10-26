import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'
import { MOCK_FOODS } from '../mocks/mockFoods'

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'
const mockDelay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

let localFoodsStore = [...MOCK_FOODS]

// Helper to normalize backend SQLite donations schema to frontend format
function normalizeDonation(d) {
  if (!d) return null
  return {
    id: d.id,
    title: d.title || 'Surplus Food Donation',
    category: d.food_type || d.category || 'Prepared Meals',
    quantity: d.qty_kg || d.quantity || 15,
    unit: d.unit || 'kg',
    status: d.status || 'Available',
    pickupLocation: d.donor_address || d.pickupLocation || '42 Baker Street, Downtown',
    availableFrom: d.created_at || d.availableFrom || new Date().toISOString(),
    expiryTime: d.available_until || d.expiryTime || new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
    description: d.notes || d.description || 'Wholesome surplus food packaged safely.',
    dietaryTags: Array.isArray(d.dietaryTags) ? d.dietaryTags : ['Vegetarian', 'Nut-Free'],
    allergens: Array.isArray(d.allergens) ? d.allergens : [],
    imageUrl: d.imageUrl || (
      d.food_type?.toLowerCase().includes('bakery')
        ? 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600'
        : d.food_type?.toLowerCase().includes('produce')
        ? 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600'
        : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'
    ),
    donor: {
      id: d.donor_id || 'usr_donor_1',
      name: d.donor_name || 'Green Bakery & Cafe',
      role: 'restaurant',
      rating: 4.9,
    },
    createdAt: d.created_at || new Date().toISOString(),
  }
}

export const foodService = {
  /**
   * Browse foods with filtering, searching, and pagination
   */
  async getFoods({ category, status, search, dietary, page = 1, limit = 9 } = {}) {
    if (useMocks) {
      await mockDelay()
      let filtered = [...localFoodsStore]

      if (category && category !== 'All') {
        filtered = filtered.filter((f) => f.category?.toLowerCase() === category.toLowerCase())
      }
      if (status && status !== 'All') {
        filtered = filtered.filter((f) => f.status?.toLowerCase() === status.toLowerCase())
      }
      if (dietary && dietary !== 'All') {
        filtered = filtered.filter((f) => f.dietaryTags?.includes(dietary))
      }
      if (search && search.trim()) {
        const q = search.trim().toLowerCase()
        filtered = filtered.filter(
          (f) =>
            f.title?.toLowerCase().includes(q) ||
            f.description?.toLowerCase().includes(q) ||
            f.pickupLocation?.toLowerCase().includes(q)
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

    try {
      const data = await apiClient.get(ENDPOINTS.FOODS.LIST, {
        params: {
          food_type: category !== 'All' ? category : undefined,
          status: status !== 'All' ? status : undefined,
        },
      })

      // Backend returns either array or { donations: [] }
      const rawList = Array.isArray(data) ? data : data?.donations || []
      const items = rawList.map(normalizeDonation)

      return {
        items,
        total: items.length,
        page: Number(page),
        totalPages: Math.ceil(items.length / limit) || 1,
        limit: Number(limit),
      }
    } catch {
      return {
        items: localFoodsStore.map(normalizeDonation),
        total: localFoodsStore.length,
        page: 1,
        totalPages: 1,
        limit,
      }
    }
  },

  /**
   * Get specific food item details by ID
   */
  async getFoodById(id) {
    if (useMocks) {
      await mockDelay()
      const item = localFoodsStore.find((f) => f.id === id)
      if (!item) throw new Error('Food listing not found.')
      return item
    }

    try {
      const data = await apiClient.get(ENDPOINTS.FOODS.DETAILS(id))
      return normalizeDonation(data?.donation || data)
    } catch {
      const fallback = localFoodsStore.find((f) => f.id === id)
      if (fallback) return fallback
      throw new Error('Food listing not found.')
    }
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

    const payload = {
      title: foodData.title,
      food_type: foodData.category,
      qty_kg: foodData.quantity,
      donor_address: foodData.pickupLocation,
      available_until: foodData.expiryTime,
      notes: foodData.description,
      dietaryTags: foodData.dietaryTags,
      allergens: foodData.allergens,
    }

    const data = await apiClient.post(ENDPOINTS.FOODS.CREATE, payload)
    return normalizeDonation(data?.donation || data)
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

    return apiClient.patch(ENDPOINTS.FOODS.CANCEL(id))
  },

  /**
   * Retrieve donations created by current user
   */
  async getMyDonations() {
    if (useMocks) {
      await mockDelay(300)
      return localFoodsStore
    }

    try {
      const data = await apiClient.get(ENDPOINTS.FOODS.MY_DONATIONS)
      const rawList = Array.isArray(data) ? data : data?.donations || []
      return rawList.map(normalizeDonation)
    } catch {
      return localFoodsStore
    }
  }
}
