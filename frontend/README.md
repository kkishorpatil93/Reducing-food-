# 🌱 FoodSave AI – Food Waste Reduction Platform (Frontend)

> **"Rescue Surplus Food • Nourish Communities • Eliminate Waste"**  
> An accessible, responsive web application connecting restaurants, grocers, food producers, NGOs, and community shelters to rescue wholesome edible surplus food before it is wasted.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **React 19** | Component-driven UI architecture |
| **Build Tool** | **Vite** | Sub-second HMR & optimized production bundling |
| **Styling** | **Tailwind CSS 3.4** | Accessible design system with custom brand tokens |
| **Routing** | **React Router 7** | Client-side routing with `ProtectedRoute` & `RoleRoute` |
| **HTTP Client** | **Axios** | Centralized interceptors, 401/403 handlers, cookie support |
| **Charts** | **Recharts** | Interactive SVG food rescue area & donut charts |
| **Icons** | **Lucide-react** | Lightweight accessible iconography |

---

## 🎨 Design System

- **Palette:**
  - Primary Green: `#16A34A` (Growth, Hope, Sustainability)
  - Warm Orange Accent: `#F97316` (Urgency, Energy)
  - Cream Canvas: `#FFFBF2` (Warm, Inviting)
  - Dark Charcoal: `#1F2937` (High Contrast AA)
- **Typography:**
  - Headings: `Poppins`
  - Body: `Inter`
- **Dark Mode:** User preference persisted in `localStorage`.
- **Accessibility:** WCAG AA compliant contrast, ARIA dialog roles, focus rings, and `prefers-reduced-motion` support.

---

## 📂 Project Architecture

```text
frontend/
├── docs/
│   └── api-contract.md       # Complete HTTP REST blueprint for backend teammates
├── public/
├── src/
│   ├── api/                  # Centralized HTTP Client & Endpoints
│   │   ├── apiClient.js      # Axios instance, baseURL, global 401/403 interceptors
│   │   ├── endpoints.js      # Single source of truth for all backend URL paths
│   │   ├── authService.js    # Register, login, session validation
│   │   ├── foodService.js    # Food listings, filtering, search, add donation
│   │   ├── requestService.js # Lifecycle transitions (Request -> Accept -> Collect)
│   │   ├── statsService.js   # Live impact counters & chart time-series
│   │   ├── adminService.js   # User governance, listing moderation, reports
│   │   └── notificationService.js
│   ├── components/
│   │   ├── ui/               # Reusable Primitives
│   │   │   ├── Button.jsx    # Primary, secondary, outline, danger, ghost, loading
│   │   │   ├── Card.jsx      # Rounded-2xl, soft shadows, hover lift
│   │   │   ├── Input.jsx     # Labels, error states, password reveal toggle
│   │   │   ├── Modal.jsx     # Accessible dialog with Esc listener & backdrop blur
│   │   │   ├── Badge.jsx     # Color badges for all 7 food lifecycle statuses
│   │   │   ├── UrgencyBadge.jsx # Animated clock for items expiring < 2 hours
│   │   │   ├── Skeleton.jsx  # Shimmer placeholder loaders
│   │   │   ├── EmptyState.jsx# Friendly placeholders with action CTAs
│   │   │   ├── ErrorMessage.jsx # Alert boxes with retry triggers
│   │   │   ├── ReceiptModal.jsx # Printable official donation certificate
│   │   │   ├── FeedbackModal.jsx# 5-star rating & review modal
│   │   │   ├── ImpactBadges.jsx # Donor & receiver community achievements
│   │   │   ├── DemoBanner.jsx# Visible when VITE_USE_MOCKS=true
│   │   │   └── OfflineBanner.jsx# Automatic "no internet" warning
│   │   └── layout/
│   │       ├── Navbar.jsx    # Glassmorphism, unread count pill, theme switch
│   │       ├── Sidebar.jsx   # Role-adapted dashboard navigation
│   │       └── Footer.jsx    # Mission, legal disclaimers, impact summary
│   ├── context/
│   │   ├── AuthContext.jsx   # In-memory authentication state (zero XSS risk)
│   │   ├── ThemeContext.jsx  # Dark/Light mode manager
│   │   ├── ToastContext.jsx  # Accessible screen-reader toasts (aria-live)
│   │   └── NotificationContext.jsx # Real-time unread alerts
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useFavorites.js   # Local storage listing bookmarks
│   │   ├── useFetch.js       # Generalized async loader
│   │   ├── useNotifications.js
│   │   └── useOnlineStatus.js# Network online/offline listener
│   ├── mocks/                # Development sample data ONLY
│   ├── pages/
│   │   ├── public/           # Home, Browse Food, Food Details, Notifications, Stats, 403
│   │   ├── auth/             # Login, Multi-Role Register, Forgot Password
│   │   ├── dashboard/        # Role Overview Dashboard
│   │   ├── donor/            # Add Food (with compression), My Donations
│   │   ├── receiver/         # My Requests, Collection Confirmation
│   │   └── admin/            # Moderation Suite, User Suspension, Reports
│   ├── routes/
│   │   ├── AppRoutes.jsx     # Route configurations & 404 handler
│   │   ├── ProtectedRoute.jsx# Redirects unauthenticated visitors to /login
│   │   └── RoleRoute.jsx     # Strict role authorization guard
│   ├── utils/
│   │   ├── imageCompress.js  # Client-side 5 MB check & HTML5 Canvas compression
│   │   ├── validators.js     # Email, password, and future timestamp checks
│   │   └── i18nText.js       # Centralized text catalog ready for multi-language
│   └── styles/
│       └── index.css         # Tailwind base styles, glassmorphism, motion rules
├── .env.example
├── .env
├── package.json
└── tailwind.config.js
```

