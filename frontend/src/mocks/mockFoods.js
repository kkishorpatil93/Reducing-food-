/**
 * Development Mock Food Listings
 * ONLY active when VITE_USE_MOCKS=true
 */

// Helper to compute dynamic ISO timestamps relative to now
const now = Date.now()
const hoursFromNow = (h) => new Date(now + h * 3600 * 1000).toISOString()
const hoursAgo = (h) => new Date(now - h * 3600 * 1000).toISOString()

export const MOCK_FOODS = [
  {
    id: 'food_001',
    title: 'Artisan Sourdough & Baguettes',
    category: 'Bakery',
    quantity: 12,
    unit: 'loaves',
    status: 'Available',
    pickupLocation: '42 Baker Street, Downtown',
    availableFrom: hoursAgo(1),
    expiryTime: hoursFromNow(1.5), // URGENT (< 2 hours!)
    description: 'Freshly baked this morning in our stone hearth oven. No preservatives, completely natural and packaged in recyclable craft paper bags.',
    dietaryTags: ['Vegetarian', 'Vegan'],
    allergens: ['Gluten'],
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600',
    donor: {
      id: 'usr_donor_1',
      name: 'Green Bakery & Cafe',
      role: 'restaurant',
      rating: 4.9,
      phone: '+1 (555) 234-5678'
    },
    createdAt: hoursAgo(2)
  },
  {
    id: 'food_002',
    title: 'Warm Vegetable Lentil Curry & Jasmine Rice',
    category: 'Prepared Meals',
    quantity: 25,
    unit: 'boxed meals',
    status: 'Available',
    pickupLocation: '84 Spice Route, Midtown',
    availableFrom: hoursAgo(0.5),
    expiryTime: hoursFromNow(3.5),
    description: 'Hot catered surplus from a corporate luncheon. Packed individually in thermal containers, kept at safe holding temperature (>65°C).',
    dietaryTags: ['Vegetarian', 'Vegan', 'Halal', 'Gluten-Free'],
    allergens: [],
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
    donor: {
      id: 'usr_donor_1',
      name: 'Green Bakery & Cafe',
      role: 'restaurant',
      rating: 4.9,
      phone: '+1 (555) 234-5678'
    },
    createdAt: hoursAgo(1)
  },
  {
    id: 'food_003',
    title: 'Organic Heirloom Apples & Pears Crate',
    category: 'Produce',
    quantity: 30,
    unit: 'kg',
    status: 'Requested',
    pickupLocation: '12 Valley Road, Outskirts',
    availableFrom: hoursAgo(3),
    expiryTime: hoursFromNow(24),
    description: 'Slightly imperfect cosmetic shapes ("wonky fruit"), but perfectly crisp, juicy, and pesticide-free. Great for juice or fruit salad distribution.',
    dietaryTags: ['Vegetarian', 'Vegan', 'Gluten-Free'],
    allergens: [],
    imageUrl: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600',
    donor: {
      id: 'usr_donor_2',
      name: 'Sunrise Organic Farm',
      role: 'donor',
      rating: 4.8,
      phone: '+1 (555) 876-5432'
    },
    createdAt: hoursAgo(3)
  },
  {
    id: 'food_004',
    title: 'Gourmet Pasta Salad with Basil Pesto',
    category: 'Prepared Meals',
    quantity: 18,
    unit: 'portions',
    status: 'Accepted',
    pickupLocation: '42 Baker Street, Downtown',
    availableFrom: hoursAgo(2),
    expiryTime: hoursFromNow(2.2),
    description: 'Chilled penne pasta with pine nuts, fresh basil, cherry tomatoes, and aged parmesan. Chilled continuously below 4°C.',
    dietaryTags: ['Vegetarian'],
    allergens: ['Dairy', 'Gluten', 'Nuts'],
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600',
    donor: {
      id: 'usr_donor_1',
      name: 'Green Bakery & Cafe',
      role: 'restaurant',
      rating: 4.9,
      phone: '+1 (555) 234-5678'
    },
    createdAt: hoursAgo(3)
  },
  {
    id: 'food_005',
    title: 'Fresh Greek Yogurt & Oat Parfaits',
    category: 'Dairy',
    quantity: 20,
    unit: 'cups',
    status: 'Collected',
    pickupLocation: '42 Baker Street, Downtown',
    availableFrom: hoursAgo(6),
    expiryTime: hoursAgo(1),
    description: 'Individual sealed breakfast cups with honey and toasted rolled oats. Successfully rescued and delivered to community youth shelter.',
    dietaryTags: ['Vegetarian'],
    allergens: ['Dairy', 'Gluten'],
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600',
    donor: {
      id: 'usr_donor_1',
      name: 'Green Bakery & Cafe',
      role: 'restaurant',
      rating: 4.9,
      phone: '+1 (555) 234-5678'
    },
    createdAt: hoursAgo(7)
  },
  {
    id: 'food_006',
    title: 'Sandwich Platters (Assorted Deli)',
    category: 'Prepared Meals',
    quantity: 15,
    unit: 'platters',
    status: 'Expired',
    pickupLocation: '55 Commerce Blvd',
    availableFrom: hoursAgo(12),
    expiryTime: hoursAgo(2),
    description: 'Meeting platters past safe holding threshold. Marked expired in accordance with food safety protocols.',
    dietaryTags: ['Non-Vegetarian'],
    allergens: ['Gluten', 'Dairy'],
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600',
    donor: {
      id: 'usr_donor_1',
      name: 'Green Bakery & Cafe',
      role: 'restaurant',
      rating: 4.9
    },
    createdAt: hoursAgo(14)
  },
  {
    id: 'food_007',
    title: 'Surplus Fresh Milk & Almond Milk',
    category: 'Dairy',
    quantity: 10,
    unit: 'liters',
    status: 'Cancelled',
    pickupLocation: '12 Valley Road, Outskirts',
    availableFrom: hoursAgo(8),
    expiryTime: hoursFromNow(5),
    description: 'Listing withdrawn by donor due to on-site refrigeration issue.',
    dietaryTags: ['Vegetarian'],
    allergens: ['Dairy', 'Nuts'],
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600',
    donor: {
      id: 'usr_donor_2',
      name: 'Sunrise Organic Farm',
      role: 'donor',
      rating: 4.8
    },
    createdAt: hoursAgo(8)
  },
  {
    id: 'food_008',
    title: 'Mediterranean Pita Pockets & Falafel',
    category: 'Prepared Meals',
    quantity: 14,
    unit: 'servings',
    status: 'Rejected',
    pickupLocation: '19 Market Square',
    availableFrom: hoursAgo(5),
    expiryTime: hoursFromNow(1.8), // URGENT (< 2h)
    description: 'Hot falafel with tahini and parsley. Previous collection attempt was rejected due to volunteer vehicle breakdown.',
    dietaryTags: ['Vegetarian', 'Vegan', 'Halal'],
    allergens: ['Gluten', 'Sesame'],
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600',
    donor: {
      id: 'usr_donor_1',
      name: 'Green Bakery & Cafe',
      role: 'restaurant',
      rating: 4.9
    },
    createdAt: hoursAgo(5)
  }
]
