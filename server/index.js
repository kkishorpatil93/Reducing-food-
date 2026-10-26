import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { db, initDatabase, calculateServings, calculateUrgency } from './db.js';
import { seedDatabase } from './seed.js';
import { rankNgoMatches, rankVolunteerMatches, calculateDistanceKm } from './matching.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'foodbridge_demo_secret_2026';

app.use(cors());
app.use(express.json());

// Initialize DB on server start
initDatabase();

// Check if users table is empty; if so, auto-seed
const userCount = db.prepare('SELECT count(*) as count FROM users').get()?.count || 0;
if (userCount === 0) {
  seedDatabase();
}

// -------------------------------------------------------------
// Server-Sent Events (SSE) Client Registry for Live Updates
// -------------------------------------------------------------
let sseClients = [];

app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const clientId = Date.now() + Math.random().toString(36).substring(2, 7);
  const newClient = { id: clientId, res };
  sseClients.push(newClient);

  // Send initial connected event
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', clientId })}\n\n`);

  req.on('close', () => {
    sseClients = sseClients.filter(c => c.id !== clientId);
  });
});

export function broadcastSse(eventType, payload) {
  const data = JSON.stringify({ type: eventType, payload, timestamp: new Date().toISOString() });
  sseClients.forEach(client => {
    try {
      client.res.write(`data: ${data}\n\n`);
    } catch (e) {
      // Ignore write errors to closed clients
    }
  });
}

// -------------------------------------------------------------
// Auth & Demo Login
// -------------------------------------------------------------
function generateToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Demo quick-login endpoints (One-click instant authentication)
app.post('/api/auth/demo/:role', (req, res) => {
  const role = req.params.role.toLowerCase();
  let user;

  if (role === 'donor') {
    user = db.prepare("SELECT * FROM users WHERE id = 'user-donor-demo'").get();
  } else if (role === 'volunteer') {
    user = db.prepare("SELECT * FROM users WHERE id = 'user-volunteer-demo'").get();
  } else if (role === 'ngo') {
    user = db.prepare("SELECT * FROM users WHERE id = 'user-ngo-demo'").get();
  } else if (role === 'admin') {
    user = db.prepare("SELECT * FROM users WHERE id = 'user-admin-demo'").get();
  } else {
    return res.status(400).json({ error: 'Invalid demo role requested' });
  }

  if (!user) {
    seedDatabase();
    user = db.prepare("SELECT * FROM users WHERE role = ? LIMIT 1").get(role);
  }

  const token = generateToken(user);
  res.json({ token, user });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || user.password !== (password || 'password123')) {
    return res.status(401).json({ error: 'Invalid credentials. For demo accounts use password123' });
  }
  const token = generateToken(user);
  res.json({ token, user });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: 'Token expired or invalid' });
  }
});

