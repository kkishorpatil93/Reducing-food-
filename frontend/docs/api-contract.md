# FoodSave AI – Frontend to Backend API Contract

> **Status:** PROPOSED & DRAFT  
> **Audience:** Frontend & Backend Engineering Teammates  
> **Frontend Lead:** Senior Frontend Engineer

This document outlines the planned HTTP REST API endpoints required by the frontend application.
All paths are centralized in `src/api/endpoints.js`. If any backend path changes, editing `endpoints.js` will immediately update the frontend.

---

## 1. Authentication & Session

### `POST /api/auth/register`
- **Description:** Registers a new user with their designated primary role.
- **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "SecurePassword123!",
    "role": "donor", // "donor" | "restaurant" | "ngo" | "receiver"
    "phone": "+1-555-0199",
    "organizationName": "Green Bistro" // Optional for individual donors
  }
  ```
- **Response Shape (201 Created):**
  ```json
  {
    "user": {
      "id": "usr_101",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "donor"
    },
    "token": "jwt_token_string" // Preferred: backend sets httpOnly cookie
  }
  ```

### `POST /api/auth/login`
- **Request Body:** `{ "email": "...", "password": "..." }`
- **Response Shape (200 OK):**
  ```json
  {
    "user": {
      "id": "usr_101",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "donor"
    },
    "token": "jwt_token_string"
  }
  ```

### `POST /api/auth/logout`
- **Description:** Invalidates session and clears httpOnly auth cookie.
- **Response:** `{ "message": "Successfully logged out" }`

### `GET /api/auth/me`
- **Description:** Retrieves the authenticated user's profile from the session/token.
- **Response Shape (200 OK):** `{ "user": { ... } }`

---

## 2. Food Listings

### `GET /api/foods`
- **Query Params:** `category`, `dietary`, `status`, `search`, `page`, `limit`, `sort`
- **Response Shape (200 OK):**
  ```json
  {
    "items": [
      {
        "id": "fd_001",
        "title": "Fresh Artisan Sourdough & Baguettes",
        "category": "Bakery",
        "quantity": 15,
        "unit": "loaves",
        "status": "Available", // "Available" | "Requested" | "Accepted" | "Collected" | "Expired" | "Cancelled"
        "pickupLocation": "14 Market St, Downtown",
        "availableFrom": "2026-10-26T18:00:00Z",
        "expiryTime": "2026-10-26T22:30:00Z",
        "dietaryTags": ["Vegetarian"],
        "allergens": ["Gluten"],
        "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff",
        "donor": {
          "id": "usr_101",
          "name": "Jane's Bakery",
          "rating": 4.9
        }
      }
    ],
    "total": 42,
    "page": 1,
    "totalPages": 5
  }
  ```

### `POST /api/foods` (Donor / Restaurant)
- **Request Body:** Food listing details (name, category, quantity, unit, location, times, tags, allergens, image)
- **Response:** Created food object with status `"Available"`.

### `GET /api/foods/:id`
- **Response:** Detailed food listing with donor contact/pickup instructions.

### `PATCH /api/foods/:id`
- **Response:** Updated food listing.

### `DELETE /api/foods/:id`
- **Response:** `{ "message": "Listing cancelled" }`

---

## 3. Collection Requests & Status Flow

### `POST /api/requests` (Receiver / NGO)
- **Request Body:** `{ "foodId": "fd_001", "notes": "Pickup by volunteer van at 7pm", "estimatedPickupTime": "..." }`
- **Response (201 Created):** Request object (status `"Requested"`).

### `GET /api/requests/my-requests` (Receiver / NGO)
- **Response:** List of requests made by the current user.

### `GET /api/requests/incoming` (Donor / Restaurant)
- **Response:** List of requests received for user's donations.

### `PATCH /api/requests/:id/accept` (Donor)
- **Response:** Request updated to `"Accepted"`. Food status updated to `"Accepted"`.

### `PATCH /api/requests/:id/reject` (Donor)
- **Response:** Request updated to `"Rejected"`.

### `PATCH /api/requests/:id/confirm-collection` (Receiver or Donor)
- **Response:** Status updated to `"Collected"`. Prompts feedback and updates platform impact metrics.

---

## 4. Platform Impact & Statistics

### `GET /api/stats/overview`
- **Response:**
  ```json
  {
    "mealsSaved": 14250,
    "kgFoodSaved": 6120,
    "co2AvoidedKg": 15300,
    "activeDonors": 310,
    "activeReceivers": 185
  }
  ```

---

## 5. Standard Error Format
All non-2xx responses adhere to this structure:
```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Expiry time must be at least 30 minutes in the future.",
    "details": [
      { "field": "expiryTime", "issue": "Invalid timestamp" }
    ]
  }
}
```
