import React from 'react';
import { UtensilsCrossed, Shield, Heart, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                FoodBridge<span className="text-emerald-400">AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed">
              "Save Food. Connect People. Fight Hunger."
              A smart platform connecting surplus food with volunteers and organizations that can help distribute it responsibly.
            </p>
            {/* Mandatory Safety Notice */}
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs text-slate-300 flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p>
                <strong>Food Safety Notice:</strong> Only donate food that is safe, properly stored, and suitable for consumption. The donor remains responsible for food safety.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/donations" className="hover:text-emerald-400 transition-colors">Browse Surplus Food</Link></li>
              <li><Link to="/map" className="hover:text-emerald-400 transition-colors">Rescue Map & Hotspots</Link></li>
              <li><Link to="/impact" className="hover:text-emerald-400 transition-colors">Impact Analytics</Link></li>
              <li><Link to="/leaderboard" className="hover:text-emerald-400 transition-colors">Volunteer Leaderboard</Link></li>
              <li><Link to="/how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</Link></li>
            </ul>
          </div>

          {/* Governance & Ethics */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Ethics & Transparency</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/trust" className="hover:text-emerald-400 transition-colors">Food Safety Guidelines</Link></li>
              <li><span className="text-slate-400">Smart Matching Algorithm (Deterministic)</span></li>
              <li><span className="text-slate-400">Fictional Demo Environment</span></li>
              <li><span className="text-slate-400">Verified NGO Network</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 FoodBridge AI. Built for College Hackathon Excellence.</p>
          <p className="flex items-center gap-1 text-slate-400">
            <span>Engineered with passion for social impact</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
