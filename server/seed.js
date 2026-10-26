import { db, initDatabase, calculateServings, calculateUrgency } from './db.js';

export function seedDatabase() {
  initDatabase();

  // Clear existing records to ensure fresh demo state
  db.exec('DELETE FROM reports;');
  db.exec('DELETE FROM notifications;');
  db.exec('DELETE FROM pickups;');
  db.exec('DELETE FROM donations;');
  db.exec('DELETE FROM ngos;');
  db.exec('DELETE FROM users;');

  console.log('🌱 Seeding FoodBridge AI database with fictional demo data...');

  // 1. Users (10 Donors, 15 Volunteers, 5 NGO Representatives, 1 Admin)
  const usersStmt = db.prepare(`
    INSERT INTO users (id, name, email, password, role, phone, lat, lng, address, verified, availability, max_distance_km, points, badge, organization_name, avatar_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Demo Key Users
  const keyUsers = [
    ['user-donor-demo', 'Chef Marco Rossi', 'donor@foodbridge.demo', 'password123', 'donor', '+1-555-0101', 12.9716, 77.5946, '142 Riverside Ave, Central District', 1, 1, 10, 85, 'Food Saver', 'Bella Vista Restaurant', 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80'],
    ['user-volunteer-demo', 'Aarav Sharma', 'volunteer@foodbridge.demo', 'password123', 'volunteer', '+1-555-0155', 12.9780, 77.5990, 'Flat 4B, Metro Heights, North Wing', 1, 1, 15, 420, 'Food Champion', 'City Rapid Couriers', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'],
    ['user-ngo-demo', 'Sister Teresa Care Coordinator', 'ngo@foodbridge.demo', 'password123', 'ngo', '+1-555-0188', 12.9650, 77.5890, '77 Compassion Road, Shelter District', 1, 1, 20, 920, 'FoodBridge Legend', 'Green Hope Foundation', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'],
    ['user-admin-demo', 'Priya Nair', 'admin@foodbridge.demo', 'password123', 'admin', '+1-555-0199', 12.9750, 77.5900, 'Operations Command, Tech Zone', 1, 1, 50, 1500, 'FoodBridge Legend', 'FoodBridge Operations', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'],
  ];

  keyUsers.forEach(u => usersStmt.run(...u));

  // Additional 9 Donors
  const additionalDonors = [
    ['user-donor-2', 'Elena Rostova', 'elena@sweetbakery.demo', 'password123', 'donor', '+1-555-0102', 12.9730, 77.6010, '88 Baker St, Market Square', 1, 1, 10, 60, 'Food Saver', 'Artisan Sweet Bakery', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'],
    ['user-donor-3', 'Vikram Mehra', 'vikram@spicetree.demo', 'password123', 'donor', '+1-555-0103', 12.9680, 77.5910, '12 Curry Lane, Spice Plaza', 1, 1, 10, 110, 'Community Hero', 'Spice Tree Caterers', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'],
    ['user-donor-4', 'Sarah Jenkins', 'sarah@grandpalace.demo', 'password123', 'donor', '+1-555-0104', 12.9820, 77.5880, '500 Grand Avenue, Convention Zone', 1, 1, 15, 230, 'Community Hero', 'Grand Palace Banquet Hall', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'],
    ['user-donor-5', 'Kenji Sato', 'kenji@sakurasushi.demo', 'password123', 'donor', '+1-555-0105', 12.9640, 77.6040, '23 Sakura Way, Midtown Mall', 1, 1, 8, 45, 'Food Saver', 'Sakura Japanese Bistro', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80'],
    ['user-donor-6', 'Carlos Mendez', 'carlos@tacofiesta.demo', 'password123', 'donor', '+1-555-0106', 12.9770, 77.5920, '404 Sol Plaza, West Campus', 1, 1, 10, 80, 'Food Saver', 'Taco Fiesta Cantina', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'],
    ['user-donor-7', 'Fatima Al-Mansoor', 'fatima@oasisbuffet.demo', 'password123', 'donor', '+1-555-0107', 12.9690, 77.5850, '19 Palm Crescent, South Oasis', 1, 1, 12, 140, 'Community Hero', 'Oasis Feast Buffet', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'],
    ['user-donor-8', 'Prof. David Wu', 'david@campuscanteen.demo', 'password123', 'donor', '+1-555-0108', 12.9850, 77.6020, 'Central University Hostel 3 Mess', 1, 1, 10, 190, 'Community Hero', 'University Hostel Mess #3', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'],
    ['user-donor-9', 'Meera Kapoor', 'meera@organichaven.demo', 'password123', 'donor', '+1-555-0109', 12.9610, 77.5980, '7 Green Meadows Lane, Eco Hub', 1, 1, 8, 30, 'Food Saver', 'Organic Haven Supermarket', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'],
    ['user-donor-10', 'Lucas Silva', 'lucas@goldencrust.demo', 'password123', 'donor', '+1-555-0110', 12.9790, 77.6110, '31 Bakery Hill, East Crossing', 1, 1, 10, 95, 'Food Saver', 'Golden Crust Patisserie', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'],
  ];

  additionalDonors.forEach(u => usersStmt.run(...u));

  // Additional 14 Volunteers (Rahul 124 pickups, Ananya 109 pickups, Arjun 97 pickups for Leaderboard)
  const additionalVolunteers = [
    ['user-vol-1', 'Rahul Verma', 'rahul@volunteer.demo', 'password123', 'volunteer', '+1-555-0141', 12.9720, 77.5960, '12 Park View Apts', 1, 1, 20, 1240, 'FoodBridge Legend', 'Campus Cycle Squad', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'],
    ['user-vol-2', 'Ananya Sen', 'ananya@volunteer.demo', 'password123', 'volunteer', '+1-555-0142', 12.9760, 77.6020, '45 Pine Residency', 1, 1, 18, 1090, 'FoodBridge Legend', 'Green Riders', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'],
    ['user-vol-3', 'Arjun Patel', 'arjun@volunteer.demo', 'password123', 'volunteer', '+1-555-0143', 12.9690, 77.5930, '88 Maple Grove', 1, 1, 15, 970, 'Food Champion', 'City Couriers', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'],
    ['user-vol-4', 'Maya Krishnan', 'maya@volunteer.demo', 'password123', 'volunteer', '+1-555-0144', 12.9810, 77.5970, '19 Orchid Boulevard', 1, 1, 12, 540, 'Food Champion', 'Campus Volunteer Guild', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'],
    ['user-vol-5', 'Devendra Singh', 'dev@volunteer.demo', 'password123', 'volunteer', '+1-555-0145', 12.9630, 77.5880, '61 River Terrace', 1, 1, 15, 320, 'Community Hero', 'Echo Delivery', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'],
    ['user-vol-6', 'Kavita Chawla', 'kavita@volunteer.demo', 'password123', 'volunteer', '+1-555-0146', 12.9840, 77.6050, '72 Cedar Park', 1, 1, 10, 260, 'Community Hero', 'Student Action Network', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'],
    ['user-vol-7', 'Rohan Gupta', 'rohan@volunteer.demo', 'password123', 'volunteer', '+1-555-0147', 12.9670, 77.6080, '9 Jasmine Court', 1, 0, 10, 180, 'Food Saver', 'Independent Courier', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80'],
    ['user-vol-8', 'Neha Deshmukh', 'neha@volunteer.demo', 'password123', 'volunteer', '+1-555-0148', 12.9740, 77.5870, '33 Rose Villa', 1, 1, 15, 140, 'Food Saver', 'Rotaract Youth', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'],
    ['user-vol-9', 'Zaid Khan', 'zaid@volunteer.demo', 'password123', 'volunteer', '+1-555-0149', 12.9790, 77.5910, '104 Sunrise Heights', 1, 1, 12, 110, 'Food Saver', 'Bike Helpers', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'],
    ['user-vol-10', 'Pooja Hegde', 'pooja@volunteer.demo', 'password123', 'volunteer', '+1-555-0150', 12.9620, 77.6010, '51 Lotus Manor', 1, 1, 14, 80, 'Food Saver', 'Green City Ambassadors', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'],
    ['user-vol-11', 'Sameer Bhatia', 'sameer@volunteer.demo', 'password123', 'volunteer', '+1-555-0151', 12.9860, 77.5920, '17 Hillcrest Tower', 1, 1, 15, 60, 'Food Saver', 'Urban Relief Volunteers', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'],
    ['user-vol-12', 'Tanvi Joshi', 'tanvi@volunteer.demo', 'password123', 'volunteer', '+1-555-0152', 12.9710, 77.6120, '82 Emerald Enclave', 1, 1, 10, 50, 'Food Saver', 'Youth Hunger Warriors', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'],
    ['user-vol-13', 'Aditya Roy', 'aditya@volunteer.demo', 'password123', 'volunteer', '+1-555-0153', 12.9650, 77.5830, '44 Willow Springs', 1, 0, 15, 40, 'Food Saver', 'Rotary Club Couriers', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'],
    ['user-vol-14', 'Simran Bedi', 'simran@volunteer.demo', 'password123', 'volunteer', '+1-555-0154', 12.9800, 77.6060, '95 Valley View Road', 1, 1, 12, 30, 'Food Saver', 'Civic Action Team', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'],
  ];

  additionalVolunteers.forEach(u => usersStmt.run(...u));

  // 2. NGOs (5 Verified NGOs with capacities & diet requirements)
  const ngosStmt = db.prepare(`
    INSERT INTO ngos (id, user_id, name, lat, lng, address, capacity_servings, current_servings, diet_preference, accepted_categories, verified, phone, contact_person)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const ngosList = [
    ['ngo-1', 'user-ngo-demo', 'Green Hope Foundation', 12.9650, 77.5890, '77 Compassion Road, Shelter District', 250, 45, 'any', '["cooked","bakery","raw_produce","dairy","packaged"]', 1, '+1-555-0188', 'Sister Teresa / Brother Mark'],
    ['ngo-2', null, 'Seva Hunger Relief Kitchen', 12.9740, 77.6050, '108 Annapoorna Way, East District', 300, 120, 'veg_only', '["cooked","raw_produce","bakery"]', 1, '+1-555-0182', 'Pt. Harishankar Sharma'],
    ['ngo-3', null, 'Nurture Child Care Shelter', 12.9810, 77.5920, '21 Blossom Avenue, North Ward', 150, 30, 'any', '["cooked","dairy","bakery","packaged"]', 1, '+1-555-0183', 'Dr. Reena D’Souza'],
    ['ngo-4', null, 'Dignity Senior Living & Kitchen', 12.9620, 77.6000, '55 Golden Sunset Lane, South Park', 180, 80, 'veg_only', '["cooked","produce","dairy"]', 1, '+1-555-0184', 'Mr. Lawrence Vaz'],
    ['ngo-5', null, 'Urban Night Haven Shelter', 12.9700, 77.5810, '14 Railway Approach, West Terminal', 220, 60, 'any', '["cooked","bakery","packaged"]', 1, '+1-555-0185', 'Capt. Mohan Rathi'],
  ];

  ngosList.forEach(n => ngosStmt.run(...n));

  // 3. Donations (20 Fictional donations covering all statuses and urgencies)
  const donationsStmt = db.prepare(`
    INSERT INTO donations (id, donor_id, food_name, category, diet, qty_kg, servings, image_url, prepared_at, storage, refrigerated, consume_by, packaging_intact, safety_acknowledged, pickup_address, landmark, lat, lng, available_from, available_until, contact, instructions, status, urgency, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const now = Date.now();
  const formatIso = (offsetHours) => new Date(now + offsetHours * 3600 * 1000).toISOString();

  const donationsList = [
    // 1. Ready for Hackathon Demo: 15kg cooked food -> 35 meals!
    [
      'don-001',
      'user-donor-demo',
      'Grand Buffet Mixed Rice, Dal & Vegetable Stew',
      'cooked',
      'veg',
      15.0,
      35,
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      formatIso(-2),
      'refrigerated',
      1,
      formatIso(3.5),
      1,
      1,
      '142 Riverside Ave, Central District (Back Kitchen Gate)',
      'Opposite Riverside Metro Gate 2',
      12.9716,
      77.5946,
      formatIso(-1),
      formatIso(3.5),
      '+1-555-0101',
      'Packed in food-grade aluminum trays. Ring kitchen bell B.',
      'Created',
      'medium',
      formatIso(-1)
    ],
    // 2. Searching - Critical urgency (expires in 45 min)
    [
      'don-002',
      'user-donor-3',
      'Fresh Vegetable Pulao & Raita Pots',
      'cooked',
      'veg',
      12.0,
      28,
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
      formatIso(-3),
      'ambient',
      0,
      formatIso(0.8),
      1,
      1,
      '12 Curry Lane, Spice Plaza',
      'Near Clock Tower',
      12.9680,
      77.5910,
      formatIso(-1.5),
      formatIso(0.8),
      '+1-555-0103',
      'Hot holding insulated carrier. Fast pickup needed.',
      'Searching',
      'critical',
      formatIso(-1.5)
    ],
    // 3. Accepted - High urgency
    [
      'don-003',
      'user-donor-2',
      'Assorted Sourdough Loaves & Croissants',
      'bakery',
      'veg',
      8.0,
      40,
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
      formatIso(-4),
      'ambient',
      0,
      formatIso(1.8),
      1,
      1,
      '88 Baker St, Market Square',
      'Bakery side delivery bay',
      12.9730,
      77.6010,
      formatIso(-2),
      formatIso(1.8),
      '+1-555-0102',
      'Packed in brown paper boxes.',
      'Accepted',
      'high',
      formatIso(-2)
    ],
    // 4. Picked Up - In transit
    [
      'don-004',
      'user-donor-4',
      'Banquet Curry Bowls & Jeera Rice',
      'cooked',
      'non_veg',
      25.0,
      58,
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80',
      formatIso(-3),
      'ambient',
      0,
      formatIso(2.5),
      1,
      1,
      '500 Grand Ave, Convention Hall 1',
      'Banquet Loading Ramp B',
      12.9820,
      77.5880,
      formatIso(-2),
      formatIso(2.5),
      '+1-555-0104',
      'Heavy crates. Volunteer vehicle recommended.',
      'Picked Up',
      'medium',
      formatIso(-2)
    ],
    // 5. Delivered - Pending distribution
    [
      'don-005',
      'user-donor-8',
      'Hostel Dining Hall Rice & Lentil Dal',
      'cooked',
      'veg',
      18.0,
      42,
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
      formatIso(-4),
      'ambient',
      0,
      formatIso(3.0),
      1,
      1,
      'Central University Hostel 3 Mess Gate',
      'Near Student Quad',
      12.9850,
      77.6020,
      formatIso(-3),
      formatIso(3.0),
      '+1-555-0108',
      'Freshly prepared surplus. Sanitized steel bins.',
      'Delivered',
      'medium',
      formatIso(-3)
    ],
    // 6. Distributed - Completed full cycle
    [
      'don-006',
      'user-donor-7',
      'Mediterranean Mezze & Pita Bread',
      'cooked',
      'veg',
      14.0,
      33,
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
      formatIso(-8),
      'refrigerated',
      1,
      formatIso(12.0),
      1,
      1,
      '19 Palm Crescent, South Oasis',
      'Buffet service entrance',
      12.9690,
      77.5850,
      formatIso(-6),
      formatIso(12.0),
      '+1-555-0107',
      'Clean containers.',
      'Distributed',
      'low',
      formatIso(-6)
    ],
    // 7. Completed - Historical
    [
      'don-007',
      'user-donor-9',
      'Organic Apples, Oranges & Green Leaf Crates',
      'raw_produce',
      'vegan',
      20.0,
      50,
      'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',
      formatIso(-24),
      'ambient',
      0,
      formatIso(-2),
      1,
      1,
      '7 Green Meadows Lane, Eco Hub',
      'Store Rear Gate',
      12.9610,
      77.5980,
      formatIso(-24),
      formatIso(-2),
      '+1-555-0109',
      'Sorted crates.',
      'Completed',
      'low',
      formatIso(-24)
    ],
    // 8. Completed - Historical
    [
      'don-008',
      'user-donor-10',
      'Sandwich Rolls & Brioche Packets',
      'bakery',
      'veg',
      10.0,
      50,
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
      formatIso(-48),
      'ambient',
      0,
      formatIso(-12),
      1,
      1,
      '31 Bakery Hill, East Crossing',
      'Back alley loading door',
      12.9790,
      77.6110,
      formatIso(-48),
      formatIso(-12),
      '+1-555-0110',
      'Double bagged.',
      'Completed',
      'low',
      formatIso(-48)
    ],
    // 9. Cancelled
    [
      'don-009',
      'user-donor-5',
      'Bento Rice Bowls & Tofu Stir Fry',
      'cooked',
      'vegan',
      6.0,
      14,
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
      formatIso(-10),
      'ambient',
      0,
      formatIso(-1),
      1,
      1,
      '23 Sakura Way, Midtown Mall',
      'Level B1 Loading Dock',
      12.9640,
      77.6040,
      formatIso(-10),
      formatIso(-1),
      '+1-555-0105',
      'Donor reported accidental contamination prior to courier pickup.',
      'Cancelled',
      'low',
      formatIso(-10)
    ],
    // 10. Expired
    [
      'don-010',
      'user-donor-6',
      'Burrito Trays & Grilled Veggies',
      'cooked',
      'veg',
      9.0,
      21,
      'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
      formatIso(-15),
      'ambient',
      0,
      formatIso(-5),
      1,
      1,
      '404 Sol Plaza, West Campus',
      'Campus Food Court',
      12.9770,
      77.5920,
      formatIso(-15),
      formatIso(-5),
      '+1-555-0106',
      'Window lapsed without pickup courier.',
      'Expired',
      'low',
      formatIso(-15)
    ],
    // Additional 10 donations to make 20 total
    [
      'don-011',
      'user-donor-demo',
      'Penne Arrabbiata & Garlic Focaccia',
      'cooked',
      'veg',
      11.0,
      26,
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80',
      formatIso(-1),
      'refrigerated',
      1,
      formatIso(4.5),
      1,
      1,
      '142 Riverside Ave, Central District',
      'Opposite Riverside Metro',
      12.9716,
      77.5946,
      formatIso(-1),
      formatIso(4.5),
      '+1-555-0101',
      'Keep flat.',
      'Created',
      'low',
      formatIso(-1)
    ],
    [
      'don-012',
      'user-donor-3',
      'Hyderabadi Dum Biryani & Mirchi Salan',
      'cooked',
      'non_veg',
      16.0,
      37,
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
      formatIso(-2),
      'heated',
      0,
      formatIso(1.5),
      1,
      1,
      '12 Curry Lane, Spice Plaza',
      'Behind Spice Plaza fountain',
      12.9680,
      77.5910,
      formatIso(-1),
      formatIso(1.5),
      '+1-555-0103',
      'Thermal box provided.',
      'Searching',
      'high',
      formatIso(-1)
    ],
    [
      'don-013',
      'user-donor-4',
      'Event Salad Bar & Steamed Quinoa Bowls',
      'raw_produce',
      'vegan',
      12.0,
      30,
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
      formatIso(-2),
      'refrigerated',
      1,
      formatIso(5.0),
      1,
      1,
      '500 Grand Ave, Convention Center',
      'Exhibition Hall 3',
      12.9820,
      77.5880,
      formatIso(-2),
      formatIso(5.0),
      '+1-555-0104',
      'Clean chilled boxes.',
      'Accepted',
      'low',
      formatIso(-2)
    ],
    [
      'don-014',
      'user-donor-7',
      'Hummus, Falafel & Lavash Flatbreads',
      'cooked',
      'vegan',
      10.0,
      23,
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
      formatIso(-3),
      'ambient',
      0,
      formatIso(0.9),
      1,
      1,
      '19 Palm Crescent, South Oasis',
      'Buffet service entrance',
      12.9690,
      77.5850,
      formatIso(-2),
      formatIso(0.9),
      '+1-555-0107',
      'Urgent collection requested.',
      'Searching',
      'critical',
      formatIso(-2)
    ],
    [
      'don-015',
      'user-donor-8',
      'College Breakfast Idli & Sambar Surplus',
      'cooked',
      'veg',
      15.0,
      35,
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
      formatIso(-5),
      'ambient',
      0,
      formatIso(1.2),
      1,
      1,
      'Central University Hostel 3 Mess Gate',
      'Hostel Quad Entrance',
      12.9850,
      77.6020,
      formatIso(-4),
      formatIso(1.2),
      '+1-555-0108',
      'Stainless steel urns.',
      'Accepted',
      'high',
      formatIso(-4)
    ],
    [
      'don-016',
      'user-donor-9',
      'Fresh Dairy Milk & Yogurt Tubs',
      'dairy',
      'veg',
      8.0,
      20,
      'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=600&auto=format&fit=crop&q=80',
      formatIso(-6),
      'refrigerated',
      1,
      formatIso(6.0),
      1,
      1,
      '7 Green Meadows Lane, Eco Hub',
      'Dairy section loading bay',
      12.9610,
      77.5980,
      formatIso(-5),
      formatIso(6.0),
      '+1-555-0109',
      'Cold chain insulated bags needed.',
      'Completed',
      'low',
      formatIso(-5)
    ],
    [
      'don-017',
      'user-donor-10',
      'French Baguettes & Fruit Tartlets',
      'bakery',
      'veg',
      7.0,
      35,
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
      formatIso(-12),
      'ambient',
      0,
      formatIso(8.0),
      1,
      1,
      '31 Bakery Hill, East Crossing',
      'Store front',
      12.9790,
      77.6110,
      formatIso(-10),
      formatIso(8.0),
      '+1-555-0110',
      'Ready in clean crates.',
      'Distributed',
      'low',
      formatIso(-10)
    ],
    [
      'don-018',
      'user-donor-2',
      'Whole Wheat Bread & Cinnamon Buns',
      'bakery',
      'veg',
      6.0,
      30,
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
      formatIso(-8),
      'ambient',
      0,
      formatIso(2.8),
      1,
      1,
      '88 Baker St, Market Square',
      'Bakery main entrance',
      12.9730,
      77.6010,
      formatIso(-7),
      formatIso(2.8),
      '+1-555-0102',
      'Double carton packing.',
      'Completed',
      'medium',
      formatIso(-7)
    ],
    [
      'don-019',
      'user-donor-demo',
      'Minestrone Vegetable Soup & Focaccia',
      'cooked',
      'veg',
      14.0,
      33,
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
      formatIso(-18),
      'refrigerated',
      1,
      formatIso(3.0),
      1,
      1,
      '142 Riverside Ave, Central District',
      'Kitchen door',
      12.9716,
      77.5946,
      formatIso(-17),
      formatIso(3.0),
      '+1-555-0101',
      'Thermal canisters.',
      'Distributed',
      'medium',
      formatIso(-17)
    ],
    [
      'don-020',
      'user-donor-6',
      'Mexican Rice, Black Beans & Salsa',
      'cooked',
      'vegan',
      10.0,
      23,
      'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
      formatIso(-2),
      'ambient',
      0,
      formatIso(3.8),
      1,
      1,
      '404 Sol Plaza, West Campus',
      'Cantina pickup window',
      12.9770,
      77.5920,
      formatIso(-1),
      formatIso(3.8),
      '+1-555-0106',
      'Sealed containers.',
      'Searching',
      'medium',
      formatIso(-1)
    ],
  ];

  donationsList.forEach(d => donationsStmt.run(...d));

  // 4. Initial Pickups linking accepted/in-transit donations
  const pickupsStmt = db.prepare(`
    INSERT INTO pickups (id, donation_id, volunteer_id, ngo_id, accepted_at, picked_up_at, delivered_at, distributed_at, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const initialPickups = [
    ['pick-003', 'don-003', 'user-vol-1', 'ngo-1', formatIso(-1.5), null, null, null, 'Accepted', 'Volunteer en-route on e-bike.'],
    ['pick-004', 'don-004', 'user-volunteer-demo', 'ngo-2', formatIso(-2), formatIso(-0.5), null, null, 'Picked Up', 'Collected from banquet dock, delivering now.'],
    ['pick-005', 'don-005', 'user-vol-2', 'ngo-3', formatIso(-2.5), formatIso(-1.5), formatIso(-0.2), null, 'Delivered', 'Delivered to shelter kitchen, staging meal distribution.'],
    ['pick-006', 'don-006', 'user-vol-3', 'ngo-1', formatIso(-5), formatIso(-4), formatIso(-3), formatIso(-1), 'Distributed', 'Served 33 community members with hot evening meal.'],
  ];

  initialPickups.forEach(p => pickupsStmt.run(...p));

  // 5. Initial Notifications
  const notifStmt = db.prepare(`
    INSERT INTO notifications (id, recipient_id, message, type, link, read, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const initialNotifs = [
    ['notif-1', 'user-donor-demo', 'Welcome to FoodBridge AI! Your profile is verified as a registered restaurant donor.', 'info', '/donor', 0, formatIso(-1)],
    ['notif-2', 'user-volunteer-demo', '📍 Urgent: 12 kg Vegetable Pulao needs pickup within 45 minutes (1.2 km away).', 'urgent', '/volunteer', 0, formatIso(-0.5)],
    ['notif-3', 'user-volunteer-demo', 'Badge unlocked! You have earned the "Food Champion" milestone badge (40+ pickups).', 'success', '/leaderboard', 0, formatIso(-2)],
    ['notif-4', 'user-ngo-demo', '🚚 Delivery Update: 25 kg Banquet Meals arriving in ~15 mins from Volunteer Aarav Sharma.', 'info', '/ngo', 0, formatIso(-0.2)],
  ];

  initialNotifs.forEach(n => notifStmt.run(...n));

  // 6. Reset Impact Stats to official hackathon baseline
  db.prepare(`
    UPDATE impact_stats SET
      total_kg_rescued = 2450.0,
      total_meals_served = 8700,
      total_pickups = 624,
      total_volunteers = 183,
      total_ngos = 37,
      waste_reduced_tonnes = 2.45
    WHERE id = 1
  `).run();

  console.log('✅ Database successfully seeded with 10 donors, 15 volunteers, 5 NGOs, 20 donations, and baseline stats!');
}

// Allow direct CLI invocation: node server/seed.js
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase();
}