// -------------------------------------------------------------
// Donations API
// -------------------------------------------------------------
app.get('/api/donations', (req, res) => {
  const { category, status, urgency, diet, search, donor_id } = req.query;
  let sql = 'SELECT d.*, u.name as donor_name, u.organization_name, u.phone as donor_phone FROM donations d JOIN users u ON d.donor_id = u.id WHERE 1=1';
  const params = [];

  if (category && category !== 'all') {
    sql += ' AND d.category = ?';
    params.push(category);
  }
  if (status && status !== 'all') {
    sql += ' AND d.status = ?';
    params.push(status);
  }
  if (urgency && urgency !== 'all') {
    sql += ' AND d.urgency = ?';
    params.push(urgency);
  }
  if (diet && diet !== 'all') {
    sql += ' AND d.diet = ?';
    params.push(diet);
  }
  if (donor_id) {
    sql += ' AND d.donor_id = ?';
    params.push(donor_id);
  }
  if (search) {
    sql += ' AND (d.food_name LIKE ? OR d.pickup_address LIKE ? OR u.name LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  sql += ' ORDER BY d.created_at DESC';

  const rows = db.prepare(sql).all(...params);

  // Recalculate live urgency on the fly based on current clock
  const enriched = rows.map(item => {
    const liveUrgency = calculateUrgency(item.available_until);
    return {
      ...item,
      urgency: liveUrgency,
      // Phone number privacy safeguard: Mask phone unless accepted/in-progress
      donor_phone: ['Accepted', 'Picked Up', 'Delivered', 'Distributed', 'Completed'].includes(item.status)
        ? item.donor_phone
        : item.donor_phone.replace(/\d(?=\d{3})/g, '*')
    };
  });

  res.json(enriched);
});

app.get('/api/donations/:id', (req, res) => {
  const donation = db.prepare(`
    SELECT d.*, u.name as donor_name, u.organization_name, u.phone as donor_phone, u.avatar_url as donor_avatar
    FROM donations d
    JOIN users u ON d.donor_id = u.id
    WHERE d.id = ?
  `).get(req.params.id);

  if (!donation) {
    return res.status(404).json({ error: 'Donation not found' });
  }

  donation.urgency = calculateUrgency(donation.available_until);

  // Fetch linked pickup if exists
  const pickup = db.prepare(`
    SELECT p.*, v.name as volunteer_name, v.phone as volunteer_phone, v.points as volunteer_points,
           n.name as ngo_name, n.address as ngo_address, n.phone as ngo_phone
    FROM pickups p
    LEFT JOIN users v ON p.volunteer_id = v.id
    LEFT JOIN ngos n ON p.ngo_id = n.id
    WHERE p.donation_id = ?
    ORDER BY p.accepted_at DESC LIMIT 1
  `).get(req.params.id);

  // Privacy protection: donor phone is only shown if accepted
  if (!['Accepted', 'Picked Up', 'Delivered', 'Distributed', 'Completed'].includes(donation.status)) {
    donation.donor_phone = donation.donor_phone.replace(/\d(?=\d{3})/g, '*');
  }

  res.json({ donation, pickup: pickup || null });
});

app.post('/api/donations', (req, res) => {
  const {
    donor_id = 'user-donor-demo',
    food_name,
    category = 'cooked',
    diet = 'veg',
    qty_kg,
    image_url,
    prepared_at = new Date().toISOString(),
    storage = 'ambient',
    refrigerated = 0,
    consume_by,
    packaging_intact = 1,
    safety_acknowledged,
    pickup_address,
    landmark = '',
    lat = 12.9716,
    lng = 77.5946,
    available_from = new Date().toISOString(),
    available_until,
    contact = '+1-555-0101',
    instructions = '',
  } = req.body;

  // Validation
  if (!food_name || !qty_kg || !pickup_address) {
    return res.status(400).json({ error: 'Please provide food name, quantity, and pickup address' });
  }

  // Mandatory non-negotiable rule: require safety acknowledgment
  if (!safety_acknowledged) {
    return res.status(400).json({
      error: 'Safety acknowledgment is required: "Only donate food that is safe, properly stored, and suitable for consumption. The donor remains responsible for food safety."'
    });
  }

  const kg = parseFloat(qty_kg);
  if (isNaN(kg) || kg <= 0) {
    return res.status(400).json({ error: 'Quantity must be a positive number of kg' });
  }

  // Calculate servings using category multiplier (15 kg cooked food -> ~35 meals)
  const servings = calculateServings(kg, category);

  // Calculate urgency based on available_until (default 4 hours if not set)
  const defaultUntil = new Date(Date.now() + 4 * 3600 * 1000).toISOString();
  const validUntil = available_until || defaultUntil;
  const liveUrgency = calculateUrgency(validUntil);

  const donationId = 'don-' + Date.now().toString().slice(-6);
  const createdAt = new Date().toISOString();

  const fallbackImage = category === 'bakery'
    ? 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80'
    : category === 'raw_produce'
    ? 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';

  db.prepare(`
    INSERT INTO donations (
      id, donor_id, food_name, category, diet, qty_kg, servings, image_url,
      prepared_at, storage, refrigerated, consume_by, packaging_intact,
      safety_acknowledged, pickup_address, landmark, lat, lng,
      available_from, available_until, contact, instructions, status, urgency, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    donationId,
    donor_id,
    food_name,
    category,
    diet,
    kg,
    servings,
    image_url || fallbackImage,
    prepared_at,
    storage,
    refrigerated ? 1 : 0,
    consume_by || validUntil,
    packaging_intact ? 1 : 0,
    1,
    pickup_address,
    landmark,
    parseFloat(lat) || 12.9716,
    parseFloat(lng) || 77.5946,
    available_from,
    validUntil,
    contact,
    instructions,
    'Searching',
    liveUrgency,
    createdAt
  );

  const createdDonation = db.prepare('SELECT * FROM donations WHERE id = ?').get(donationId);

  // Create notifications for nearby volunteers & NGOs
  const notifId = 'notif-' + Date.now().toString().slice(-6);
  db.prepare(`
    INSERT INTO notifications (id, recipient_id, message, type, link, read, created_at)
    VALUES (?, ?, ?, ?, ?, 0, ?)
  `).run(
    notifId,
    'user-volunteer-demo',
    `📍 New Donation Alert: ${kg} kg of ${food_name} (~${servings} meals) available for pickup!`,
    liveUrgency === 'critical' ? 'urgent' : 'info',
    `/donations/${donationId}`,
    createdAt
  );

  // Broadcast live SSE event
  broadcastSse('DONATION_CREATED', { donation: createdDonation });

  res.status(201).json({
    message: 'Food donation created and matching initialized',
    donation: createdDonation,
    servings,
    urgency: liveUrgency
  });
});

// -------------------------------------------------------------
// Smart Matching Endpoint (Top candidate NGOs and Volunteers)
// -------------------------------------------------------------
app.get('/api/donations/:id/matches', (req, res) => {
  const donation = db.prepare('SELECT * FROM donations WHERE id = ?').get(req.params.id);
  if (!donation) {
    return res.status(404).json({ error: 'Donation not found' });
  }

  const allNgos = db.prepare('SELECT * FROM ngos').all();
  const allVolunteers = db.prepare("SELECT * FROM users WHERE role = 'volunteer'").all();

  const ngoMatches = rankNgoMatches(donation, allNgos);
  const volunteerMatches = rankVolunteerMatches(donation, allVolunteers);

  res.json({
    algorithm: 'Smart Matching Algorithm (6-Factor Haversine Scoring)',
    donation_id: donation.id,
    servings: donation.servings,
    ngos: ngoMatches,
    volunteers: volunteerMatches
  });
});

// -------------------------------------------------------------
// Pickups & State Machine Lifecycle Management
// -------------------------------------------------------------
app.post('/api/pickups/accept', (req, res) => {
  const { donation_id, volunteer_id = 'user-volunteer-demo', ngo_id = 'ngo-1' } = req.body;

  const donation = db.prepare('SELECT * FROM donations WHERE id = ?').get(donation_id);
  if (!donation) {
    return res.status(404).json({ error: 'Donation not found' });
  }

  const pickupId = 'pick-' + Date.now().toString().slice(-6);
  const nowIso = new Date().toISOString();

  // Insert pickup record
  db.prepare(`
    INSERT INTO pickups (id, donation_id, volunteer_id, ngo_id, accepted_at, status, notes)
    VALUES (?, ?, ?, ?, ?, 'Accepted', 'Courier accepted pickup request')
  `).run(pickupId, donation_id, volunteer_id, ngo_id, nowIso);

  // Advance donation status to Accepted
  db.prepare("UPDATE donations SET status = 'Accepted' WHERE id = ?").run(donation_id);

  // Notify donor
  const donor = db.prepare('SELECT * FROM users WHERE id = ?').get(donation.donor_id);
  const volunteer = db.prepare('SELECT * FROM users WHERE id = ?').get(volunteer_id);
  const ngo = db.prepare('SELECT * FROM ngos WHERE id = ?').get(ngo_id);

  if (donor) {
    db.prepare(`
      INSERT INTO notifications (id, recipient_id, message, type, link, read, created_at)
      VALUES (?, ?, ?, 'success', ?, 0, ?)
    `).run(
      'notif-' + Date.now().toString().slice(-6),
      donor.id,
      `Volunteer ${volunteer?.name || 'Aarav'} has accepted your donation of ${donation.food_name}! Contact: ${volunteer?.phone || '+1-555-0155'}`,
      `/donations/${donation.id}`,
      nowIso
    );
  }

  // Notify NGO
  if (ngo) {
    db.prepare(`
      INSERT INTO notifications (id, recipient_id, message, type, link, read, created_at)
      VALUES (?, ?, ?, 'info', ?, 0, ?)
    `).run(
      'notif-' + (Date.now() + 1).toString().slice(-6),
      ngo.user_id || 'user-ngo-demo',
      `🚚 Incoming Food: ~${donation.servings} meals are being picked up for distribution by ${volunteer?.name || 'Aarav'}.`,
      `/ngo`,
      nowIso
    );
  }

  broadcastSse('PICKUP_ACCEPTED', { donation_id, pickup_id: pickupId, volunteer_id, ngo_id });

  res.json({
    message: 'Pickup accepted successfully',
    pickup_id: pickupId,
    status: 'Accepted'
  });
});

app.patch('/api/pickups/:id/status', (req, res) => {
  const { status, notes } = req.body;
  const pickupId = req.params.id;
  const validStatuses = ['Accepted', 'Picked Up', 'Delivered', 'Distributed', 'Completed'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const pickup = db.prepare('SELECT * FROM pickups WHERE id = ?').get(pickupId);
  if (!pickup) {
    return res.status(404).json({ error: 'Pickup not found' });
  }

  const nowIso = new Date().toISOString();
  let timeField = null;
  if (status === 'Picked Up') timeField = 'picked_up_at';
  if (status === 'Delivered') timeField = 'delivered_at';
  if (status === 'Distributed' || status === 'Completed') timeField = 'distributed_at';

  if (timeField) {
    db.prepare(`UPDATE pickups SET status = ?, ${timeField} = ?, notes = coalesce(?, notes) WHERE id = ?`)
      .run(status, nowIso, notes, pickupId);
  } else {
    db.prepare('UPDATE pickups SET status = ?, notes = coalesce(?, notes) WHERE id = ?')
      .run(status, notes, pickupId);
  }

  // Update parent donation status
  db.prepare('UPDATE donations SET status = ? WHERE id = ?').run(status, pickup.donation_id);

  const donation = db.prepare('SELECT * FROM donations WHERE id = ?').get(pickup.donation_id);

  // If status is Delivered or Distributed, update impact stats and volunteer points!
  if (status === 'Delivered' || status === 'Distributed' || status === 'Completed') {
    const kgRescued = donation?.qty_kg || 0;
    const mealsServed = donation?.servings || 0;
    const tonnesReduced = parseFloat((kgRescued / 1000).toFixed(3));

    // Update global impact stats
    db.prepare(`
      UPDATE impact_stats SET
        total_kg_rescued = total_kg_rescued + ?,
        total_meals_served = total_meals_served + ?,
        total_pickups = total_pickups + 1,
        waste_reduced_tonnes = waste_reduced_tonnes + ?
      WHERE id = 1
    `).run(kgRescued, mealsServed, tonnesReduced);

    // Award volunteer points (+10 pts per completed rescue)
    if (pickup.volunteer_id) {
      db.prepare(`UPDATE users SET points = points + 10 WHERE id = ?`).run(pickup.volunteer_id);
      const updatedVolunteer = db.prepare('SELECT points, badge FROM users WHERE id = ?').get(pickup.volunteer_id);
      // Auto-unlock badges based on points
      let newBadge = updatedVolunteer.badge;
      if (updatedVolunteer.points >= 1000) newBadge = 'FoodBridge Legend';
      else if (updatedVolunteer.points >= 500) newBadge = 'Food Champion';
      else if (updatedVolunteer.points >= 250) newBadge = 'Community Hero';
      else newBadge = 'Food Saver';

      db.prepare('UPDATE users SET badge = ? WHERE id = ?').run(newBadge, pickup.volunteer_id);
    }
  }

  broadcastSse('STATUS_UPDATED', { pickup_id: pickupId, donation_id: pickup.donation_id, status });

  res.json({
    message: `Status updated to ${status}`,
    status,
    pickup_id: pickupId,
    donation_id: pickup.donation_id
  });
});

// Cancel donation endpoint (Donor or Admin)
app.patch('/api/donations/:id/cancel', (req, res) => {
  const donation = db.prepare('SELECT * FROM donations WHERE id = ?').get(req.params.id);
  if (!donation) {
    return res.status(404).json({ error: 'Donation not found' });
  }

  if (['Delivered', 'Distributed', 'Completed'].includes(donation.status)) {
    return res.status(400).json({ error: 'Cannot cancel a donation that is already delivered or distributed' });
  }

  db.prepare("UPDATE donations SET status = 'Cancelled' WHERE id = ?").run(req.params.id);
  broadcastSse('STATUS_UPDATED', { donation_id: req.params.id, status: 'Cancelled' });

  res.json({ message: 'Donation cancelled successfully', status: 'Cancelled', donation_id: req.params.id });
});

// Update donation status directly (for state machine progression)
app.patch('/api/donations/:id/status', (req, res) => {
  const { status, notes } = req.body;
  const validStatuses = ['Created', 'Searching', 'Accepted', 'Picked Up', 'Delivered', 'Distributed', 'Completed', 'Cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}` });
  }

  const donation = db.prepare('SELECT * FROM donations WHERE id = ?').get(req.params.id);
  if (!donation) {
    return res.status(404).json({ error: 'Donation not found' });
  }

  db.prepare('UPDATE donations SET status = ? WHERE id = ?').run(status, req.params.id);

  // Sync or update linked pickup
  let pickup = db.prepare('SELECT * FROM pickups WHERE donation_id = ? ORDER BY accepted_at DESC LIMIT 1').get(req.params.id);
  const nowIso = new Date().toISOString();

  if (!pickup && ['Accepted', 'Picked Up', 'Delivered', 'Distributed', 'Completed'].includes(status)) {
    const pickupId = 'pick-' + Date.now().toString().slice(-6);
    db.prepare(`
      INSERT INTO pickups (id, donation_id, volunteer_id, ngo_id, accepted_at, status, notes)
      VALUES (?, ?, 'user-volunteer-demo', 'ngo-1', ?, ?, ?)
    `).run(pickupId, req.params.id, nowIso, status, notes || 'Lifecycle status update');
    pickup = db.prepare('SELECT * FROM pickups WHERE id = ?').get(pickupId);
  } else if (pickup) {
    let timeField = null;
    if (status === 'Picked Up') timeField = 'picked_up_at';
    if (status === 'Delivered') timeField = 'delivered_at';
    if (status === 'Distributed' || status === 'Completed') timeField = 'distributed_at';

    if (timeField) {
      db.prepare(`UPDATE pickups SET status = ?, ${timeField} = ?, notes = coalesce(?, notes) WHERE id = ?`)
        .run(status, nowIso, notes, pickup.id);
    } else {
      db.prepare('UPDATE pickups SET status = ?, notes = coalesce(?, notes) WHERE id = ?')
        .run(status, notes, pickup.id);
    }
  }

  // If status is Delivered or Distributed or Completed, record impact stats and award courier points!
  if (['Delivered', 'Distributed', 'Completed'].includes(status)) {
    const kgRescued = donation.qty_kg || 0;
    const mealsServed = donation.servings || 0;
    const tonnesReduced = parseFloat((kgRescued / 1000).toFixed(3));

    db.prepare(`
      UPDATE impact_stats SET
        total_kg_rescued = total_kg_rescued + ?,
        total_meals_served = total_meals_served + ?,
        total_pickups = total_pickups + 1,
        waste_reduced_tonnes = waste_reduced_tonnes + ?
      WHERE id = 1
    `).run(kgRescued, mealsServed, tonnesReduced);

    const volunteerId = pickup?.volunteer_id || 'user-volunteer-demo';
    db.prepare('UPDATE users SET points = points + 10 WHERE id = ?').run(volunteerId);
    const updatedVolunteer = db.prepare('SELECT points, badge FROM users WHERE id = ?').get(volunteerId);
    let newBadge = updatedVolunteer.badge;
    if (updatedVolunteer.points >= 1000) newBadge = 'FoodBridge Legend';
    else if (updatedVolunteer.points >= 500) newBadge = 'Food Champion';
    else if (updatedVolunteer.points >= 250) newBadge = 'Community Hero';
    else newBadge = 'Food Saver';

    db.prepare('UPDATE users SET badge = ? WHERE id = ?').run(newBadge, volunteerId);
  }

  broadcastSse('STATUS_UPDATED', { donation_id: req.params.id, pickup_id: pickup?.id, status });

  res.json({
    message: `Donation status updated to ${status}`,
    status,
    donation_id: req.params.id,
    pickup_id: pickup?.id
  });
});

