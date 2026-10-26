import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useDonationStore } from '../store/donationStore';
import { NotificationDrawer } from './NotificationDrawer';
import {
  UtensilsCrossed,
  Bell,
  Menu,
  X,
  Zap,
  MapPin,
  BarChart3,
  HelpCircle,
  Shield,
  Layers,
  Award
} from 'lucide-react';

interface NavbarProps {
  onOpenQuickDonate?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenQuickDonate }) => {
  const { user } = useAuthStore();
  const { notifications } = useDonationStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navLinks = [
    { name: 'Browse Donations', path: '/donations', icon: Layers },
    { name: 'Rescue Map', path: '/map', icon: MapPin },
    { name: 'Impact Dashboard', path: '/impact', icon: BarChart3 },
    { name: 'Leaderboard', path: '/leaderboard', icon: Award },
    { name: 'How It Works', path: '/how-it-works', icon: HelpCircle },
    { name: 'Trust & Safety', path: '/trust', icon: Shield },
  ];

  const getDashboardPath = () => {
    if (!user) return '/donor';
    switch (user.role) {
      case 'volunteer':
        return '/volunteer';
      case 'ngo':
        return '/ngo';
      case 'admin':
        return '/admin';
      default:
        return '/donor';
    }
  };

  return (
    <>
      <header className="sticky top-[37px] z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-bold tracking-tight text-slate-900 font-sans">
                      FoodBridge<span className="text-emerald-600">AI</span>
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                      Demo
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 hidden sm:block">Smart Food Rescue & Redistribution</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      isActive
                        ? 'text-emerald-600 bg-emerald-50 font-semibold'
                        : 'hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Quick Donation Button */}
              <button
                onClick={onOpenQuickDonate}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 transition-all transform active:scale-95"
                title="Post urgent food donation in 60 seconds"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>⚡ QUICK DONATION</span>
              </button>

              {/* Notification Bell */}
              <button
                onClick={() => setNotifDrawerOpen(true)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                title="View live notifications"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dashboard Pill */}
              <Link
                to={getDashboardPath()}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-colors"
              >
                <span className="hidden sm:inline">My</span>
                <span className="capitalize">{user?.role || 'Donor'}</span>
                <span>Dashboard</span>
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-600" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Slide-over Notifications */}
      <NotificationDrawer
        isOpen={notifDrawerOpen}
        onClose={() => setNotifDrawerOpen(false)}
      />
    </>
  );
};
