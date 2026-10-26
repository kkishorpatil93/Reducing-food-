import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useDonationStore } from '../store/donationStore';
import { UrgencyBadge } from '../components/UrgencyBadge';
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  Building,
  HeartHandshake,
  Users,
  CheckCircle,
  Truck,
  Sparkles,
  Flame,
  Award,
  ChevronRight,
  MapPin,
  Utensils
} from 'lucide-react';

interface LandingPageProps {
  onOpenQuickDonate?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenQuickDonate }) => {
  const { loginAsDemo } = useAuthStore();
  const { donations, stats } = useDonationStore();
  const navigate = useNavigate();

  const handleStartDonation = async () => {
    await loginAsDemo('donor');
    navigate('/donor?action=new');
  };

  const handleBecomeVolunteer = async () => {
    await loginAsDemo('volunteer');
    navigate('/volunteer');
  };

  const urgentDonations = donations
    .filter((d) => d.status === 'Searching' || d.status === 'Created')
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(#16a34a_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-6 shadow-inner backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Save Food. Connect People. Fight Hunger.</span>
          </div>

          {/* Master Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 font-sans">
            TURN SURPLUS FOOD <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-amber-300">
              INTO HOPE
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            A smart platform connecting surplus food with volunteers and organizations that can help distribute it responsibly.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <button
              onClick={handleStartDonation}
              className="px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base shadow-lg shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <Utensils className="w-5 h-5" />
              <span>Donate Food</span>
            </button>

            <button
              onClick={handleBecomeVolunteer}
              className="px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-base backdrop-blur-sm hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <HeartHandshake className="w-5 h-5 text-emerald-400" />
              <span>Become a Volunteer</span>
            </button>

            <button
              onClick={onOpenQuickDonate}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-base shadow-lg shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <Zap className="w-5 h-5 fill-white" />
              <span>⚡ QUICK DONATION</span>
            </button>
          </div>

          {/* Live Headline Stats Ticker */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
              <span className="block text-2xl sm:text-3xl font-black text-emerald-400">
                {(stats?.total_kg_rescued || 2450).toLocaleString()} kg
              </span>
              <span className="text-xs text-slate-300 font-medium">Food Rescued</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
              <span className="block text-2xl sm:text-3xl font-black text-amber-300">
                {(stats?.total_meals_served || 8700).toLocaleString()}
              </span>
              <span className="text-xs text-slate-300 font-medium">Meals Served</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
              <span className="block text-2xl sm:text-3xl font-black text-blue-300">
                {(stats?.total_pickups || 624).toLocaleString()}
              </span>
              <span className="text-xs text-slate-300 font-medium">Pickups Completed</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
              <span className="block text-2xl sm:text-3xl font-black text-purple-300">
                {(stats?.total_volunteers || 183).toLocaleString()}
              </span>
              <span className="text-xs text-slate-300 font-medium">Active Couriers</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            The FoodBridge Lifecycle
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
            How Surplus Becomes Nourishment
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            A transparent 4-stage pipeline completing food rescue safely in under 45 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Donate',
              subtitle: 'Post Food in 60s',
              desc: 'Caterers and restaurants enter surplus quantity. Automatic calculation shows exact meal equivalents (15 kg → ~35 meals).',
              icon: Utensils,
              color: 'border-emerald-200 bg-emerald-50/50 text-emerald-700'
            },
            {
              step: '02',
              title: 'Match',
              subtitle: 'Smart Algorithm Pairs',
              desc: 'Transparent 6-factor algorithm ranks verified NGOs by distance, capacity, urgency, and diet compatibility.',
              icon: Sparkles,
              color: 'border-amber-200 bg-amber-50/50 text-amber-700'
            },
            {
              step: '03',
              title: 'Pick Up',
              subtitle: 'Verified Couriers Transit',
              desc: 'Nearby student or civic volunteers receive live push notifications, accept pickup, and navigate swiftly.',
              icon: Truck,
              color: 'border-blue-200 bg-blue-50/50 text-blue-700'
            },
            {
              step: '04',
              title: 'Distribute',
              subtitle: 'Hot Meals Served',
              desc: 'Shelters receive verified food packages and log distribution to community members with dignity.',
              icon: CheckCircle,
              color: 'border-purple-200 bg-purple-50/50 text-purple-700'
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg mb-4 border ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-black text-slate-400 block mb-1">STAGE {item.step}</span>
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                <h4 className="text-xs font-semibold text-emerald-600 mb-2">{item.subtitle}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* LIVE URGENT DONATIONS SECTION */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-500 animate-pulse" />
                <h2 className="text-2xl font-bold text-slate-900">Urgent Food Rescues Nearby</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Food items requiring immediate volunteer pickup before expiration window closes
              </p>
            </div>

            <Link
              to="/donations"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800"
            >
              <span>View All 20+ Donations</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {urgentDonations.map((d) => (
              <div
                key={d.id}
                className="bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative h-44 overflow-hidden bg-slate-200">
                  <img
                    src={d.image_url}
                    alt={d.food_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-3 left-3">
                    <UrgencyBadge urgency={d.urgency} availableUntil={d.available_until} />
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-xl font-bold">
                    {d.qty_kg} kg • ~{d.servings} meals
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      {d.category} • {d.diet}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-2 line-clamp-1">{d.food_name}</h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{d.pickup_address}</span>
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">
                      {d.donor_name || 'Restaurant Donor'}
                    </span>

                    <Link
                      to={`/donations/${d.id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors"
                    >
                      View & Accept
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-emerald-900 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Ready to Rescue Meals on Campus & Citywide?
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 mb-8 max-w-xl mx-auto">
            Join 180+ volunteers and 37 partner NGOs making sure safe, edible food feeds families instead of landfills.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleStartDonation}
              className="px-8 py-3.5 rounded-2xl bg-white text-emerald-950 font-black text-sm sm:text-base shadow-lg hover:bg-emerald-50 transition-colors"
            >
              Post Food Donation Now
            </button>
            <button
              onClick={handleBecomeVolunteer}
              className="px-8 py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-600 font-bold text-sm sm:text-base transition-colors"
            >
              Volunteer as a Courier
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
