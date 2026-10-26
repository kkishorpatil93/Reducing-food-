import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useDonationStore } from '../store/donationStore';
import { Role } from '../types';
import { Sparkles, RotateCcw, User, ShieldCheck, HeartHandshake, Building2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DemoBanner: React.FC = () => {
  const { user, loginAsDemo, isLoading } = useAuthStore();
  const { resetDemoData } = useDonationStore();
  const navigate = useNavigate();
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleDemoSwitch = async (role: Role, route: string) => {
    await loginAsDemo(role);
    navigate(route);
  };

  const handleReset = async () => {
    if (confirm('Restore FoodBridge demo data to fresh hackathon baseline?')) {
      setResetting(true);
      await resetDemoData();
      setResetting(false);
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  const roles: { role: Role; label: string; icon: any; route: string; color: string }[] = [
    { role: 'donor', label: 'Donor Demo (Restaurant)', icon: Building2, route: '/donor', color: 'hover:bg-emerald-600 hover:text-white' },
    { role: 'volunteer', label: 'Volunteer Demo (Courier)', icon: HeartHandshake, route: '/volunteer', color: 'hover:bg-blue-600 hover:text-white' },
    { role: 'ngo', label: 'NGO Demo (Food Bank)', icon: User, route: '/ngo', color: 'hover:bg-amber-600 hover:text-white' },
    { role: 'admin', label: 'Admin Demo (Operations)', icon: ShieldCheck, route: '/admin', color: 'hover:bg-purple-600 hover:text-white' },
  ];

  return (
    <div className="bg-slate-900 text-white text-xs px-3 sm:px-6 py-2 border-b border-slate-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Hackathon Judge Badge & Current Role */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>HACKATHON DEMO BAR</span>
          </span>
          <span className="hidden md:inline text-slate-400">
            Current: <strong className="text-white capitalize">{user?.role || 'Guest'}</strong> ({user?.name || 'Loading'})
          </span>
        </div>

        {/* Center: 1-Click Role Switcher */}
        <div className="flex flex-wrap items-center gap-1.5">
          {roles.map((item) => {
            const Icon = item.icon;
            const isActive = user?.role === item.role;
            return (
              <button
                key={item.role}
                onClick={() => handleDemoSwitch(item.role, item.route)}
                disabled={isLoading}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                    : 'bg-slate-800 text-slate-300 hover:text-white ' + item.color
                }`}
                title={`Switch to ${item.label}`}
              >
                <Icon className="w-3 h-3" />
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden capitalize">{item.role}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Reset Demo Data */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            disabled={resetting}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-800 transition-colors"
            title="Reset donations, volunteers, and stats to clean initial seed data"
          >
            {resetSuccess ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Reset Complete!</span>
              </>
            ) : (
              <>
                <RotateCcw className={`w-3 h-3 ${resetting ? 'animate-spin text-amber-400' : ''}`} />
                <span>{resetting ? 'Resetting...' : 'Reset Demo Data'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
