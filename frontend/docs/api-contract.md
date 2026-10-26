# FoodSave AI – Frontend to Backend API Contract

> **Version:** 1.0.0 (Phase 3 Complete)  
> **Status:** PROPOSED & DRAFT  
> **Audience:** Frontend, Backend, AI, and QA Engineering Teammates  
> **Frontend Lead:** Senior Frontend Engineer  
> **Base URL:** Defined via `VITE_API_BASE_URL` in `.env`.

This contract provides the comprehensive blueprint of all REST HTTP endpoints required by the frontend application.
All paths are strictly centralized in `src/api/endpoints.js`. **If any backend path or naming changes, update `endpoints.js` only.**

---

## Architecture Principles
1. **Zero Hardcoded Paths in Components:** React components invoke feature services (`authService.js`, `foodService.js`, `requestService.js`, `statsService.js`), which use `endpoints.js`.
2. **Mock Mode Isolation:** Development sample data exists ONLY in `src/mocks/` and is strictly activated via `VITE_USE_MOCKS=true`.
3. **Session & Security:**
   - Prefer **httpOnly, Secure, SameSite=Lax/Strict cookies** set by backend on login/register.
   - If Bearer tokens are returned, the frontend retains them **strictly in memory** (never in `localStorage` to avoid XSS theft).
   - Global 401 interceptor automatically dispatches session termination and login redirection.
   - Global 403 interceptor displays permission denial.

---

## 1. Authentication & Profile Endpoints

