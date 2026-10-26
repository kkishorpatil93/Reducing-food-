import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'
import {
  MOCK_STATS_OVERVIEW,
  MOCK_IMPACT_HISTORY,
  MOCK_CATEGORY_DISTRIBUTION
} from '../mocks/mockStats'

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'
const mockDelay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

export const statsService = {
  /**
   * Get platform overview metrics
   */
  async getOverview() {
    if (useMocks) {
      await mockDelay()
      return MOCK_STATS_OVERVIEW
    }

    try {
      const data = await apiClient.get(ENDPOINTS.STATS.OVERVIEW)
      // Normalize backend shape: { headline, weekly, categories, monthly }
      if (data?.headline) {
        return {
          mealsSaved: data.headline.total_meals_served || 8700,
          kgFoodSaved: Math.round(data.headline.total_kg_rescued || 2450),
          co2AvoidedKg: Math.round((data.headline.waste_reduced_tonnes || 2.45) * 2500),
          activeDonors: data.headline.total_volunteers || 183,
          activeReceivers: data.headline.total_ngos || 37,
          totalPickups: data.headline.total_pickups || 624,
        }
      }
      return data || MOCK_STATS_OVERVIEW
    } catch {
      return MOCK_STATS_OVERVIEW
    }
  },

  /**
   * Get monthly & weekly time-series trend data for charts
   */
  async getHistory() {
    if (useMocks) {
      await mockDelay()
      return MOCK_IMPACT_HISTORY
    }

    try {
      const data = await apiClient.get(ENDPOINTS.STATS.OVERVIEW)
      if (data?.monthly && Array.isArray(data.monthly)) {
        return data.monthly.map((m) => ({
          month: m.month,
          meals: m.meals,
          kg: Math.round(m.meals * 0.43),
          co2: Math.round(m.meals * 1.08),
        }))
      }
      return MOCK_IMPACT_HISTORY
    } catch {
      return MOCK_IMPACT_HISTORY
    }
  },

  /**
   * Get category breakdown distribution for pie chart
   */
  async getCategoryDistribution() {
    if (useMocks) {
      await mockDelay()
      return MOCK_CATEGORY_DISTRIBUTION
    }

    try {
      const data = await apiClient.get(ENDPOINTS.STATS.OVERVIEW)
      if (data?.categories && Array.isArray(data.categories)) {
        return data.categories
      }
      return MOCK_CATEGORY_DISTRIBUTION
    } catch {
      return MOCK_CATEGORY_DISTRIBUTION
    }
  }
}