// -------------------------------------------------------------
// Impact Stats & Analytics (Historical Baseline vs Live Demo)
// -------------------------------------------------------------
app.get('/api/stats', (req, res) => {
  const stats = db.prepare('SELECT * FROM impact_stats WHERE id = 1').get() || {
    total_kg_rescued: 2450.0,
    total_meals_served: 8700,
    total_pickups: 624,
    total_volunteers: 183,
    total_ngos: 37,
    waste_reduced_tonnes: 2.45
  };

  // Calculate live demo session contributions (donations created during demo that got rescued)
  const seedDonationIds = [
    'don-001', 'don-002', 'don-003', 'don-004', 'don-005', 'don-006', 'don-007',
    'don-008', 'don-009', 'don-010', 'don-011', 'don-012', 'don-013', 'don-014',
    'don-015', 'don-016', 'don-017', 'don-018', 'don-019', 'don-020'
  ];
  
  const placeholders = seedDonationIds.map(() => '?').join(',');
  const liveDemoStats = db.prepare(`
    SELECT
      COALESCE(SUM(qty_kg), 0) as live_kg,
      COALESCE(SUM(servings), 0) as live_meals,
      COUNT(*) as live_count
    FROM donations
    WHERE status IN ('Delivered', 'Distributed', 'Completed')
      AND id NOT IN (${placeholders})
  `).get(...seedDonationIds);

  const baseline = {
    kg_rescued: 2450.0,
    meals_served: 8700,
    pickups: 624,
    volunteers: 183,
    ngos: 37,
    waste_reduced_tonnes: 2.45
  };

  const liveSession = {
    kg_rescued: parseFloat(liveDemoStats?.live_kg || 0),
    meals_served: parseInt(liveDemoStats?.live_meals || 0, 10),
    pickups: parseInt(liveDemoStats?.live_count || 0, 10),
  };

  // Weekly rescued chart history
  const weeklyData = [
    { week: 'Week 1', kg: 380, meals: 910 },
    { week: 'Week 2', kg: 450, meals: 1080 },
    { week: 'Week 3', kg: 520, meals: 1250 },
    { week: 'Week 4', kg: 590, meals: 1420 },
    { week: 'This Week', kg: Math.round(510 + liveSession.kg_rescued), meals: Math.round(1220 + liveSession.meals_served) },
  ];

  // Category breakdown
  const categoryData = [
    { name: 'Cooked Meals', value: 46, color: '#16A34A' },
    { name: 'Bakery & Bread', value: 24, color: '#F97316' },
    { name: 'Fresh Produce', value: 16, color: '#10B981' },
    { name: 'Packaged Foods', value: 9, color: '#6366F1' },
    { name: 'Dairy Items', value: 5, color: '#F59E0B' },
  ];

  // Monthly impact progression
  const monthlyData = [
    { month: 'Jun', meals: 1200, pickups: 90 },
    { month: 'Jul', meals: 1850, pickups: 135 },
    { month: 'Aug', meals: 2400, pickups: 175 },
    { month: 'Sep', meals: 2950, pickups: 210 },
    { month: 'Oct', meals: stats.total_meals_served, pickups: stats.total_pickups },
  ];

  res.json({
    headline: stats,
    baseline,
    live_session: liveSession,
    weekly: weeklyData,
    categories: categoryData,
    monthly: monthlyData,
  });
});

