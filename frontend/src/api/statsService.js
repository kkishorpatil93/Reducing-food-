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
   * Get platform-wide counters: meals, kg, co2, active donors
   */
  async getOverview() {
    if (useMocks) {
      await mockDelay()
      return MOCK_STATS_OVERVIEW
    }
    return apiClient.get(ENDPOINTS.STATS.OVERVIEW)
  },

  /**
   * Get historical trend data for charts
   */
  async getHistory() {
    if (useMocks) {
      await mockDelay()
      return MOCK_IMPACT_HISTORY
    }
    return apiClient.get(ENDPOINTS.STATS.HISTORY)
  },

  /**
   * Get distribution breakdown
   */
  async getCategoryDistribution() {
    if (useMocks) {
      await mockDelay()
      return MOCK_CATEGORY_DISTRIBUTION
    }
    return apiClient.get('/api/stats/categories')
  }
}
