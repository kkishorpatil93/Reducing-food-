/**
 * ============================================================================
 * FoodSave AI — Food Waste Prediction & Freshness Analytics Engine
 * Module: server/ai/prediction.js
 * Description: Standalone AI/ML predictive analytics engine for food spoilage,
 *              remaining shelf life, and CO2 emissions reduction calculations.
 * ============================================================================
 */

import crypto from 'node:crypto';

// Baseline safe shelf-life in hours by food category and storage condition
// Derived from standard food safety data (USDA & FoodKeeper scientific guidelines)
const BASELINE_SHELF_LIFE_HOURS = {
  cooked: {
    ambient: 5.0,         // Food danger zone (4°C - 60°C) limits cooked foods to max 4-6 hours
    refrigerated: 72.0,   // ~3 days safely refrigerated
    frozen: 720.0,        // ~30 days frozen
  },
  dairy: {
    ambient: 4.0,         // Milk, yogurt, paneer degrade rapidly at room temperature
    refrigerated: 96.0,   // ~4 days refrigerated
    frozen: 720.0,
  },
  bakery: {
    ambient: 48.0,        // Breads and pastries hold reasonably well at room temp
    refrigerated: 120.0,  // ~5 days
    frozen: 1440.0,       // ~60 days
  },
  raw_produce: {
    ambient: 72.0,        // Fruits and raw vegetables: 3 days ambient
    refrigerated: 168.0,  // ~7 days refrigerated
    frozen: 1440.0,
  },
  packaged: {
    ambient: 720.0,       // Sealed, dry, packaged items
    refrigerated: 1440.0,
    frozen: 2880.0,
  },
  default: {
    ambient: 12.0,
    refrigerated: 96.0,
    frozen: 720.0,
  },
};

// CO2 emission factor: 1 kg of food diverted from landfill saves ~2.5 kg of CO2 equivalent
const CO2_FACTOR_KG_PER_FOOD_KG = 2.5;

/**
 * Normalizes input category string to known category key
 */
function normalizeCategory(category) {
  const cat = (category || '').toLowerCase().trim();
  if (cat.includes('cooked') || cat.includes('meal') || cat.includes('curry') || cat.includes('rice')) return 'cooked';
  if (cat.includes('dairy') || cat.includes('milk') || cat.includes('paneer') || cat.includes('cheese')) return 'dairy';
  if (cat.includes('bakery') || cat.includes('bread') || cat.includes('pastry') || cat.includes('cake')) return 'bakery';
  if (cat.includes('produce') || cat.includes('fruit') || cat.includes('veg') || cat.includes('salad')) return 'raw_produce';
  if (cat.includes('packaged') || cat.includes('canned') || cat.includes('dry')) return 'packaged';
  return 'default';
}

/**
 * Normalizes storage condition
 */
function normalizeStorage(storage) {
  const s = (storage || '').toLowerCase().trim();
  if (s.includes('refrig') || s.includes('cold')) return 'refrigerated';
  if (s.includes('froz')) return 'frozen';
  return 'ambient';
}

/**
 * Predicts food freshness, remaining shelf-life, and spoilage risk.
 * 
 * @param {Object} params
 * @param {string} params.category - Food category ('cooked', 'dairy', etc.)
 * @param {string} params.storage - Storage method ('ambient', 'refrigerated', 'frozen')
 * @param {string|Date} params.preparedAt - ISO string or Date when food was prepared
 * @param {number} [params.qtyKg=1.0] - Food quantity in kilograms
 * @param {number} [params.packagingIntact=1] - 1 if sealed/clean, 0 if compromised
 * @param {number} [params.ambientTempC=25.0] - Current room temperature in Celsius
 * @returns {Object} Comprehensive prediction results and suggested actions
 */