// Heatmap computation zones
app.get('/api/stats/heatmap', (req, res) => {
  const zones = [
    {
      id: 'zone-1',
      name: 'Central Restaurant & Gastronomy District',
      lat: 12.9716,
      lng: 77.5946,
      radius_m: 800,
      intensity: 'high',
      donations_count: 84,
      kg_rescued: 940,
      peak_hours: '9:30 PM - 11:30 PM',
      volunteer_tip: 'Position 3-4 volunteers near Central Square at 9:30 PM for swift collection of dinner buffets.'
    },
    {
      id: 'zone-2',
      name: 'University Campuses & Student Hostels',
      lat: 12.9850,
      lng: 77.6020,
      radius_m: 1000,
      intensity: 'high',
      donations_count: 62,
      kg_rescued: 710,
      peak_hours: '2:00 PM - 3:30 PM & 9:00 PM',
      volunteer_tip: 'Hostels #2, #3, and #7 regularly post 15-20 kg surplus after student lunch hours.'
    },
    {
      id: 'zone-3',
      name: 'Grand Convention & Wedding Banquets Hub',
      lat: 12.9820,
      lng: 77.5880,
      radius_m: 1200,
      intensity: 'critical',
      donations_count: 38,
      kg_rescued: 850,
      peak_hours: '10:30 PM - 1:00 AM',
      volunteer_tip: 'Large scale events average 25-40 kg per post. Cargo bikes or volunteer cars recommended.'
    },
    {
      id: 'zone-4',
      name: 'Tech Park Cafeterias & Corporate Hub',
      lat: 12.9640,
      lng: 77.6040,
      radius_m: 900,
      intensity: 'medium',
      donations_count: 45,
      kg_rescued: 490,
      peak_hours: '3:00 PM - 4:30 PM',
      volunteer_tip: 'Corporate caterers prepare packed meal boxes suitable for rapid direct distribution.'
    }
  ];

  res.json(zones);
});

