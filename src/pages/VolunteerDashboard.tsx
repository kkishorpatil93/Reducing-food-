import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useDonationStore } from '../store/donationStore';
import { UrgencyBadge } from '../components/UrgencyBadge';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';
import {
  HeartHandshake,
  CheckCircle2,
  Navigation,
  Clock,
  MapPin,
  Award,
  Sliders,
  Check,
  Truck,
  Flame,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const VolunteerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { donations, fetchDonations, fetchStats } = useDonationStore();

  const [isAvailable, setIsAvailable] = useState(true);
  const [maxDistance, setMaxDistance] = useState(15);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filter donations available for volunteer pickup
  const openDonations = donations.filter(
    (d) => d.status === 'Searching' || d.status === 'Created'
  );

  // Active pickups in transit or accepted
  const activeDonations = donations.filter(
    (d) => d.status === 'Accepted' || d.status === 'Picked Up'
  );

  const handleAccept = async (donationId: string) => {
    setActionInProgress(true);
    try {
      await api.pickups.accept(donationId, user?.id || 'user-volunteer-demo', 'ngo-1');
      setSuccessMessage('Pickup Accepted! Navigation coordinates activated.');
      await fetchDonations();
      await fetchStats();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to accept pickup');
    } finally {
      setActionInProgress(false);
    }
  };

  const handleUpdateStatus = async (donationId: string, newStatus: any) => {
    setActionInProgress(true);
    try {
      await api.donations.updateStatus(donationId, newStatus, 'Status advanced by volunteer courier');
      setSuccessMessage(`Status updated to: ${newStatus}`);
      await fetchDonations();
      await fetchStats();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to update pickup status');
    } finally {
      setActionInProgress(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Volunteer Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt="Volunteer Avatar"
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{user?.name || 'Aarav Sharma'}</h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                <Award className="w-3.5 h-3.5" /> {user?.badge || 'Food Champion'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Verified Rapid Courier • {user?.address || 'Metro Heights, North Wing'}
            </p>
          </div>
        </div>

        {/* Availability & Radius Controls */}
        <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-11 h-6 rounded-full transition-colors relative ${
                isAvailable ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  isAvailable ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              ></div>
            </div>
            <span className="text-xs font-bold text-slate-800">
              {isAvailable ? 'Online (Ready)' : 'Offline'}
            </span>
          </label>

          <div className="h-4 w-px bg-slate-300"></div>

          <div className="flex items-center gap-2 text-xs">
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-600 font-medium">Max Radius:</span>
            <span className="font-bold text-slate-900">{maxDistance} km</span>
            <input
              type="range"
              min="1"
              max="25"
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseInt(e.target.value))}
              className="w-20 accent-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-amber-300" />
            <span>{successMessage}</span>
          </div>
          <span className="text-xs font-normal opacity-80">Database Updated Live</span>
        </div>
      )}

      {/* ACTIVE RESCUE IN PROGRESS */}
      {activeDonations.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-6 h-6 text-orange-600 animate-bounce" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Active Rescue Assignment</h2>
            </div>
            <span className="text-xs font-black uppercase tracking-wider bg-orange-200 text-orange-900 px-3 py-1 rounded-full">
              In Progress
            </span>
          </div>

          {activeDonations.map((active) => (
            <div
              key={active.id}
              className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-lg">{active.food_name}</span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {active.qty_kg} kg • ~{active.servings} meals
                  </span>
                </div>
                <p className="text-xs text-slate-600 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <strong>Pickup:</strong> {active.pickup_address}
                </p>
                <p className="text-xs text-slate-600 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <strong>Current Status:</strong> <span className="text-orange-600 font-bold">{active.status}</span>
                </p>
                {active.donor_phone && (
                  <p className="text-xs text-emerald-700 font-medium">
                    📞 Donor Contact: <strong>{active.donor_phone}</strong> (revealed for courier navigation)
                  </p>
                )}
              </div>

              {/* Sequential Action Workflow */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(active.pickup_address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 inline-flex items-center gap-1.5"
                >
                  <Navigation className="w-4 h-4 text-blue-600" />
                  <span>Open Navigation</span>
                </a>

                {active.status === 'Accepted' && (
                  <button
                    onClick={() => handleUpdateStatus(active.id, 'Picked Up')}
                    disabled={actionInProgress}
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs shadow-md transition-colors"
                  >
                    Confirm Food Picked Up
                  </button>
                )}

                {active.status === 'Picked Up' && (
                  <button
                    onClick={() => handleUpdateStatus(active.id, 'Delivered')}
                    disabled={actionInProgress}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-colors"
                  >
                    Confirm Delivered to NGO (+10 pts)
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NEARBY DONATIONS RANKED BY MATCH */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Nearby Rescue Requests</h2>
            <p className="text-xs text-slate-500">
              Ranked by distance, expiration deadline, and courier route proximity
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            {openDonations.length} Available
          </span>
        </div>

        {openDonations.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <HeartHandshake className="w-12 h-12 mx-auto stroke-1 mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">All nearby food currently assigned</p>
            <p className="text-xs mt-1">Stay tuned! SSE push notifications will sound when a donor posts.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {openDonations.map((d) => (
              <div
                key={d.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all bg-slate-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <UrgencyBadge urgency={d.urgency} availableUntil={d.available_until} />
                    <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      ~1.4 km away
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">{d.food_name}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="font-bold text-slate-800">{d.qty_kg} kg</span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-700">~{d.servings} meals</span>
                    <span>•</span>
                    <span className="capitalize">{d.diet}</span>
                  </div>

                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{d.pickup_address}</span>
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <Link
                    to={`/donations/${d.id}`}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    View Details
                  </Link>

                  <button
                    onClick={() => handleAccept(d.id)}
                    disabled={actionInProgress}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors inline-flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept Pickup</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* VOLUNTEER GAMIFICATION & BADGES */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Your Volunteer Badges & Milestones</h2>
          <Link to="/leaderboard" className="text-xs font-bold text-emerald-700 hover:underline">
            View Community Leaderboard →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'Food Saver', req: '5+ pickups', unlocked: true, color: 'border-emerald-300 bg-emerald-50 text-emerald-800' },
            { name: 'Community Hero', req: '25+ pickups', unlocked: true, color: 'border-blue-300 bg-blue-50 text-blue-800' },
            { name: 'Food Champion', req: '50+ pickups', unlocked: true, color: 'border-purple-300 bg-purple-50 text-purple-800' },
            { name: 'FoodBridge Legend', req: '100+ pickups', unlocked: false, color: 'border-slate-200 bg-slate-50 text-slate-400' },
          ].map((b) => (
            <div key={b.name} className={`p-4 rounded-2xl border text-center ${b.color}`}>
              <Award className="w-6 h-6 mx-auto mb-1.5" />
              <h4 className="font-bold text-xs">{b.name}</h4>
              <span className="text-[10px] block opacity-80">{b.req}</span>
              <span className="text-[10px] font-extrabold uppercase mt-1 block">
                {b.unlocked ? '✓ Unlocked' : 'In Progress'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
