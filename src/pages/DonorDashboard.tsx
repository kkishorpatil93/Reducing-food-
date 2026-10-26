import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useDonationStore } from '../store/donationStore';
import { DonationWizard } from '../components/DonationWizard';
import { UrgencyBadge } from '../components/UrgencyBadge';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Utensils,
  PlusCircle,
  Building,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export const DonorDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { donations, fetchDonations } = useDonationStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showWizard, setShowWizard] = useState(searchParams.get('action') === 'new');
  const [createdSuccess, setCreatedSuccess] = useState<any | null>(null);

  const donorDonations = donations.filter(
    (d) => d.donor_id === (user?.id || 'user-donor-demo')
  );

  const activeDonations = donorDonations.filter(
    (d) => !['Completed', 'Cancelled', 'Expired'].includes(d.status)
  );

  const completedDonations = donorDonations.filter(
    (d) => ['Completed', 'Distributed'].includes(d.status)
  );

  const totalKg = donorDonations.reduce((acc, curr) => acc + (curr.qty_kg || 0), 0);
  const totalMeals = donorDonations.reduce((acc, curr) => acc + (curr.servings || 0), 0);

  const handleWizardSuccess = (newDonation: any) => {
    setShowWizard(false);
    setCreatedSuccess(newDonation);
    fetchDonations();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Donor Profile Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80'}
            alt="Donor Avatar"
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{user?.name || 'Chef Marco Rossi'}</h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Donor
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {user?.organization_name || 'Bella Vista Restaurant'} • {user?.address || '142 Riverside Ave, Central District'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setShowWizard(true);
            setCreatedSuccess(null);
          }}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-md shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Post New Donation</span>
        </button>
      </div>

      {/* Impact Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-5">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">Total Food Rescued</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-950">{totalKg}</span>
            <span className="text-emerald-700 font-bold">KG</span>
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">Surplus diverted from landfill</span>
        </div>

        <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-5">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Community Meals Served</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-950">~{totalMeals}</span>
            <span className="text-amber-700 font-bold">Meals</span>
          </div>
          <span className="text-[11px] text-amber-600 mt-1 block">Calculated via category multipliers</span>
        </div>

        <div className="bg-blue-50/80 border border-blue-200 rounded-3xl p-5">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">Estimated CO2 Averted</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-950">{(totalKg * 2.5).toFixed(1)}</span>
            <span className="text-blue-700 font-bold">KG CO2e</span>
          </div>
          <span className="text-[11px] text-blue-600 mt-1 block">Based on 2.5 kg CO2e per kg food saved</span>
        </div>
      </div>

      {/* SUCCESS MODAL / BANNER */}
      {createdSuccess && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h3 className="font-extrabold text-lg">Donation Published & Matching Activated!</h3>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1">
              "{createdSuccess.food_name}" ({createdSuccess.qty_kg} kg • ~{createdSuccess.servings} meals) is now live in the system.
            </p>
          </div>

          <Link
            to={`/donations/${createdSuccess.id}`}
            className="px-5 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs sm:text-sm shadow-md hover:bg-emerald-50 transition-colors"
          >
            View Smart Matches & Tracking →
          </Link>
        </div>
      )}

      {/* WIZARD MODAL / VIEW */}
      {showWizard && (
        <div className="my-6">
          <DonationWizard
            onSuccess={handleWizardSuccess}
            onCancel={() => setShowWizard(false)}
          />
        </div>
      )}

      {/* ACTIVE DONATIONS */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Active Surplus Donations</h2>
            <p className="text-xs text-slate-500">Live donations currently matching or in transit</p>
          </div>
          <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
            {activeDonations.length} Active
          </span>
        </div>

        {activeDonations.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Utensils className="w-12 h-12 mx-auto stroke-1 mb-2" />
            <p className="text-sm font-semibold text-slate-600">No active donations right now</p>
            <p className="text-xs mt-1">Click "Post New Donation" to create a new food rescue request.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeDonations.map((d) => (
              <div
                key={d.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all bg-slate-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <UrgencyBadge urgency={d.urgency} availableUntil={d.available_until} />
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Status: {d.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">{d.food_name}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="font-bold text-slate-700">{d.qty_kg} kg</span>
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

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Posted: {new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <Link
                    to={`/donations/${d.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <span>Track & Matches</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* COMPLETED DONATIONS HISTORY */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Past Rescues & Certificates</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Meals</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {completedDonations.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-semibold text-slate-900">{d.food_name}</td>
                  <td className="py-3 px-4">{d.qty_kg} kg</td>
                  <td className="py-3 px-4 text-emerald-700 font-bold">~{d.servings}</td>
                  <td className="py-3 px-4">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{new Date(d.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
