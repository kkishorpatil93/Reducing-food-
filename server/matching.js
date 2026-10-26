// Smart Matching Algorithm (Rule-based 6-Factor Haversine Scoring Engine)
// Honest Labeling: This is a transparent mathematical scoring algorithm, not generative AI.

/**
 * Calculates Haversine distance in kilometers between two lat/lng coordinates.
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

/**
 * Evaluates match score (0-100%) between a donation and candidate NGOs and Volunteers.
 * Factor weights:
 * - Distance: 30%
 * - Availability: 20%
 * - Capacity vs Servings: 20%
 * - Time to Pickup vs Urgency: 15%
 * - Food Type / Diet Fit: 10%
 * - Workload: 5%
 */
export function calculateNgoMatch(donation, ngo) {
  const distanceKm = calculateDistanceKm(donation.lat, donation.lng, ngo.lat, ngo.lng);
  
  // 1. Distance (30 pts max): Linear degradation up to 20 km
  const maxDistanceThresholdKm = 20;
  const distanceScore = Math.max(0, Math.round(30 * (1 - Math.min(distanceKm, maxDistanceThresholdKm) / maxDistanceThresholdKm)));

  // 2. Availability (20 pts max): Verified NGOs active in operating hours
  const availabilityScore = ngo.verified ? 20 : 10;

  // 3. Capacity vs Servings (20 pts max): Remaining capacity
  const remainingCapacity = Math.max(0, (ngo.capacity_servings || 200) - (ngo.current_servings || 0));
  let capacityScore = 0;
  if (remainingCapacity >= donation.servings) {
    capacityScore = 20;
  } else if (remainingCapacity > 0) {
    capacityScore = Math.round(20 * (remainingCapacity / donation.servings));
  } else {
    capacityScore = 5; // Can still accept with expedited distribution
  }

  // 4. Time to Pickup (15 pts max): NGO responsiveness & distance buffer
  const etaMinutes = Math.round(distanceKm * 4); // ~15 km/h urban speed estimate
  const deadlineHours = (new Date(donation.available_until).getTime() - Date.now()) / (1000 * 60 * 60);
  let timeScore = 15;
  if (deadlineHours < 1) {
    timeScore = etaMinutes < 30 ? 15 : 8;
  } else if (deadlineHours < 2) {
    timeScore = etaMinutes < 60 ? 15 : 10;
  }

  // 5. Food-Type / Diet Fit (10 pts max)
  let dietScore = 10;
  if (ngo.diet_preference === 'veg_only' && donation.diet === 'non_veg') {
    dietScore = 0; // Strict incompatibility
  } else if (ngo.diet_preference === 'vegan' && donation.diet !== 'vegan') {
    dietScore = 0;
  }

  // 6. Workload Balance (5 pts max)
  const workloadRatio = (ngo.current_servings || 0) / (ngo.capacity_servings || 200);
  const workloadScore = Math.round(5 * (1 - Math.min(1, workloadRatio)));

  const totalScore = Math.min(100, distanceScore + availabilityScore + capacityScore + timeScore + dietScore + workloadScore);

  return {
    ngo_id: ngo.id,
    name: ngo.name,
    address: ngo.address,
    lat: ngo.lat,
    lng: ngo.lng,
    phone: ngo.phone,
    contact_person: ngo.contact_person,
    capacity_servings: ngo.capacity_servings,
    remaining_capacity: remainingCapacity,
    distance_km: distanceKm,
    eta_minutes: etaMinutes,
    match_score: totalScore,
    breakdown: {
      distance: { score: distanceScore, max: 30, label: `${distanceKm} km away` },
      availability: { score: availabilityScore, max: 20, label: ngo.verified ? 'Verified & Open' : 'Pending Verification' },
      capacity: { score: capacityScore, max: 20, label: `${remainingCapacity} servings available` },
      time_fit: { score: timeScore, max: 15, label: `ETA ~${etaMinutes} mins` },
      diet_fit: { score: dietScore, max: 10, label: dietScore > 0 ? 'Diet Compatible' : 'Incompatible Diet' },
      workload: { score: workloadScore, max: 5, label: `${Math.round(workloadRatio * 100)}% Current Load` },
    }
  };
}

export function rankNgoMatches(donation, ngosList) {
  const evaluated = ngosList
    .map(ngo => calculateNgoMatch(donation, ngo))
    .filter(m => m.breakdown.diet_fit.score > 0) // Filter out strict diet mismatches
    .sort((a, b) => b.match_score - a.match_score);

  return evaluated.slice(0, 5);
}

export function rankVolunteerMatches(donation, volunteersList) {
  return volunteersList
    .map(v => {
      const distanceKm = calculateDistanceKm(donation.lat, donation.lng, v.lat, v.lng);
      const isWithinRange = distanceKm <= (v.max_distance_km || 15);
      const distScore = Math.max(0, Math.round(40 * (1 - Math.min(distanceKm, 20) / 20)));
      const availScore = v.availability ? 30 : 0;
      const experienceScore = Math.min(20, Math.round((v.points || 0) / 20));
      const workloadScore = 10;
      const totalScore = Math.min(100, distScore + availScore + experienceScore + workloadScore);

      return {
        volunteer_id: v.id,
        name: v.name,
        phone: v.phone,
        distance_km: distanceKm,
        is_available: !!v.availability,
        is_within_range: isWithinRange,
        points: v.points,
        badge: v.badge,
        match_score: totalScore,
        breakdown: {
          distance: { score: distScore, max: 40, label: `${distanceKm} km away` },
          availability: { score: availScore, max: 30, label: v.availability ? 'Active Now' : 'Offline' },
          experience: { score: experienceScore, max: 20, label: `${v.badge} (${v.points} pts)` },
          workload: { score: workloadScore, max: 10, label: 'Ready for assignment' }
        }
      };
    })
    .filter(v => v.is_available)
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 5);
}
