/**
 * Development Mock Notifications
 * ONLY active when VITE_USE_MOCKS=true
 */

const now = Date.now()
const minsAgo = (m) => new Date(now - m * 60 * 1000).toISOString()
const hoursAgo = (h) => new Date(now - h * 3600 * 1000).toISOString()

export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif_001',
    type: 'request',
    title: 'New Collection Request Received',
    message: 'Food For All Community Care requested to collect "Organic Apples & Pears Crate (30 kg)".',
    read: false,
    timestamp: minsAgo(15),
    link: '/donor/donations',
    actionText: 'Review Request',
  },
  {
    id: 'notif_002',
    type: 'urgency',
    title: 'Urgent Expiration Warning (< 2 Hours)',
    message: '"Artisan Sourdough & Baguettes" will expire in 1 hour and 15 minutes. Pickups should happen promptly.',
    read: false,
    timestamp: minsAgo(45),
    link: '/foods/food_001',
    actionText: 'View Listing',
  },
  {
    id: 'notif_003',
    type: 'status',
    title: 'Collection Request Accepted!',
    message: 'Green Bakery & Cafe accepted your collection window for "Gourmet Pasta Salad (18 portions)".',
    read: false,
    timestamp: hoursAgo(2),
    link: '/receiver/requests',
    actionText: 'View Pickup Details',
  },
  {
    id: 'notif_004',
    type: 'impact',
    title: 'Handover Completed & Verified',
    message: 'Great news! "Fresh Greek Yogurt & Oat Parfaits" was collected. You helped save 20 meals!',
    read: true,
    timestamp: hoursAgo(5),
    link: '/donor/donations',
    actionText: 'View Receipt',
  },
  {
    id: 'notif_005',
    type: 'system',
    title: 'Community Food Safety Guidelines Updated',
    message: 'Our cold-chain and holding guidelines have been updated in accordance with the Good Samaritan Act.',
    read: true,
    timestamp: hoursAgo(24),
    link: '/',
    actionText: 'Read Guidelines',
  },
]
