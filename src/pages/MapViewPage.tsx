import React, { useState, useEffect } from 'react';
import { useDonationStore } from '../store/donationStore';
import { Donation } from '../types';
import { UrgencyBadge } from '../components/UrgencyBadge';
import { api } from '../lib/api';
import {
  MapPin,
  Layers,
  Flame,
  Check,
  Building,
  HeartHandshake,
  Navigation,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MapViewPage: React.FC = () => {
  const { donations, fetchDonations } = useDonationStore();
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [zones, setZones] = useState<any[]>([]);

  useEffect(() => {
    fetchDonations();
    api.stats.getHeatmap().then(setZones).catch(console.error);
  }, []);

  const activeDonations = donations.filter(d => !['Completed', 'Cancelled', 'Expired'].includes(d.status));

  // Map markers: Donors, NGOs, Volunteers
  const mockNgos = [
    { id: 'ngo-1', name: 'Green Hope Foundation', lat: 12.9650, lng: 77.5890, address: '77 Compassion Road', type: 'ngo' },
    { id: 'ngo-2', name: 'Seva Hunger Kitchen', lat: 12.9740, lng: 77.6050, address: '108 Annapoorna Way', type: 'ngo' },
    { id: 'ngo-3', name: 'Nurture Child Shelter', lat: 12.9810, lng: 77.5920, address: '21 Blossom Avenue', type: 'ngo' },
  ];

  const mockVolunteers = [
    { id: 'vol-1', name: 'Aarav Sharma (You)', lat: 12.9780, lng: 77.5990, badge: 'Food Champion', type: 'volunteer' },
    { id: 'vol-2', name: 'Rahul Verma', lat: 12.9720, lng: 77.5960, badge: 'FoodBridge Legend', type: 'volunteer' },
    { id: 'vol-3', name: 'Ananya Sen', lat: 12.9760, lng: 77.6020, badge: 'FoodBridge Legend', type: 'volunteer' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Interactive Rescue Map & Waste Heatmap
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time geospatial distribution of surplus food, nearby verified NGOs, and active couriers
          </p>
        </div>

        {/* Legend & Heatmap Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-sm ${
              showHeatmap
                ? 'bg-orange-600 text-white ring-2 ring-orange-400'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Flame className="w-4 h-4 text-orange-400" />
            <span>{showHeatmap ? 'Heatmap Overlay: Active' : 'Toggle Waste Heatmap'}</span>
          </button>
        </div>
      </div>

      {/* Map Legend Pills */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">
        <span className="text-slate-400 uppercase tracking-wider text-[10px]">Legend:</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></span>
          <span>📍 Surplus Food (Donor)</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></span>
          <span>🟢 Available Volunteer</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-600 shadow-sm"></span>
          <span>🔵 Verified NGO Shelter</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-orange-500 animate-pulse shadow-sm"></span>
          <span>🟠 Active In-Transit</span>
        </span>
      </div>

      {/* Main Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map Visual (Styled SVG Mock Fallback + Pin Network) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl overflow-hidden relative min-h-[480px] shadow-lg border border-slate-800">
          {/* Stylized Grid & City Roads Canvas */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="#0f172a" />
            <rect width="100%" height="100%" fill="url(#grid)" opacity="0.6" />

            {/* City Arterial Roads */}
            <path d="M 0 160 Q 250 140 500 240 T 1000 200" fill="none" stroke="#334155" strokeWidth="6" opacity="0.4" />
            <path d="M 180 0 Q 220 200 300 500" fill="none" stroke="#334155" strokeWidth="5" opacity="0.4" />
            <path d="M 450 0 Q 420 260 600 500" fill="none" stroke="#334155" strokeWidth="5" opacity="0.4" />
            <path d="M 0 350 Q 300 320 800 420" fill="none" stroke="#334155" strokeWidth="4" opacity="0.3" />

            {/* Heatmap Layer Circles (if active) */}
            {showHeatmap && (
              <>
                <circle cx="280" cy="220" r="110" fill="#ef4444" opacity="0.25" filter="blur(18px)" />
                <circle cx="480" cy="180" r="140" fill="#f97316" opacity="0.22" filter="blur(22px)" />
                <circle cx="620" cy="310" r="100" fill="#eab308" opacity="0.20" filter="blur(16px)" />
              </>
            )}
          </svg>

          {/* Interactive Marker Pins */}
          <div className="absolute inset-0 p-6 pointer-events-auto">
            {/* NGO Pins */}
            {mockNgos.map((ngo, idx) => {
              const positions = [
                { top: '38%', left: '32%' },
                { top: '55%', left: '58%' },
                { top: '22%', left: '46%' },
              ];
              const pos = positions[idx % positions.length];
              return (
                <button
                  key={ngo.id}
                  style={pos}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer"
                  title={`${ngo.name} (Verified NGO)`}
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 border-2 border-white group-hover:scale-125 transition-transform">
                    <Building className="w-4 h-4" />
                  </div>
                  <span className="absolute top-9 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {ngo.name}
                  </span>
                </button>
              );
            })}

            {/* Volunteer Pins */}
            {mockVolunteers.map((vol, idx) => {
              const positions = [
                { top: '42%', left: '48%' },
                { top: '65%', left: '38%' },
                { top: '30%', left: '62%' },
              ];
              const pos = positions[idx % positions.length];
              return (
                <button
                  key={vol.id}
                  style={pos}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer"
                  title={`${vol.name} (Volunteer Courier)`}
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 border-2 border-white group-hover:scale-125 transition-transform">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <span className="absolute top-9 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {vol.name}
                  </span>
                </button>
              );
            })}

            {/* Surplus Donations Pins */}
            {activeDonations.slice(0, 6).map((d, idx) => {
              const positions = [
                { top: '48%', left: '40%' },
                { top: '32%', left: '26%' },
                { top: '68%', left: '65%' },
                { top: '25%', left: '68%' },
                { top: '75%', left: '30%' },
                { top: '52%', left: '72%' },
              ];
              const pos = positions[idx % positions.length];
              const isSelected = selectedDonation?.id === d.id;
              const isUrgent = d.urgency === 'critical';

              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDonation(d)}
                  style={pos}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-30 cursor-pointer"
                >
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-white shadow-xl transition-all ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-300 scale-125'
                        : isUrgent
                        ? 'bg-red-600 animate-pulse ring-2 ring-red-400'
                        : 'bg-emerald-600 hover:scale-115'
                    }`}
                  >
                    <MapPin className="w-5 h-5 fill-current" />
                  </div>
                  <span className="absolute top-10 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow whitespace-nowrap border border-slate-700">
                    {d.qty_kg} kg • ~{d.servings} meals
                  </span>
                </button>
              );
            })}
          </div>

          {/* Offline / Scalable Fallback Notice */}
          <div className="absolute bottom-4 left-4 z-30 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-[11px] text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Live Geospatial GPS Sync • Hackathon Offline-Resilient SVG Engine</span>
          </div>
        </div>

        {/* Selected Donation / NGO / Volunteer Detail Slide-Over Panel */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          {selectedDonation ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <UrgencyBadge urgency={selectedDonation.urgency} availableUntil={selectedDonation.available_until} />
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Status: {selectedDonation.status}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedDonation.food_name}</h3>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded block w-fit mt-1">
                  {selectedDonation.category} • {selectedDonation.diet}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 py-2 border-y border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block">Quantity</span>
                  <span className="text-base font-bold text-slate-900">{selectedDonation.qty_kg} KG</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Meal Yield</span>
                  <span className="text-base font-bold text-emerald-600">~{selectedDonation.servings} Meals</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <p className="flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{selectedDonation.pickup_address}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Available until {new Date(selectedDonation.available_until).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to={`/donations/${selectedDonation.id}`}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Open Full Details & Accept</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 space-y-3">
              <MapPin className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
              <h4 className="text-sm font-bold text-slate-700">Interactive Map Pins Active</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Click any 📍 Surplus pin, 🔵 NGO pin, or 🟢 Courier pin on the map to preview live logistics, intake capacities, or transit status.
              </p>
              {activeDonations.length > 0 && (
                <button
                  onClick={() => setSelectedDonation(activeDonations[0])}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
                >
                  Inspect Nearest Surplus Item
                </button>
              )}
            </div>
          )}

          {/* Volunteer Positioning Hotspot Tips */}
          {showHeatmap && (
            <div className="mt-6 pt-4 border-t border-slate-100 bg-orange-50/60 p-4 rounded-2xl border border-orange-100">
              <span className="text-xs font-bold text-orange-950 flex items-center gap-1.5 mb-1">
                <Flame className="w-4 h-4 text-orange-600" />
                <span>Smart Volunteer Positioning Tip</span>
              </span>
              <p className="text-[11px] text-orange-800 leading-relaxed">
                Central Restaurant District peaks at 9:30 PM. 3 volunteer couriers stationed near Central Square can rescue up to 90 kg surplus within 20 minutes!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
