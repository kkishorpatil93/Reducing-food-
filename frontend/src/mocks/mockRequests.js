/**
 * Development Mock Requests
 * ONLY active when VITE_USE_MOCKS=true
 */

export const MOCK_REQUESTS = [
  {
    id: 'req_001',
    foodId: 'food_003',
    food: {
      id: 'food_003',
      title: 'Organic Heirloom Apples & Pears Crate',
      quantity: 30,
      unit: 'kg',
      pickupLocation: '12 Valley Road, Outskirts',
      expiryTime: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      donorName: 'Sunrise Organic Farm'
    },
    receiver: {
      id: 'usr_ngo_1',
      name: 'Food For All Community Care',
      role: 'ngo',
      phone: '+1 (555) 345-6789'
    },
    status: 'Requested',
    notes: 'Our community van will be in the neighborhood today between 4 PM and 5 PM.',
    estimatedPickupTime: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3600 * 1000).toISOString()
  },
  {
    id: 'req_002',
    foodId: 'food_004',
    food: {
      id: 'food_004',
      title: 'Gourmet Pasta Salad with Basil Pesto',
      quantity: 18,
      unit: 'portions',
      pickupLocation: '42 Baker Street, Downtown',
      expiryTime: new Date(Date.now() + 2.2 * 3600 * 1000).toISOString(),
      donorName: 'Green Bakery & Cafe'
    },
    receiver: {
      id: 'usr_receiver_1',
      name: 'City Youth Center',
      role: 'receiver',
      phone: '+1 (555) 456-7890'
    },
    status: 'Accepted',
    notes: 'Volunteer team dispatched with insulated thermal bags.',
    estimatedPickupTime: new Date(Date.now() + 1.2 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: 'req_003',
    foodId: 'food_005',
    food: {
      id: 'food_005',
      title: 'Fresh Greek Yogurt & Oat Parfaits',
      quantity: 20,
      unit: 'cups',
      pickupLocation: '42 Baker Street, Downtown',
      expiryTime: new Date(Date.now() - 3600 * 1000).toISOString(),
      donorName: 'Green Bakery & Cafe'
    },
    receiver: {
      id: 'usr_receiver_1',
      name: 'City Youth Center',
      role: 'receiver'
    },
    status: 'Collected',
    notes: 'Collected on time. Served at afternoon tutoring session.',
    collectedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    rating: 5,
    feedback: 'Wonderful condition and delicious fresh berries!',
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
  }
]
