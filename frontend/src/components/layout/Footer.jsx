import React from 'react'
import { Link } from 'react-router-dom'
import { Sprout, Heart, ShieldCheck, Globe, Sparkles } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-charcoal-dark border-t border-brand-100 dark:border-gray-800 text-charcoal dark:text-cream-50 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-sm">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-heading font-extrabold text-xl tracking-tight">
                FoodSave<span className="text-brand-600 dark:text-brand-400">AI</span>
              </span>
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Empowering local businesses, restaurants, and compassionate volunteers to rescue edible surplus food before it is wasted.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-3 py-1.5 rounded-xl border border-brand-100 dark:border-brand-900/60 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-accent-500" />
              <span>AI-Powered Local Routing</span>
            </div>
          </div>

          {/* Rescue & Donate */}
          <div className="space-y-3">
            <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-gray-900 dark:text-cream-100">
              For Participants
            </h4>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <li>
                <Link to="/browse" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Browse Surplus Food
                </Link>
              </li>
              <li>
                <Link to="/donor/add" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Donate Food as Restaurant
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Register as an NGO / Receiver
                </Link>
              </li>
              <li>
                <Link to="/statistics" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Platform Impact Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Food Safety & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-gray-900 dark:text-cream-100">
              Safety & Standards
            </h4>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                <span>Good Samaritan Food Act</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                <span>Cold-Chain & Expiry Rules</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                <span>Verified Non-Profits Only</span>
              </li>
            </ul>
          </div>

          {/* Live Community Impact summary */}
          <div className="space-y-3 bg-cream-50 dark:bg-charcoal rounded-2xl p-4 border border-brand-100 dark:border-gray-800">
            <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-brand-800 dark:text-brand-300">
              Collective Impact (Sample)
            </h4>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 bg-white dark:bg-charcoal-dark rounded-xl shadow-xs">
                <span className="block text-base font-extrabold text-brand-600">14,250+</span>
                <span className="text-[10px] text-gray-500">Meals Rescued</span>
              </div>
              <div className="p-2 bg-white dark:bg-charcoal-dark rounded-xl shadow-xs">
                <span className="block text-base font-extrabold text-accent-500">15.3 t</span>
                <span className="text-[10px] text-gray-500">CO2 Avoided</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 text-center">
              Real-time synchronization with local partners
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 dark:border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} FoodSave AI Platform. Built with care for our planet and communities.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-accent-600 dark:text-accent-400">
              <Heart className="w-3.5 h-3.5 fill-current" /> Zero Waste Initiative
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
