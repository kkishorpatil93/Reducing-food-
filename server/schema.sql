-- ============================================================================
-- FoodSave AI — Database Schema
-- Database Engine: SQLite (Compatible with PostgreSQL with minimal adjustments)
-- Description: Core tables for users, food donations, pickups, NGOs, and metrics.
-- ============================================================================

-- Enable foreign keys to enforce relational integrity
PRAGMA foreign_keys = ON;

-- ----------------------------------------------------------------------------
-- 1. USERS TABLE
-- Stores credentials and profiles for all user roles:
-- 'donor', 'volunteer', 'ngo', and 'admin'.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,                          -- Unique identifier (e.g., 'user-donor-demo')
  name TEXT NOT NULL,                           -- Full name or contact name
  email TEXT UNIQUE NOT NULL,                   -- Login email address
  password TEXT NOT NULL,                       -- Hashed password string
  role TEXT NOT NULL,                           -- 'donor', 'volunteer', 'ngo', or 'admin'
  phone TEXT NOT NULL,                          -- Contact phone number
  lat REAL NOT NULL,                            -- Latitude for geolocation
  lng REAL NOT NULL,                            -- Longitude for geolocation
  address TEXT NOT NULL,                        -- Street address / pickup location
  verified INTEGER DEFAULT 1,                   -- 1 = verified, 0 = pending verification
  availability INTEGER DEFAULT 1,               -- 1 = available for rescues, 0 = offline
  max_distance_km REAL DEFAULT 15.0,            -- Maximum delivery/service radius in km
  points INTEGER DEFAULT 0,                     -- Gamification score for volunteers & donors
  badge TEXT DEFAULT 'Food Saver',              -- Gamification badge title
  organization_name TEXT,                       -- Business, restaurant, or NGO name
  avatar_url TEXT                               -- Profile photo link
);

