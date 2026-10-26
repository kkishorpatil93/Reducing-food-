import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use DATABASE_PATH from environment variable if defined, otherwise fallback to local foodbridge.db
const dbPath = process.env.DATABASE_PATH
  ? path.resolve(process.env.DATABASE_PATH)
  : path.join(__dirname, 'foodbridge.db');

export const db = new DatabaseSync(dbPath);

// Enable WAL mode for high concurrent read/write performance and enforce foreign keys
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

/**
 * Initializes the database by executing the clean schema.sql file.
 * This guarantees that schema.sql is the single source of truth for all tables.
 */
export function initDatabase() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schemaSql);
  } else {
    console.warn(`[DB WARNING] schema.sql not found at ${schemaPath}`);
  }

  // Ensure default row in impact_stats exists
  const existing = db.prepare('SELECT id FROM impact_stats WHERE id = 1').get();
  if (!existing) {
    db.prepare(`
      INSERT INTO impact_stats (id, total_kg_rescued, total_meals_served, total_pickups, total_volunteers, total_ngos, waste_reduced_tonnes)
      VALUES (1, 2450.0, 8700, 624, 183, 37, 2.45)
    `).run();
  }
}

/**
 * Calculates estimated human meal servings based on weight (kg) and category.
 */
export function calculateServings(qtyKg, category) {
  const kg = parseFloat(qtyKg) || 0;
  let factor = 2.33333333; // Default cooked food: 15 kg gives 35 servings
  const cat = (category || '').toLowerCase();
  if (cat.includes('cooked')) {
    factor = 2.33333333;
  } else if (cat.includes('rice') || cat.includes('grain')) {
    factor = 3.0;
  } else if (cat.includes('bakery') || cat.includes('bread')) {
    factor = 5.0;
  } else if (cat.includes('produce') || cat.includes('fruit') || cat.includes('veg')) {
    factor = 2.5;
  } else if (cat.includes('dairy')) {
    factor = 2.5;
  } else if (cat.includes('packaged')) {
    factor = 2.0;
  }
  return Math.max(1, Math.round(kg * factor));
}

/**
 * Calculates listing urgency based on time remaining until expiry.
 */
export function calculateUrgency(availableUntilIso) {
  if (!availableUntilIso) return 'medium';
  const deadline = new Date(availableUntilIso).getTime();
  const now = Date.now();
  const diffHours = (deadline - now) / (1000 * 60 * 60);
  if (diffHours <= 1) return 'critical';
  if (diffHours <= 2) return 'high';
  if (diffHours <= 4) return 'medium';
  return 'low';
}
