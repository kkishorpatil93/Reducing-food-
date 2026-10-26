import React, { useState, useEffect } from 'react';
import { useDonationStore } from '../store/donationStore';
import { UrgencyBadge } from '../components/UrgencyBadge';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  Utensils,
  Layers,
  ArrowRight,
  Flame,
  CheckCircle2
} from 'lucide-react';

export const BrowseDonationsPage: React.FC = () => {
  const { donations, fetchDonations, isLoading } = useDonationStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [selectedDiet, setSelectedDiet] = useState('all');

  useEffect(() => {
    fetchDonations();
  }, []);

  const filtered = donations.filter((d) => {
    const matchesSearch =
      d.food_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.pickup_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.donor_name && d.donor_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || d.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesUrgency = selectedUrgency === 'all' || d.urgency === selectedUrgency;
    const matchesDiet = selectedDiet === 'all' || d.diet === selectedDiet;

    return matchesSearch && matchesCategory && matchesStatus && matchesUrgency && matchesDiet;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Browse Surplus Food Donations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time feed of available surplus food from campus messes, restaurants, and caterers
          </p>
        </div>

        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
          {filtered.length} Items Listed
        </span>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by food dish, area, or donor name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 text-sm text-slate-900"
          />
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium"
            >
              <option value="all">All Categories</option>
              <option value="cooked">Cooked Food</option>
              <option value="bakery">Bakery & Bread</option>
              <option value="raw_produce">Raw Produce</option>
              <option value="dairy">Dairy Products</option>
              <option value="packaged">Packaged</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="searching">Searching (Open)</option>
              <option value="accepted">Accepted</option>
              <option value="picked up">In Transit</option>
              <option value="delivered">Delivered to NGO</option>
              <option value="distributed">Distributed</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">Urgency</label>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium"
            >
              <option value="all">All Urgency Levels</option>
              <option value="critical">Critical (&lt; 1h)</option>
              <option value="high">High (1-2h)</option>
              <option value="medium">Medium (2-4h)</option>
              <option value="low">Low (&gt; 4h)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">Diet</label>
            <select
              value={selectedDiet}
              onChange={(e) => setSelectedDiet(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium"
            >
              <option value="all">All Diets</option>
              <option value="veg">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="non_veg">Non-Vegetarian</option>
            </select>
          </div>
        </div>
        {/* Reset Filter Button */}
        {(searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' || selectedUrgency !== 'all' || selectedDiet !== 'all') && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedStatus('all');
                setSelectedUrgency('all');
                setSelectedDiet('all');
              }}
              className="text-xs font-bold text-red-600 hover:text-red-800 underline"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Empty State when no donations match filters */}
      {filtered.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-3">
          <Utensils className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
          <h3 className="text-base font-bold text-slate-800">No Food Donations Match Your Filter Criteria</h3>
          <p className="text-xs text-slate-500">
            Try adjusting your search keywords, category selection, or urgency level.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedStatus('all');
              setSelectedUrgency('all');
              setSelectedDiet('all');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
          >
            Clear Filters & View All
          </button>
        </div>
      )}

      {/* Donations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((d) => (
          <div
            key={d.id}
            className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={d.image_url}
                  alt={d.food_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <UrgencyBadge urgency={d.urgency} availableUntil={d.available_until} />
                </div>
                <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-xl font-bold">
                  {d.qty_kg} kg • ~{d.servings} meals
                </div>
              </div>

              <div className="p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  {d.category} • {d.diet}
                </span>

                <h3 className="font-bold text-slate-900 text-base mt-2 line-clamp-1">
                  {d.food_name}
                </h3>

                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{d.pickup_address}</span>
                </p>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                  <span>Donor: <strong>{d.donor_name || 'Restaurant'}</strong></span>
                  <span className="font-bold text-emerald-700">{d.status}</span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-slate-100 mt-2">
              <Link
                to={`/donations/${d.id}`}
                className="w-full mt-3 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Details & Matches</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