// Leaderboard
app.get('/api/leaderboard', (req, res) => {
  const volunteers = db.prepare(`
    SELECT id, name, organization_name, avatar_url, points, badge,
           (SELECT COUNT(*) FROM pickups WHERE volunteer_id = users.id AND status IN ('Delivered','Distributed','Completed')) as completed_pickups
    FROM users
    WHERE role = 'volunteer'
    ORDER BY points DESC, completed_pickups DESC
    LIMIT 10
  `).all();

  res.json(volunteers);
});

// Notifications
app.get('/api/notifications', (req, res) => {
  const userId = req.query.user_id || 'user-donor-demo';
  const notifs = db.prepare('SELECT * FROM notifications WHERE recipient_id = ? ORDER BY created_at DESC LIMIT 20').all(userId);
  res.json(notifs);
});

app.patch('/api/notifications/:id/read', (req, res) => {
  db.prepare('UPDATE notifications SET read = 1 WHERE id = ?').run(req.params.id);
  res.json({ message: 'Marked as read' });
});

// Reports & Flagging
app.post('/api/reports', (req, res) => {
  const { reporter_id = 'user-volunteer-demo', donation_id, reason } = req.body;
  if (!reason) return res.status(400).json({ error: 'Reason is required' });

  const id = 'rep-' + Date.now().toString().slice(-6);
  db.prepare('INSERT INTO reports (id, reporter_id, donation_id, reason, status, created_at) VALUES (?, ?, ?, ?, ?, ?)')
    .run(id, reporter_id, donation_id, reason, 'pending', new Date().toISOString());

  res.status(201).json({ message: 'Report submitted for review', report_id: id });
});

app.get('/api/reports', (req, res) => {
  const reports = db.prepare(`
    SELECT r.*, u.name as reporter_name, d.food_name
    FROM reports r
    JOIN users u ON r.reporter_id = u.id
    LEFT JOIN donations d ON r.donation_id = d.id
    ORDER BY r.created_at DESC
  `).all();
  res.json(reports);
});

// Demo Data Reset Endpoint (Instant 1-click restore for hackathon presentations)
app.post('/api/demo/reset', (req, res) => {
  seedDatabase();
  broadcastSse('SYSTEM_RESET', { message: 'Database reset to default demo state' });
  res.json({ message: 'FoodBridge AI demo data successfully restored to fresh hackathon state!' });
});

app.listen(PORT, () => {
  console.log(`🚀 FoodBridge AI Backend running on http://localhost:${PORT}`);
});
