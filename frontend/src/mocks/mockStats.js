/**
 * Development Mock Statistics & Chart Data
 * ONLY active when VITE_USE_MOCKS=true
 */

export const MOCK_STATS_OVERVIEW = {
  mealsSaved: 14250,
  kgFoodSaved: 6120,
  co2AvoidedKg: 15300,
  activeDonors: 310,
  activeReceivers: 185,
  partnerRestaurants: 142,
  citiesActive: 8,
}

export const MOCK_IMPACT_HISTORY = [
  { month: 'May', meals: 1200, kg: 510, co2: 1280 },
  { month: 'Jun', meals: 1850, kg: 790, co2: 1980 },
  { month: 'Jul', meals: 2400, kg: 1020, co2: 2560 },
  { month: 'Aug', meals: 2900, kg: 1240, co2: 3100 },
  { month: 'Sep', meals: 3300, kg: 1410, co2: 3540 },
  { month: 'Oct', meals: 2600, kg: 1150, co2: 2840 },
]

export const MOCK_CATEGORY_DISTRIBUTION = [
  { name: 'Bakery', value: 35, color: '#16A34A' },
  { name: 'Prepared Meals', value: 30, color: '#F97316' },
  { name: 'Produce', value: 20, color: '#EAB308' },
  { name: 'Dairy', value: 10, color: '#3B82F6' },
  { name: 'Pantry', value: 5, color: '#8B5CF6' },
]