---

## 🚦 Food Status Flow

Every listing transitions through a standardized status flow reflected by semantic color badges:

$$\text{Available} \xrightarrow{\text{Receiver Claims}} \text{Requested} \xrightarrow{\text{Donor Accepts}} \text{Accepted} \xrightarrow{\text{Handover}} \text{Collected}$$

- **Available:** Fresh surplus listed, open for community requests.
- **Requested:** An NGO or volunteer has requested a pickup window.
- **Accepted:** The donor approved the collection window.
- **Collected:** Food physically handed over. Automatically updates impact metrics and generates printable tax receipts.
- **Also Handled:** `Expired` (past safe consumption time), `Cancelled` (withdrawn by donor), `Rejected` (declined request).

---

## 🚀 Running the Project

### Prerequisites
- Node.js v20+ or v22 LTS

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
Create `.env` (or copy from `.env.example`):
```env
# Point to your teammate's backend, or leave empty if using mock data
VITE_API_BASE_URL=http://localhost:5000

# Set to "false" to use live backend, or "true" to use local mock data
VITE_USE_MOCKS=false
```

### 3. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173`.

### 4. Production Build Verification
```bash
npm run build
```

---

## 👥 Demo Test Accounts

When testing authentication, the login screen includes **fast one-click login buttons** for every user role:

| Role | Email | Password | Allowed Access |
| :--- | :--- | :--- | :--- |
| **Restaurant** | `donor@greenbakery.com` | `Password123!` | Add Food, My Donations, Dashboard |
| **Farm Donor** | `farm@sunrise.com` | `Password123!` | Add Food, My Donations, Dashboard |
| **Community NGO** | `ngo@foodforall.org` | `Password123!` | Browse Food, My Requests, Dashboard |
| **Receiver** | `receiver@cityyouth.org` | `Password123!` | Browse Food, My Requests, Dashboard |
| **Administrator** | `admin@foodsave.ai` | `Password123!` | Full Admin Moderation, Reports, Users |

---

## 🔒 Security Best Practices

1. **Tokens in Memory:** Auth tokens are held strictly in application memory (never in `localStorage`) to prevent XSS credential theft.
2. **httpOnly Cookie Ready:** The Axios client enables `withCredentials: true`, supporting secure backend session cookies.
3. **Double Route Protection:** Client-side `ProtectedRoute` and `RoleRoute` provide clean UX, while acknowledging that the backend remains the ultimate security authority.
4. **Zero Secrets in Frontend:** No secret keys or database credentials exist in frontend code.
