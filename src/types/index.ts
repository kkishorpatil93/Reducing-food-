export type Role = 'donor' | 'volunteer' | 'ngo' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone: string;
  lat: number;
  lng: number;
  address: string;
  verified: number;
  availability?: number;
  max_distance_km?: number;
  points: number;
  badge?: string;
  organization_name?: string;
  avatar_url?: string;
}

export type FoodCategory = 'cooked' | 'bakery' | 'raw_produce' | 'dairy' | 'packaged';
export type DietType = 'veg' | 'non_veg' | 'vegan';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';
export type DonationStatus =
  | 'Created'
  | 'Searching'
  | 'Accepted'
  | 'Picked Up'
  | 'Delivered'
  | 'Distributed'
  | 'Completed'
  | 'Cancelled'
  | 'Expired';

export interface Donation {
  id: string;
  donor_id: string;
  donor_name?: string;
  donor_phone?: string;
  organization_name?: string;
  donor_avatar?: string;
  food_name: string;
  category: FoodCategory;
  diet: DietType;
  qty_kg: number;
  servings: number;
  image_url: string;
  prepared_at: string;
  storage: 'ambient' | 'refrigerated' | 'heated';
  refrigerated: number;
  consume_by: string;
  packaging_intact: number;
  safety_acknowledged: number;
  pickup_address: string;
  landmark?: string;
  lat: number;
  lng: number;
  available_from: string;
  available_until: string;
  contact: string;
  instructions?: string;
  status: DonationStatus;
  urgency: UrgencyLevel;
  created_at: string;
}

export interface Pickup {
  id: string;
  donation_id: string;
  volunteer_id?: string;
  volunteer_name?: string;
  volunteer_phone?: string;
  volunteer_points?: number;
  ngo_id?: string;
  ngo_name?: string;
  ngo_address?: string;
  ngo_phone?: string;
  accepted_at?: string;
  picked_up_at?: string;
  delivered_at?: string;
  distributed_at?: string;
  status: DonationStatus;
  notes?: string;
}

export interface NgoMatch {
  ngo_id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  contact_person: string;
  capacity_servings: number;
  remaining_capacity: number;
  distance_km: number;
  eta_minutes: number;
  match_score: number;
  breakdown: {
    distance: { score: number; max: number; label: string };
    availability: { score: number; max: number; label: string };
    capacity: { score: number; max: number; label: string };
    time_fit: { score: number; max: number; label: string };
    diet_fit: { score: number; max: number; label: string };
    workload: { score: number; max: number; label: string };
  };
}

export interface VolunteerMatch {
  volunteer_id: string;
  name: string;
  phone: string;
  distance_km: number;
  is_available: boolean;
  is_within_range: boolean;
  points: number;
  badge: string;
  match_score: number;
  breakdown: {
    distance: { score: number; max: number; label: string };
    availability: { score: number; max: number; label: string };
    experience: { score: number; max: number; label: string };
    workload: { score: number; max: number; label: string };
  };
}

export interface Notification {
  id: string;
  recipient_id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'urgent';
  link?: string;
  read: number;
  created_at: string;
}

export interface ImpactStats {
  total_kg_rescued: number;
  total_meals_served: number;
  total_pickups: number;
  total_volunteers: number;
  total_ngos: number;
  waste_reduced_tonnes: number;
}

export interface ImpactStatsOverview {
  headline: ImpactStats;
  baseline: {
    kg_rescued: number;
    meals_served: number;
    pickups: number;
    volunteers: number;
    ngos: number;
    waste_reduced_tonnes: number;
  };
  live_session: {
    kg_rescued: number;
    meals_served: number;
    pickups: number;
  };
  weekly: any[];
  categories: any[];
  monthly: any[];
}