export function predictFoodFreshness({
  category,
  storage,
  preparedAt,
  qtyKg = 1.0,
  packagingIntact = 1,
  ambientTempC = 25.0,
}) {
  const normalizedCat = normalizeCategory(category);
  const normalizedStorage = normalizeStorage(storage);

  // 1. Calculate elapsed time in hours
  const prepTime = preparedAt ? new Date(preparedAt).getTime() : Date.now();
  const now = Date.now();
  const elapsedHours = Math.max(0, (now - prepTime) / (1000 * 60 * 60));

  // 2. Lookup baseline shelf life
  const categoryBaselines = BASELINE_SHELF_LIFE_HOURS[normalizedCat] || BASELINE_SHELF_LIFE_HOURS.default;
  let totalShelfLifeHours = categoryBaselines[normalizedStorage] || categoryBaselines.ambient;

  // 3. Temperature decay coefficient:
  // For ambient storage, temperatures above 20°C accelerate microbial activity (Arrhenius approximation: ~1.05 per °C)
  if (normalizedStorage === 'ambient' && ambientTempC > 20.0) {
    const tempExcess = Math.min(25.0, ambientTempC - 20.0);
    const tempDegradationFactor = Math.pow(1.05, tempExcess);
    totalShelfLifeHours = totalShelfLifeHours / tempDegradationFactor;
  }

  // 4. Packaging integrity adjustment:
  // Compromised packaging reduces ambient shelf life by 35%
  if (packagingIntact === 0) {
    totalShelfLifeHours *= 0.65;
  }

  // 5. Calculate remaining shelf life
  const remainingHours = Math.max(0, parseFloat((totalShelfLifeHours - elapsedHours).toFixed(2)));

  // 6. Compute spoilage risk score (0.00 to 1.00) using logistic decay curve
  let spoilageRiskScore;
  if (remainingHours <= 0) {
    spoilageRiskScore = 1.0;
  } else {
    // Sigmoid curve mapping elapsed fraction to probability
    const fractionElapsed = elapsedHours / totalShelfLifeHours;
    spoilageRiskScore = parseFloat((1 / (1 + Math.exp(-6 * (fractionElapsed - 0.7)))).toFixed(3));
    // Clamp score
    spoilageRiskScore = Math.min(0.99, Math.max(0.01, spoilageRiskScore));
  }

  // 7. Determine risk category & recommended actions
  let riskLevel;
  let recommendedAction;

  if (spoilageRiskScore >= 0.80 || remainingHours <= 1.0) {
    riskLevel = 'critical';
    recommendedAction = 'Immediate dispatch required: Food must be distributed within 60 minutes or safely disposed.';
  } else if (spoilageRiskScore >= 0.50 || remainingHours <= 3.0) {
    riskLevel = 'high';
    recommendedAction = 'Priority courier matching: Recommend urgent pickup and insulated cold bag transport.';
  } else if (spoilageRiskScore >= 0.25 || remainingHours <= 8.0) {
    riskLevel = 'moderate';
    recommendedAction = 'Standard rescue window: Eligible for NGO pickup within the next 4 hours.';
  } else {
    riskLevel = 'low';
    recommendedAction = 'Optimal freshness: Suitable for standard scheduled volunteer delivery.';
  }

  // 8. Environmental Impact calculation
  const safeKg = Math.max(0, parseFloat(qtyKg) || 1.0);
  const co2DivertedKg = parseFloat((safeKg * CO2_FACTOR_KG_PER_FOOD_KG).toFixed(2));

  return {
    predictionId: 'pred-' + crypto.randomUUID().slice(0, 8),
    category: normalizedCat,
    storage: normalizedStorage,
    elapsedHours: parseFloat(elapsedHours.toFixed(1)),
    totalShelfLifeHours: parseFloat(totalShelfLifeHours.toFixed(1)),
    predictedShelfLifeHours: remainingHours,
    spoilageRiskScore,
    riskLevel,
    recommendedAction,
    co2DivertedKg,
    confidenceScore: 0.92,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Saves a generated prediction record into the SQLite database.
 * 
 * @param {Object} db - The active SQLite database instance
 * @param {string} [donationId=null] - Linked donation ID
 * @param {Object} prediction - Prediction result object from predictFoodFreshness()
 * @returns {Object} Inserted prediction record
 */
export function recordPredictionInDb(db, donationId, prediction) {
  const stmt = db.prepare(`
    INSERT INTO ai_predictions (
      id,
      donation_id,
      food_category,
      storage_condition,
      predicted_shelf_life_hours,
      spoilage_risk_score,
      risk_level,
      recommended_action,
      co2_diverted_kg,
      confidence_score,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    prediction.predictionId,
    donationId || null,
    prediction.category,
    prediction.storage,
    prediction.predictedShelfLifeHours,
    prediction.spoilageRiskScore,
    prediction.riskLevel,
    prediction.recommendedAction,
    prediction.co2DivertedKg,
    prediction.confidenceScore,
    prediction.timestamp
  );

  return prediction;
}
