# FoodBridge AI – Smart Food Rescue & Redistribution Platform

> *"Save Food. Connect People. Fight Hunger."*  
> Demo-ready full-stack platform built for college hackathons. Enables judges to understand the solution in **30 seconds** and execute a complete surplus food redistribution cycle in **under 2 minutes**.

---

## ⚡ Quick Start (One Command)

FoodBridge AI runs with a single command with auto-seeding and zero API key requirements.

```bash
# 1. Clone or navigate to the project directory
cd foodbridge-ai

# 2. Install dependencies (installs full-stack packages in one shot)
npm install

# 3. Start both backend (port 5000) and frontend (port 5173) concurrently
npm run dev
```

Open your browser at: **`http://localhost:5173`**

---

## 🏗️ Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Port 5173)                            │
│  React 18 + Vite + TypeScript + Tailwind CSS + Framer Motion           │
│  Zustand (Global State & Auth) + React Router v6 + Lucide Icons        │
│  Recharts (Analytics) + Leaflet / OpenStreetMap (+ SVG Fallback)       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST API + SSE Stream
┌───────────────────────────────────▼────────────────────────────────────┐
│                         BACKEND (Port 5000)                            │
│  Node.js + Express + CORS + JWT Authentication                         │
│  SQLite (Zero-Config Persistent DB via node:sqlite / better-sqlite3)   │
│  SSE (Server-Sent Events) for Live Push Notifications & Sync           │
│  Smart Matching Engine (6-Factor Haversine Scoring Algorithm)          │
│  Auto-Seed & Instant Demo Reset Controller                             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 2-Minute Hackathon Demo Script (For Judges)

1. **Step 1: One-Click Donor Login**
   - Click the top persistent demo bar button: **`Donor Demo (Restaurant)`**.
   - You are authenticated as **Chef Marco Rossi – Bella Vista Restaurant**.
2. **Step 2: Create a Food Donation**
   - Click **`Post New Donation`** or **`⚡ QUICK DONATION`**.
   - Enter **15 kg** of Cooked Food (e.g. *Grand Buffet Rice, Dal & Vegetable Curry*).
   - Observe real-time yield calculation: **~35 Estimated Meals** ($15\text{ kg} \times 2.333 \approx 35$).
   - Check the mandatory food safety legal declaration checkbox.
   - Click **`POST FOOD DONATION`**.
3. **Step 3: View Smart Matching Algorithm Output**
   - The system immediately runs the 6-factor Haversine scoring algorithm.
   - Match results appear: e.g. **Green Hope NGO – 92% Match** with complete per-factor scoring breakdown (Distance, Intake Capacity, Speed, Diet Compatibility).
4. **Step 4: One-Click Volunteer Courier Switch**
   - In the top demo bar, click **`Volunteer Demo (Courier)`**.
   - You are now logged in as **Aarav Sharma** (verified courier, 420 pts, Food Champion badge).
   - See the active rescue assignment alert with pickup coordinates and donor contact.
5. **Step 5: Advance Status Lifecycle**
   - Click **`Confirm Food Picked Up`** (status updates to `Picked Up`).
   - Click **`Confirm Delivered to NGO`** (status updates to `Delivered`, courier earns **+10 pts**!).
6. **Step 6: NGO Distribution & Live Impact Update**
   - Switch to **`NGO Demo`** or view the **`Impact Dashboard`**.
   - Confirm distribution to shelter beneficiaries: Global stats immediately update by **+15 kg rescued** and **+35 meals served**.
   - Closing banner: *"One donation. Less waste. More meals."*

---

## ⚖️ Non-Negotiable Rules & Ethical Standards

1. **Honest Labeling**:
   - The matching engine is transparently labeled as a **"Smart Matching Algorithm"** (deterministic mathematical multi-factor scoring), not generative AI.
   - The assistive chatbot is labeled as **"Rule-Based Assistant"** with visible intent matching disclaimer.
2. **Food Safety Disclaimer**:
   - The platform never claims food is safe or conducts laboratory tests.
   - The donor must review and agree to:
     > *"Only donate food that is safe, properly stored, and suitable for consumption. The donor remains responsible for food safety."*
3. **Privacy Safeguards**:
   - Donor phone numbers are masked (`***-***-0101`) until a volunteer or NGO explicitly accepts the pickup.
4. **Fictional Data**:
   - All demo data uses fictional entities, 555-style phone numbers, and simulated coordinates.

---

## 📊 Real vs. Simulated Architecture Matrix

| Feature | Implementation Status | Technical Details |
|---|---|---|
| **Authentication & Demo Logins** | **Real** | JWT tokens, localStorage state, 1-click switcher |
| **Database & Persistence** | **Real** | SQLite persistent storage, foreign keys, WAL mode |
| **Servings Calculation** | **Real** | Category-weighted multipliers (15 kg cooked = 35 meals) |
| **Smart Matching Algorithm** | **Real** | 6-factor Haversine distance, capacity, diet fit |
| **Live Notifications & Sync** | **Real** | Server-Sent Events (SSE) streaming on `/api/events` |
| **Impact Analytics** | **Real** | Recalculated live on delivery into SQLite stats table |
| **Interactive Map & Hotspots** | **Hybrid / Fallback** | Leaflet + OpenStreetMap with offline-resilient SVG map fallback |
| **Chatbot Assistant** | **Deterministic Rule-Based** | Keyword & intent pattern matcher with form pre-fill |
| **SMS / Push Delivery** | **Simulated via In-App SSE** | Simulated via in-app SSE notification drawer (no Twilio key needed) |

---

## 🔄 Resetting Demo State

Judges or evaluators can click the **`Reset Demo Data`** button at the top right at any time to instantly restore the database to the fresh hackathon baseline (10 donors, 15 volunteers, 5 NGOs, 20 donations, 2,450 kg rescued baseline).