-- ----------------------------------------------------------------------------
-- 2. NGOS TABLE
-- Stores non-profit organization details, capacity, and dietary preferences.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ngos (
  id TEXT PRIMARY KEY,                          -- Unique NGO identifier
  user_id TEXT,                                 -- Linked user account (if any)
  name TEXT NOT NULL,                           -- Organization name
  lat REAL NOT NULL,                            -- Latitude for dispatch matching
  lng REAL NOT NULL,                            -- Longitude for dispatch matching
  address TEXT NOT NULL,                        -- Physical distribution center address
  capacity_servings INTEGER DEFAULT 250,        -- Maximum meal servings NGO can store/distribute
  current_servings INTEGER DEFAULT 0,           -- Currently stored servings
  diet_preference TEXT DEFAULT 'any',           -- 'veg', 'non-veg', or 'any'
  accepted_categories TEXT DEFAULT '["cooked","bakery","raw_produce","packaged"]', -- JSON list of categories
  verified INTEGER DEFAULT 1,                   -- Verification status
  phone TEXT NOT NULL,                          -- Contact phone number
  contact_person TEXT NOT NULL,                 -- Coordinator name
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------------------
-- 3. DONATIONS TABLE
-- Stores surplus food listings created by donors (restaurants, caterers, etc.).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS donations (
  id TEXT PRIMARY KEY,                          -- Unique donation listing identifier
  donor_id TEXT NOT NULL,                       -- The user ID of the donor
  food_name TEXT NOT NULL,                      -- Name/description of surplus food
  category TEXT NOT NULL,                       -- 'cooked', 'bakery', 'raw_produce', 'packaged', 'dairy'
  diet TEXT NOT NULL,                           -- 'veg', 'non-veg', 'vegan'
  qty_kg REAL NOT NULL,                         -- Quantity in kilograms
  servings INTEGER NOT NULL,                    -- Estimated human meal servings
  image_url TEXT,                               -- Photo URL of the food item
  prepared_at TEXT NOT NULL,                    -- Timestamp when food was prepared (ISO 8601)
  storage TEXT DEFAULT 'ambient',               -- 'ambient', 'refrigerated', 'frozen'
  refrigerated INTEGER DEFAULT 0,               -- 1 = requires cold chain, 0 = standard
  consume_by TEXT NOT NULL,                     -- Best before timestamp
  packaging_intact INTEGER DEFAULT 1,           -- Food safety check (1 = yes)
  safety_acknowledged INTEGER NOT NULL,         -- Mandatory donor safety declaration (1 = accepted)
  pickup_address TEXT NOT NULL,                 -- Full pickup address
  landmark TEXT,                                -- Optional pickup instructions / landmark
  lat REAL NOT NULL,                            -- Pickup latitude
  lng REAL NOT NULL,                            -- Pickup longitude
  available_from TEXT NOT NULL,                 -- Ready for pickup time
  available_until TEXT NOT NULL,                -- Expiry/deadline for pickup
  contact TEXT NOT NULL,                        -- Donor contact number
  instructions TEXT,                            -- Special handling notes for couriers
  status TEXT DEFAULT 'Created',                -- 'Created', 'Matched', 'Picked Up', 'Delivered', 'Cancelled'
  urgency TEXT DEFAULT 'medium',                -- 'low', 'medium', 'high', 'critical'
  created_at TEXT NOT NULL,                     -- Record creation timestamp
  FOREIGN KEY(donor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 4. PICKUPS TABLE
-- Tracks the lifecycle of food collection from donor to NGO distribution.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pickups (
  id TEXT PRIMARY KEY,                          -- Unique pickup request identifier
  donation_id TEXT NOT NULL,                    -- Linked food donation
  volunteer_id TEXT,                            -- Assigned volunteer courier
  ngo_id TEXT,                                  -- Destination NGO receiving the food
  accepted_at TEXT,                             -- Timestamp courier accepted the pickup
  picked_up_at TEXT,                            -- Timestamp food was picked up from donor
  delivered_at TEXT,                            -- Timestamp food arrived at the NGO
  distributed_at TEXT,                          -- Timestamp food was distributed to people
  status TEXT NOT NULL,                         -- 'Assigned', 'In Transit', 'Delivered', 'Completed'
  notes TEXT,                                   -- Delivery confirmation or delivery notes
  FOREIGN KEY(donation_id) REFERENCES donations(id) ON DELETE CASCADE,
  FOREIGN KEY(volunteer_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY(ngo_id) REFERENCES ngos(id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------------------
-- 5. NOTIFICATIONS TABLE
-- Real-time and push alerts for users regarding donation and pickup updates.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,                          -- Unique notification identifier
  recipient_id TEXT NOT NULL,                   -- Target user ID receiving the alert
  message TEXT NOT NULL,                        -- Notification message text
  type TEXT DEFAULT 'info',                     -- 'info', 'success', 'warning', 'urgent'
  link TEXT,                                    -- URL/route to open on click
  read INTEGER DEFAULT 0,                       -- 0 = unread, 1 = read
  created_at TEXT NOT NULL,                     -- Sent timestamp
  FOREIGN KEY(recipient_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 6. REPORTS TABLE
-- Allows volunteers and NGOs to flag damaged food, safety issues, or no-shows.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,                          -- Unique report identifier
  reporter_id TEXT NOT NULL,                    -- User who submitted the report
  donation_id TEXT,                             -- Related food listing (optional)
  reason TEXT NOT NULL,                         -- Reason for flagging
  status TEXT DEFAULT 'pending',                -- 'pending', 'reviewed', 'resolved'
  created_at TEXT NOT NULL,                     -- Submission timestamp
  FOREIGN KEY(reporter_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(donation_id) REFERENCES donations(id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------------------
-- 7. IMPACT_STATS TABLE
-- Singleton table (single row with id=1) caching overall environmental impact.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS impact_stats (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  total_kg_rescued REAL DEFAULT 2450.0,         -- Total kilograms of food saved
  total_meals_served INTEGER DEFAULT 8700,      -- Number of human meals provided
  total_pickups INTEGER DEFAULT 624,            -- Completed rescue deliveries
  total_volunteers INTEGER DEFAULT 183,         -- Registered active volunteers
  total_ngos INTEGER DEFAULT 37,                -- Registered receiving charities
  waste_reduced_tonnes REAL DEFAULT 2.45        -- Metric tonnes of CO2/waste diverted
);

-- ----------------------------------------------------------------------------
-- 8. AI_PREDICTIONS TABLE (AI Waste Reduction & Spoilage Forecasts)
-- Stores AI predictions for food freshness, remaining shelf-life, and waste risk.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_predictions (
  id TEXT PRIMARY KEY,                          -- Prediction record identifier (e.g., 'pred-101')
  donation_id TEXT,                             -- Linked food donation (nullable for pre-checks)
  food_category TEXT NOT NULL,                  -- 'cooked', 'bakery', 'dairy', 'raw_produce', etc.
  storage_condition TEXT NOT NULL,              -- 'ambient', 'refrigerated', 'frozen'
  predicted_shelf_life_hours REAL NOT NULL,     -- Hours remaining before spoilage risk > 50%
  spoilage_risk_score REAL NOT NULL,            -- Spoilage probability score (0.00 to 1.00)
  risk_level TEXT NOT NULL,                     -- 'low', 'moderate', 'high', 'critical'
  recommended_action TEXT NOT NULL,             -- Recommended operational action
  co2_diverted_kg REAL NOT NULL,                -- Carbon emissions avoided if rescued (kg)
  confidence_score REAL DEFAULT 0.90,           -- Model confidence level (0.00 to 1.00)
  created_at TEXT NOT NULL,                     -- Timestamp prediction was generated
  FOREIGN KEY(donation_id) REFERENCES donations(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- INDEXES FOR FAST QUERY PERFORMANCE
-- Speeds up common searches by status, foreign keys, and recipient.
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_pickups_donation_id ON pickups(donation_id);
CREATE INDEX IF NOT EXISTS idx_pickups_volunteer_id ON pickups(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_pickups_ngo_id ON pickups(ngo_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id, read);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_donation ON ai_predictions(donation_id);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_risk ON ai_predictions(risk_level);
