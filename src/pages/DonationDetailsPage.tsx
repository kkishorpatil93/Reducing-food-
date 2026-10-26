import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Donation, Pickup } from '../types';
import { UrgencyBadge } from '../components/UrgencyBadge';
import { TimelineStepper } from '../components/TimelineStepper';
import { SmartMatchPanel } from '../components/SmartMatchPanel';
import { useAuthStore } from '../store/authStore';
import {
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  Building,
  CheckCircle2,
  ArrowLeft,
  Truck,
  Sparkles,
  Info
} from 'lucide-react';

export const DonationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [donation, setDonation] = useState<Donation | null>(null);
  const [pickup, setPickup] = useState<Pickup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await api.donations.getById(id);
      setDonation(data.donation);
      setPickup(data.pickup);
    } catch (err: any) {
      setError(err.message || 'Failed to load donation details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent mb-3"></div>
        <p className="text-sm font-semibold text-slate-700">Loading donation details & tracking timeline...</p>
      </div>
    );
  }

  if (error || !donation) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-base font-bold text-red-600 mb-2">{error || 'Donation not found'}</p>
        <Link to="/donations" className="text-sm text-emerald-600 font-semibold hover:underline">
          ← Back to All Donations
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="relative h-64 sm:h-80 w-full bg-slate-900">
          <img
            src={donation.image_url}
            alt={donation.food_name}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

          <div className="absolute top-4 left-4">
            <UrgencyBadge urgency={donation.urgency} availableUntil={donation.available_until} size="lg" />
          </div>

          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/80 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                {donation.category} • {donation.diet}
              </span>
              <span className="text-xs font-bold bg-white/20 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                Status: {donation.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">{donation.food_name}</h1>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 border-b border-slate-200">
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-500 block">Surplus Weight</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900">{donation.qty_kg} KG</span>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase text-slate-500 block">Estimated Meals</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-600">~{donation.servings} Meals</span>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase text-slate-500 block">Storage State</span>
            <span className="text-sm font-bold text-slate-800 capitalize mt-1 block">{donation.storage}</span>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase text-slate-500 block">Food Safety</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-1">
              ✓ Donor Acknowledged
            </span>
          </div>
        </div>

        {/* Address & Logistics Info */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Pickup Logistics</span>
              <p className="text-sm font-semibold text-slate-900 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{donation.pickup_address}</span>
              </p>
              {donation.landmark && (
                <p className="text-xs text-slate-500 pl-6">Landmark: {donation.landmark}</p>
              )}
              {donation.instructions && (
                <p className="text-xs text-slate-600 pl-6 italic">"{donation.instructions}"</p>
              )}
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Donor & Contact</span>
              <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{donation.donor_name || 'Restaurant Donor'} ({donation.organization_name || 'Donor Org'})</span>
              </p>
              <p className="text-xs text-slate-600 flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>Phone: <strong>{donation.donor_phone}</strong></span>
              </p>
              <p className="text-[11px] text-slate-400">
                Prepared: {new Date(donation.prepared_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Available until {new Date(donation.available_until).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Timeline Stepper */}
      <TimelineStepper status={donation.status} pickup={pickup} />

      {/* Interactive Lifecycle Control Bar for Hackathon Demo */}
      <div className="bg-white rounded-3xl border-2 border-emerald-500/30 p-6 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Redistribution Lifecycle Action Bar
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">Advance Rescue Status Live</h3>
            <p className="text-xs text-slate-500">
              Current state: <strong className="text-emerald-700 capitalize">{donation.status}</strong> • Click below to progress the donation through the cycle
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Current Role:</span>
            <span className="text-xs font-bold uppercase bg-slate-900 text-white px-2.5 py-1 rounded-lg">
              {user?.role || 'Guest'}
            </span>
          </div>
        </div>

        {/* Action Buttons depending on status */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
          {(donation.status === 'Created' || donation.status === 'Searching') && (
            <>
              <button
                onClick={async () => {
                  await api.pickups.accept(donation.id, user?.id || 'user-volunteer-demo', 'ngo-1');
                  await loadData();
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Accept Pickup (Volunteer)</span>
              </button>

              <button
                onClick={async () => {
                  if (confirm('Are you sure you want to cancel this donation?')) {
                    await api.donations.cancel(donation.id);
                    await loadData();
                  }
                }}
                className="px-4 py-2.5 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 font-bold text-xs sm:text-sm transition-colors"
              >
                <span>Cancel Donation</span>
              </button>
            </>
          )}

          {donation.status === 'Accepted' && (
            <button
              onClick={async () => {
                await api.donations.updateStatus(donation.id, 'Picked Up', 'Courier collected food from kitchen dock');
                await loadData();
              }}
              className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>Confirm Food Picked Up (In Transit)</span>
            </button>
          )}

          {donation.status === 'Picked Up' && (
            <button
              onClick={async () => {
                await api.donations.updateStatus(donation.id, 'Delivered', 'Safely arrived at shelter kitchen');
                await loadData();
              }}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Delivered to NGO Shelter (+10 pts)</span>
            </button>
          )}

          {donation.status === 'Delivered' && (
            <button
              onClick={async () => {
                await api.donations.updateStatus(donation.id, 'Distributed', `Served ~${donation.servings} meals to community beneficiaries`);
                await loadData();
              }}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Confirm Distributed to Beneficiaries (~{donation.servings} Meals)</span>
            </button>
          )}

          {donation.status === 'Distributed' && (
            <button
              onClick={async () => {
                await api.donations.updateStatus(donation.id, 'Completed', 'Rescue cycle fully completed and verified');
                await loadData();
              }}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Mark Lifecycle Completed</span>
            </button>
          )}

          {donation.status === 'Completed' && (
            <div className="p-4 w-full rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-sm">
                  Full Rescue Cycle Completed! {donation.qty_kg} kg rescued & ~{donation.servings} meals distributed.
                </span>
              </div>
              <Link
                to="/impact"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
              >
                View Updated Impact Dashboard →
              </Link>
            </div>
          )}

          {donation.status === 'Cancelled' && (
            <div className="p-3 w-full rounded-xl bg-red-50 text-red-800 font-bold text-xs">
              This donation listing has been cancelled.
            </div>
          )}
        </div>
      </div>

      {/* Smart Match Panel (If not yet completed) */}
      {donation.status !== 'Completed' && (
        <SmartMatchPanel
          donationId={donation.id}
          onPickupAccepted={loadData}
          canAccept={user?.role === 'volunteer' || user?.role === 'ngo' || user?.role === 'admin'}
        />
      )}
    </div>
  );
};
