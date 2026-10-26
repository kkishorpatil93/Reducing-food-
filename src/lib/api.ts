import { Donation, DonationStatus, ImpactStats, NgoMatch, Notification, User, VolunteerMatch } from '../types';

const BASE_URL = '/api';

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('foodbridge_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API Request failed');
  }

  return data;
}

export const api = {
  auth: {
    demoLogin: (role: 'donor' | 'volunteer' | 'ngo' | 'admin') =>
      request<{ token: string; user: User }>(`/auth/demo/${role}`, { method: 'POST' }),
    login: (email: string, password?: string) =>
      request<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    me: () => request<{ user: User }>('/auth/me'),
  },

  donations: {
    getAll: (params?: Record<string, string>) => {
      const query = params ? new URLSearchParams(params).toString() : '';
      return request<Donation[]>(`/donations${query ? `?${query}` : ''}`);
    },
    getById: (id: string) =>
      request<{ donation: Donation; pickup: any }>(`/donations/${id}`),
    create: (donationData: any) =>
      request<{ message: string; donation: Donation; servings: number; urgency: string }>(
        '/donations',
        {
          method: 'POST',
          body: JSON.stringify(donationData),
        }
      ),
    getMatches: (id: string) =>
      request<{
        algorithm: string;
        donation_id: string;
        servings: number;
        ngos: NgoMatch[];
        volunteers: VolunteerMatch[];
      }>(`/donations/${id}/matches`),
    updateStatus: (id: string, status: DonationStatus, notes?: string) =>
      request<{ message: string; status: DonationStatus; donation_id: string; pickup_id?: string }>(
        `/donations/${id}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status, notes }),
        }
      ),
    cancel: (id: string) =>
      request<{ message: string; status: string; donation_id: string }>(
        `/donations/${id}/cancel`,
        { method: 'PATCH' }
      ),
  },

  pickups: {
    accept: (donation_id: string, volunteer_id?: string, ngo_id?: string) =>
      request<{ message: string; pickup_id: string; status: string }>('/pickups/accept', {
        method: 'POST',
        body: JSON.stringify({ donation_id, volunteer_id, ngo_id }),
      }),
    updateStatus: (pickup_id: string, status: DonationStatus, notes?: string) =>
      request<{ message: string; status: DonationStatus; pickup_id: string; donation_id: string }>(
        `/pickups/${pickup_id}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status, notes }),
        }
      ),
  },

  stats: {
    getOverview: () =>
      request<{
        headline: ImpactStats;
        weekly: any[];
        categories: any[];
        monthly: any[];
      }>('/stats'),
    getHeatmap: () => request<any[]>('/stats/heatmap'),
    getLeaderboard: () => request<User[]>('/leaderboard'),
  },

  notifications: {
    getAll: (userId?: string) =>
      request<Notification[]>(`/notifications${userId ? `?user_id=${userId}` : ''}`),
    markRead: (id: string) =>
      request<{ message: string }>(`/notifications/${id}/read`, { method: 'PATCH' }),
  },

  demo: {
    reset: () => request<{ message: string }>('/demo/reset', { method: 'POST' }),
  },
};
