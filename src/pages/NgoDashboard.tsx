import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useDonationStore } from '../store/donationStore';
import { api } from '../lib/api';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Users,
  Utensils,
  Clock,
  ArrowRight,
  Truck,
  Heart,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const NgoDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { donations, fetchDonations, fetchStats } = useDonationStore();

  const [capacity, setCapacity] = useState(250);
  const [dietPref, setDietPref] = useState<'any' | 'veg_only'>('any');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Incoming deliveries that have been delivered to NGO or in transit
  const incoming = donations.filter(
    (d) => d.status === 'Picked Up' || d.status === 'Delivered'
  );

  const distributed = donations.filter(
    (d) => d.status === 'Distributed' || d.status === 'Completed'
  );

  const totalServingsReceived = distributed.reduce((acc, curr) => acc + (curr.servings || 0), 0);

  const handleMarkDistributed = async (donationId: string) => {
    setUpdatingId(donationId);
    try {
      await api.donations.updateStatus(donationId, 'Distributed', 'Meals safely served to community beneficiaries');
      await fetchDonations();
      await fetchStats();
    } catch (err: any) {
      alert(err.message || 'Failed to update distribution status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* NGO Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'}
            alt="NGO Avatar"
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {user?.organization_name || 'Green Hope Foundation'}
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Community Kitchen
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Contact: {user?.name || 'Sister Teresa'} • {user?.address || '77 Compassion Road, Shelter District'}
            </p>
          </div>
        </div>

        {/* Capacity Meter */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 min-w-[220px]">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-slate-600 font-semibold">Today's Intake Capacity</span>
            <span className="font-bold text-slate-900">145 / {capacity} Servings</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: '58%' }}></div>
          </div>
          <span className="text-[10px] text-emerald-700 font-medium mt-1 block">
            ✓ 105 servings available for new incoming food
          </span>
        </div>
      </div>

      {/* INCOMING SHIPMENTS / DELIVERIES */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Incoming Meals & Staging</h2>
            <p className="text-xs text-slate-500">Track shipments arriving via rapid volunteer couriers</p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            {incoming.length} Incoming
          </span>
        </div>

        {incoming.length === 0 ? (
          <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-2xl">
            <Truck className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-1" />
            <p className="text-sm font-semibold text-slate-600">No shipments currently in transit</p>
            <p className="text-xs mt-0.5">Matched donations will appear here once couriers start transit.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {incoming.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900">{item.food_name}</span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded">
                      {item.qty_kg} kg • ~{item.servings} Meals
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Donor: <strong>{item.donor_name}</strong> • Picked up by volunteer courier
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Storage: <strong className="capitalize">{item.storage}</strong> • Status: <span className="text-orange-600 font-bold">{item.status}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/donations/${item.id}`}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100"
                  >
                    View Details
                  </Link>

                  {item.status === 'Delivered' && (
                    <button
                      onClick={() => handleMarkDistributed(item.id)}
                      disabled={updatingId === item.id}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm inline-flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{updatingId === item.id ? 'Updating...' : 'Confirm Distributed to Beneficiaries'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DISTRIBUTION LOG */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Distributed Meals Log</h2>
            <p className="text-xs text-slate-500">Record of food successfully handed over to community members</p>
          </div>
          <div className="text-right">
            <span className="text-xl font-black text-emerald-700">~{totalServingsReceived}</span>
            <span className="text-xs text-slate-500 block">Total Meals Served</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Origin Donor</th>
                <th className="py-3 px-4">Yield</th>
                <th className="py-3 px-4">Distributed At</th>
                <th className="py-3 px-4">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {distributed.slice(0, 5).map((d) => (
                <tr key={d.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-semibold text-slate-900">{d.food_name}</td>
                  <td className="py-3 px-4">{d.donor_name || 'Restaurant'}</td>
                  <td className="py-3 px-4 font-bold text-emerald-700">{d.qty_kg} kg (~{d.servings} meals)</td>
                  <td className="py-3 px-4">{new Date(d.created_at).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-emerald-600 font-semibold">✓ Verified Distributed</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
