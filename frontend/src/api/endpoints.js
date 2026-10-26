/**
 * FoodSave AI – Centralized API Endpoints
 * 
 * Synchronized with Teammate's Express + SQLite Backend on http://localhost:5000
 */

export const ENDPOINTS = {
  // Authentication & Profile
  AUTH: {
    LOGIN: '/api/auth/login',                // POST: Login with email/password
    DEMO_ROLE: (role) => `/api/auth/demo/${role}`, // POST: Instant login as role
    ME: '/api/auth/me',                      // GET: Get authenticated user profile
    REGISTER: '/api/auth/register',          // POST: Register
    LOGOUT: '/api/auth/logout',              // POST: Logout
  },

  // Food Donations / Listings
  FOODS: {
    LIST: '/api/donations',                  // GET: List all food donations
    DETAILS: (id) => `/api/donations/${id}`, // GET: Specific donation details
    CREATE: '/api/donations',                // POST: Create new donation
    CANCEL: (id) => `/api/donations/${id}/cancel`, // PATCH: Cancel listing
    STATUS: (id) => `/api/donations/${id}/status`, // PATCH: Update listing status
    MATCHES: (id) => `/api/donations/${id}/matches`, // GET: AI matched receivers
    MY_DONATIONS: '/api/donations',          // GET: Filtered by user
  },

  // Pickups & Collection Requests
  REQUESTS: {
    ACCEPT: '/api/pickups/accept',           // POST: Accept collection request { donation_id }
    UPDATE_STATUS: (id) => `/api/pickups/${id}/status`, // PATCH: Update pickup status
    SUBMIT_FEEDBACK: (id) => `/api/pickups/${id}/feedback`, // POST: Feedback & rating
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/api/notifications',              // GET: Notifications for current user
    MARK_READ: (id) => `/api/notifications/${id}/read`, // PATCH: Mark single notification read
  },

  // Statistics & Platform Impact (Used in Phase 10)
  STATS: {
    OVERVIEW: '/api/stats',                  // GET: Overview metrics, weekly & monthly trends
    HEATMAP: '/api/stats/heatmap',           // GET: Geographic distribution
    LEADERBOARD: '/api/leaderboard',         // GET: Top community donors
  },

  // Reports
  REPORTS: {
    SUBMIT: '/api/reports',                  // POST: Submit report
    LIST: '/api/reports',                    // GET: List reports
  }
}
