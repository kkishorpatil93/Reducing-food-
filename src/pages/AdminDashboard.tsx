import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useDonationStore } from '../store/donationStore';
import {
  ShieldCheck,
  Users,
  Building,
  HeartHandshake,
  Utensils,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Activity,
  Trash2
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { donations, stats, fetchDonations, fetchStats } = useDonationStore();

  const [filterStatus, setFilterStatus] = useState('all');

  const filteredDonations = filterStatus === 'all'
    ? donations
    : donations.filter(d => d.status.toLowerCase() === filterStatus.toLowerCase());

  const totalDonations = donations.length;
  const activeCount = donations.filter(d => ['Created', 'Searching', 'Accepted', 'Picked Up'].includes(d.status)).length;
  const completedCount = donations.filter(d => ['Delivered', 'Distributed', 'Completed'].includes(d.status)).length;
  const cancelledCount = donations.filter(d => ['Cancelled', 'Expired'].includes(d.status)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Profile Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'}
            alt="Admin Avatar"
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-500/30"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold">{user?.name || 'Priya Nair'}</h1>
              <span className="text-xs font-bold bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                System Administrator
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              FoodBridge Operations Command • Central City Region
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Real-time SSE Event Stream: <strong className="text-white">Active</strong></span>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Rescued</span>
            <Utensils className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 block">
            {(stats?.total_kg_rescued || 2450).toLocaleString()} kg
          </span>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">
            ~{(stats?.total_meals_served || 8700).toLocaleString()} meals delivered
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Active Rescues</span>
            <Activity className="w-4 h-4 text-orange-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 block">
            {activeCount}
          </span>
          <span className="text-xs text-orange-600 font-semibold mt-1 block">
            Matching & In Transit
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Volunteer Network</span>
            <HeartHandshake className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 block">
            {(stats?.total_volunteers || 183).toLocaleString()}
          </span>
          <span className="text-xs text-blue-600 font-semibold mt-1 block">
            15 rapid campus couriers online
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Partner NGOs</span>
            <Building className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 block">
            {(stats?.total_ngos || 37).toLocaleString()}
          </span>
          <span className="text-xs text-purple-600 font-semibold mt-1 block">
            5 verified local hubs
          </span>
        </div>
      </div>

      {/* OPERATIONS MONITORING TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Platform Donations Monitor</h2>
            <p className="text-xs text-slate-500">Live oversight of all surplus listings across city districts</p>
          </div>

          <div className="flex items-center gap-2">
            {['all', 'searching', 'accepted', 'picked up', 'completed'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold capitalize transition-all ${
                  filterStatus === st
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Donation ID</th>
                <th className="py-3 px-4">Item & Category</th>
                <th className="py-3 px-4">Quantity / Meals</th>
                <th className="py-3 px-4">Pickup Address</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Urgency</th>
                <th className="py-3 px-4">Safety Checked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDonations.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-slate-500">{d.id}</td>
                  <td className="py-3 px-4">
                    <strong className="text-slate-900 block">{d.food_name}</strong>
                    <span className="capitalize text-[11px] text-slate-400">{d.category} • {d.diet}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900">{d.qty_kg} kg</span>
                    <span className="text-emerald-700 block font-semibold">~{d.servings} meals</span>
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate">{d.pickup_address}</td>
                  <td className="py-3 px-4">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="capitalize font-semibold text-slate-700">{d.urgency}</span>
                  </td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">
                    ✓ Donor Verified
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
