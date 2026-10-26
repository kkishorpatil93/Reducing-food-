import { create } from 'zustand';
import { Donation, ImpactStats, ImpactStatsOverview, Notification } from '../types';
import { api } from '../lib/api';

interface DonationState {
  donations: Donation[];
  stats: ImpactStats | null;
  statsOverview: ImpactStatsOverview | null;
  notifications: Notification[];
  isLoading: boolean;
  sseConnected: boolean;
  fetchDonations: (params?: Record<string, string>) => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchNotifications: (userId?: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  resetDemoData: () => Promise<void>;
  setupSse: () => void;
}

export const useDonationStore = create<DonationState>((set, get) => ({
  donations: [],
  stats: null,
  statsOverview: null,
  notifications: [],
  isLoading: false,
  sseConnected: false,

  fetchDonations: async (params?: Record<string, string>) => {
    try {
      set({ isLoading: true });
      const donations = await api.donations.getAll(params);
      set({ donations, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
    }
  },

  fetchStats: async () => {
    try {
      const data = await api.stats.getOverview() as any;
      set({ stats: data.headline, statsOverview: data });
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  },

  fetchNotifications: async (userId?: string) => {
    try {
      const notifs = await api.notifications.getAll(userId);
      set({ notifications: notifs });
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  },

  markNotificationRead: async (id: string) => {
    try {
      await api.notifications.markRead(id);
      set({
        notifications: get().notifications.map((n) =>
          n.id === id ? { ...n, read: 1 } : n
        ),
      });
    } catch (err) {
      console.error('Failed to mark notification read', err);
    }
  },

  resetDemoData: async () => {
    set({ isLoading: true });
    try {
      await api.demo.reset();
      await get().fetchDonations();
      await get().fetchStats();
      await get().fetchNotifications();
      set({ isLoading: false });
    } catch (err) {
      set({ isLoading: false });
    }
  },

  setupSse: () => {
    if (get().sseConnected) return;

    try {
      const eventSource = new EventSource('/api/events');

      eventSource.onopen = () => {
        set({ sseConnected: true });
      };

      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);

          if (parsed.type === 'DONATION_CREATED' || parsed.type === 'PICKUP_ACCEPTED' || parsed.type === 'STATUS_UPDATED') {
            get().fetchDonations();
            get().fetchStats();
            get().fetchNotifications();
          } else if (parsed.type === 'SYSTEM_RESET') {
            get().fetchDonations();
            get().fetchStats();
            get().fetchNotifications();
          }
        } catch (e) {
          console.error('Error parsing SSE data', e);
        }
      };

      eventSource.onerror = () => {
        set({ sseConnected: false });
      };
    } catch (e) {
      console.error('Failed to initialize SSE', e);
    }
  },
}));