### `POST /api/auth/register`
- **Method:** `POST`
- **Path:** `/api/auth/register`
- **Description:** Registers a new user account with their designated platform role.
- **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "SecurePassword123!",
    "role": "donor", // "donor" | "restaurant" | "ngo" | "receiver"
    "phone": "+1 (555) 019-9000",
    "organizationName": "Green Bistro LLC"
  }
  ```
- **Response Shape (201 Created):**
  ```json
  {
    "user": {
      "id": "usr_101",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "donor",
      "phone": "+1 (555) 019-9000",
      "organizationName": "Green Bistro LLC",
      "joinedDate": "2026-10-26T20:00:00Z"
    },
    "token": "optional_jwt_token_string"
  }
  ```

### `POST /api/auth/login`
- **Method:** `POST`
- **Path:** `/api/auth/login`
- **Request Body:**
  ```json
  {
    "email": "donor@greenbakery.com",
    "password": "Password123!"
  }
  ```
- **Response Shape (200 OK):**
  ```json
  {
    "user": {
      "id": "usr_donor_1",
      "name": "Green Bakery & Cafe",
      "email": "donor@greenbakery.com",
      "role": "restaurant"
    },
    "token": "jwt_token_string"
  }
  ```

### `POST /api/auth/logout`
- **Method:** `POST`
- **Path:** `/api/auth/logout`
- **Description:** Clears session / removes auth cookie.
- **Response Shape (200 OK):** `{ "success": true, "message": "Logged out successfully" }`

### `GET /api/auth/me`
- **Method:** `GET`
- **Path:** `/api/auth/me`
- **Description:** Returns the currently authenticated user based on session cookie or Authorization header.
- **Response Shape (200 OK):** `{ "user": { ... } }`

---

## 2. Food Listings Endpoints

### `GET /api/foods`
- **Method:** `GET`
- **Path:** `/api/foods`
- **Query Parameters:**
  - `category`: e.g. `"Bakery"`, `"Prepared Meals"`, `"Produce"`, `"Dairy"`, `"Pantry"`
  - `status`: e.g. `"Available"`, `"Requested"`, `"Accepted"`, `"Collected"`, `"Expired"`, `"Cancelled"`, `"Rejected"`
  - `dietary`: e.g. `"Vegetarian"`, `"Vegan"`, `"Halal"`, `"Gluten-Free"`
  - `search`: string search across title, description, pickupLocation
  - `page`: integer (default 1)
  - `limit`: integer (default 9)
  - `sort`: `"expiry_asc"`, `"created_desc"`
- **Response Shape (200 OK):**
  ```json
  {
    "items": [
      {
        "id": "food_001",
        "title": "Artisan Sourdough & Baguettes",
        "category": "Bakery",
        "quantity": 12,
        "unit": "loaves",
        "status": "Available",
        "pickupLocation": "42 Baker Street, Downtown",
        "availableFrom": "2026-10-26T18:00:00Z",
        "expiryTime": "2026-10-26T21:30:00Z",
        "description": "Stone hearth baked sourdough without additives.",
        "dietaryTags": ["Vegetarian", "Vegan"],
        "allergens": ["Gluten"],
        "imageUrl": "https://images.unsplash.com/...",
        "donor": {
          "id": "usr_donor_1",
          "name": "Green Bakery & Cafe",
          "role": "restaurant",
          "rating": 4.9
        },
        "createdAt": "2026-10-26T17:00:00Z"
      }
    ],
    "total": 42,
    "page": 1,
    "totalPages": 5,
    "limit": 9
  }
  ```

### `GET /api/foods/:id`
- **Method:** `GET`
- **Path:** `/api/foods/:id`
- **Response Shape (200 OK):** Single food listing object with donor phone and pickup instructions.

### `POST /api/foods` (Donor / Restaurant role required)
- **Method:** `POST`
- **Path:** `/api/foods`
- **Request Body:**
  ```json
  {
    "title": "Vegetable Curry",
    "category": "Prepared Meals",
    "quantity": 20,
    "unit": "boxes",
    "pickupLocation": "84 Spice Route",
    "availableFrom": "2026-10-26T19:00:00Z",
    "expiryTime": "2026-10-26T23:00:00Z",
    "description": "Hot lentil curry kept in warm containers.",
    "dietaryTags": ["Vegetarian", "Vegan", "Halal"],
    "allergens": [],
    "imageUrl": "data:image/webp;base64,..."
  }
  ```
- **Validation Rules:**
  - `title`: required, 3-100 characters.
  - `expiryTime`: required, must be after `availableFrom` and in the future.
  - `imageUrl`: JPG/PNG/WebP, max 5 MB compressed.
- **Response Shape (201 Created):** Newly created food listing with status `"Available"`.

### `PATCH /api/foods/:id`
- **Method:** `PATCH`
- **Path:** `/api/foods/:id`
- **Description:** Updates listing details (quantity, expiry, pickup instructions).
- **Response Shape (200 OK):** Updated food listing.

### `DELETE /api/foods/:id`
- **Method:** `DELETE`
- **Path:** `/api/foods/:id`
- **Description:** Cancels the donation listing (sets status to `"Cancelled"`).
- **Response Shape (200 OK):** `{ "success": true, "message": "Listing cancelled" }`

### `GET /api/foods/my-donations`
- **Method:** `GET`
- **Path:** `/api/foods/my-donations`
- **Description:** Lists all food donations created by the currently authenticated donor.

---

## 3. Collection Requests & Status Flow Endpoints

### `POST /api/requests` (Receiver / NGO role)
- **Method:** `POST`
- **Path:** `/api/requests`
- **Request Body:**
  ```json
  {
    "foodId": "food_001",
    "notes": "Van arrives at 7:30 PM with cold storage bags.",
    "estimatedPickupTime": "2026-10-26T19:30:00Z"
  }
  ```
- **Response Shape (201 Created):**
  ```json
  {
    "id": "req_101",
    "foodId": "food_001",
    "receiver": {
      "id": "usr_ngo_1",
      "name": "Food For All Community Care"
    },
    "status": "Requested",
    "notes": "Van arrives at 7:30 PM...",
    "estimatedPickupTime": "2026-10-26T19:30:00Z",
    "createdAt": "2026-10-26T18:15:00Z"
  }
  ```

### `GET /api/requests/my-requests` (Receiver / NGO role)
- **Method:** `GET`
- **Path:** `/api/requests/my-requests`
- **Response Shape (200 OK):** Array of request objects submitted by the current receiver.

### `GET /api/requests/incoming` (Donor / Restaurant role)
- **Method:** `GET`
- **Path:** `/api/requests/incoming`
- **Response Shape (200 OK):** Array of pending and past collection requests for donor's food items.

### `PATCH /api/requests/:id/accept`
- **Method:** `PATCH`
- **Path:** `/api/requests/:id/accept`
- **Description:** Donor accepts request. Transitions request and food status to `"Accepted"`.

### `PATCH /api/requests/:id/reject`
- **Method:** `PATCH`
- **Path:** `/api/requests/:id/reject`
- **Description:** Donor rejects request. Transitions status to `"Rejected"`.

### `PATCH /api/requests/:id/confirm-collection`
- **Method:** `PATCH`
- **Path:** `/api/requests/:id/confirm-collection`
- **Description:** Receiver or Donor confirms food was physically handed over. Transitions status to `"Collected"`. Increments platform impact metrics.

### `POST /api/requests/:id/feedback`
- **Method:** `POST`
- **Path:** `/api/requests/:id/feedback`
- **Request Body:** `{ "rating": 5, "feedback": "Food was fresh and packaged neatly!" }`

---

## 4. Platform Statistics & Impact Endpoints

### `GET /api/stats/overview`
- **Method:** `GET`
- **Path:** `/api/stats/overview`
- **Response Shape (200 OK):**
  ```json
  {
    "mealsSaved": 14250,
    "kgFoodSaved": 6120,
    "co2AvoidedKg": 15300,
    "activeDonors": 310,
    "activeReceivers": 185,
    "partnerRestaurants": 142,
    "citiesActive": 8
  }
  ```

### `GET /api/stats/history`
- **Method:** `GET`
- **Path:** `/api/stats/history`
- **Response Shape (200 OK):** Array of monthly trend objects: `[{ "month": "Oct", "meals": 2600, "kg": 1150, "co2": 2840 }]`.

---

## 5. Standard Error Envelopes

Every non-2xx HTTP response from the backend should adhere to this standardized JSON format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The expiry time must be at least 30 minutes in the future.",
    "details": [
      {
        "field": "expiryTime",
        "issue": "Timestamp must be greater than current time"
      }
    ]
  }
}
```

### Standard Error Status Codes:
- `400 Bad Request`: Validation failure (`VALIDATION_ERROR`).
- `401 Unauthorized`: Session expired or missing credentials (`UNAUTHORIZED`). Handled globally by frontend interceptor.
- `403 Forbidden`: Authenticated user lacks permission (`FORBIDDEN`).
- `404 Not Found`: Resource does not exist (`NOT_FOUND`).
- `409 Conflict`: Resource already exists, e.g. email registered (`CONFLICT`).
- `500 Internal Server Error`: Backend error (`SERVER_ERROR`).
