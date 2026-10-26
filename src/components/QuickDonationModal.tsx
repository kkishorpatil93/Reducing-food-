import React, { useState } from 'react';
import { api } from '../lib/api';
import { calculateServings, getLiveUrgency } from '../lib/utils';
import { useDonationStore } from '../store/donationStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  X,
  MapPin,
  Clock,
  Phone,
  ShieldAlert,
  Sparkles,
  Utensils
} from 'lucide-react';

interface QuickDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickDonationModal: React.FC<QuickDonationModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const { fetchDonations, fetchStats } = useDonationStore();
  const navigate = useNavigate();

  const [foodName, setFoodName] = useState('Hot Lunch Buffet Surplus (Rice, Paneer Curry & Naan)');
  const [category, setCategory] = useState<'cooked' | 'bakery' | 'raw_produce'>('cooked');
  const [qtyKg, setQtyKg] = useState<number>(15);
  const [location, setLocation] = useState('142 Riverside Ave, Central District (Back Loading Dock)');
  const [deadlineMinutes, setDeadlineMinutes] = useState(120);
  const [contact, setContact] = useState(user?.phone || '+1-555-0101');
  const [safetyAccepted, setSafetyAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const servings = calculateServings(qtyKg, category);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!safetyAccepted) {
      setError('You must confirm the food safety declaration before posting.');
      return;
    }

    setSubmitting(true);
    try {
      const availableUntil = new Date(Date.now() + deadlineMinutes * 60 * 1000).toISOString();
      const payload = {
        donor_id: user?.id || 'user-donor-demo',
        food_name: foodName,
        category,
        diet: 'veg',
        qty_kg: qtyKg,
        storage: 'refrigerated',
        refrigerated: 1,
        packaging_intact: 1,
        safety_acknowledged: 1,
        prepared_at: new Date(Date.now() - 3600 * 1000).toISOString(),
        consume_by: availableUntil,
        pickup_address: location,
        landmark: 'Opposite Central Station',
        available_from: new Date().toISOString(),
        available_until: availableUntil,
        contact,
        instructions: '⚡ Quick Donation - Priority urgent pickup requested.',
      };

      const result = await api.donations.create(payload);
      await fetchDonations();
      await fetchStats();
      onClose();
      navigate(`/donations/${result.donation.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to submit quick donation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Zap className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">⚡ Quick Food Donation</h3>
              <p className="text-[11px] text-amber-100">Post urgent surplus in under 60 seconds</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-slate-700 font-bold mb-1">Food Item Name *</label>
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-900"
              >
                <option value="cooked">Cooked Food (~2.33x)</option>
                <option value="bakery">Bakery / Bread (~5.0x)</option>
                <option value="raw_produce">Raw Produce (~2.5x)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Quantity (KG) *</label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={qtyKg}
                  onChange={(e) => setQtyKg(parseFloat(e.target.value) || 0)}
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 text-slate-900 font-bold"
                />
                <span className="absolute right-3 top-3 text-slate-400 font-bold text-xs">KG</span>
              </div>
            </div>
          </div>

          {/* Real-time Serving Highlight */}
          <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-between">
            <span className="text-orange-900 font-semibold text-xs">Estimated Community Impact:</span>
            <span className="text-orange-950 font-black text-sm">~{servings} Nutritious Meals</span>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Pickup Location *</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Expires In *</label>
              <select
                value={deadlineMinutes}
                onChange={(e) => setDeadlineMinutes(parseInt(e.target.value))}
                className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-900"
              >
                <option value={45}>45 Minutes (Critical Alert)</option>
                <option value={90}>1.5 Hours (High Urgency)</option>
                <option value={180}>3 Hours (Medium)</option>
                <option value={300}>5 Hours (Low)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Contact Phone *</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 text-slate-900"
              />
            </div>
          </div>

          {/* Mandatory Safety Checkbox */}
          <div className="p-3 rounded-xl border-2 border-red-200 bg-red-50 text-red-900 text-xs">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={safetyAccepted}
                onChange={(e) => setSafetyAccepted(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded border-red-300 mt-0.5"
              />
              <span className="font-semibold leading-tight">
                "Only donate food that is safe, properly stored, and suitable for consumption. The donor remains responsible for food safety."
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>{submitting ? 'Broadcasting...' : 'ACTIVATE QUICK RESCUE & MATCH'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
