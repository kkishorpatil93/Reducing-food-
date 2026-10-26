/**
 * FoodSave AI – Centralized API Endpoints
 * 
 * IMPORTANT:
 * All backend API paths are defined here. Every endpoint is marked as PROPOSED.
 * If the backend teammate changes any route naming or URL structure, update it HERE ONLY.
 * Do not hardcode raw path strings anywhere inside React components.
 */

export const ENDPOINTS = {
  // Authentication & Profile (PROPOSED)
  AUTH: {
    REGISTER: '/api/auth/register',          // POST: Register user with role
    LOGIN: '/api/auth/login',                // POST: Login with email/password
    LOGOUT: '/api/auth/logout',              // POST: Invalidate session / clear httpOnly cookie
    ME: '/api/auth/me',                      // GET: Get current authenticated user profile
    REFRESH: '/api/auth/refresh',            // POST: Refresh access token
  },

  // Food Listings (PROPOSED)
  FOODS: {
    LIST: '/api/foods',                      // GET: Browse food with filters & pagination
    DETAILS: (id) => `/api/foods/${id}`,     // GET: Specific food details
    CREATE: '/api/foods',                    // POST: Donor creates listing
    UPDATE: (id) => `/api/foods/${id}`,     // PATCH: Donor updates listing
    DELETE: (id) => `/api/foods/${id}`,     // DELETE: Donor cancels listing
    MY_DONATIONS: '/api/foods/my-donations', // GET: Donor's own food history
  },

  // Collection Requests (PROPOSED)
  REQUESTS: {
    CREATE: '/api/requests',                          // POST: Receiver creates collection request
    MY_REQUESTS: '/api/requests/my-requests',         // GET: Receiver's collection requests
    INCOMING: '/api/requests/incoming',               // GET: Donor's incoming pickup requests
    ACCEPT: (id) => `/api/requests/${id}/accept`,     // PATCH: Donor accepts request
    REJECT: (id) => `/api/requests/${id}/reject`,     // PATCH: Donor rejects request
    CONFIRM_COLLECTION: (id) => `/api/requests/${id}/confirm-collection`, // PATCH: Mark as collected
    SUBMIT_FEEDBACK: (id) => `/api/requests/${id}/feedback`, // POST: Feedback & rating
  },

  // Notifications (PROPOSED)
  NOTIFICATIONS: {
    LIST: '/api/notifications',                       // GET: Notifications for current user
    MARK_READ: (id) => `/api/notifications/${id}/read`, // PATCH: Mark single notification read
    MARK_ALL_READ: '/api/notifications/mark-all-read', // POST: Mark all notifications read
  },

  // Statistics & Impact Metrics (PROPOSED)
  STATS: {
    OVERVIEW: '/api/stats/overview',                  // GET: Platform-wide counters (meals, kg, CO2)
    HISTORY: '/api/stats/history',                    // GET: Time-series graph data
    USER_IMPACT: (userId) => `/api/stats/user/${userId}`, // GET: Individual user or donor impact
  },

  // Admin Moderation (PROPOSED)
  ADMIN: {
    USERS: '/api/admin/users',                        // GET: List users with role filter & search
    BLOCK_USER: (id) => `/api/admin/users/${id}/block`, // PATCH: Block or unblock user
    LISTINGS: '/api/admin/listings',                  // GET: Moderate listings
    MODERATE_LISTING: (id) => `/api/admin/listings/${id}/status`, // PATCH: Remove or approve listing
    REPORTS: '/api/admin/reports',                    // GET: User report queue
    RESOLVE_REPORT: (id) => `/api/admin/reports/${id}/resolve`, // PATCH: Resolve reported issue
  }
}
