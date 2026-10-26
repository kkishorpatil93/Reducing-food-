import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Home, Layers, MapPin, User, Zap } from 'lucide-react';

interface MobileBottomNavProps {
  onOpenQuickDonate: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenQuickDonate }) => {
  const { user } = useAuthStore();
  const location = useLocation();

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

  const dashboardPath = getDashboardPath();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around">
        <Link
          to="/"
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-bold ${
            location.pathname === '/' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </Link>

        <Link
          to="/donations"
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-bold ${
            location.pathname.startsWith('/donations') ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers className="w-5 h-5 mb-0.5" />
          <span>Browse</span>
        </Link>

        {/* Center Quick Donate Button */}
        <button
          onClick={onOpenQuickDonate}
          className="flex flex-col items-center -mt-4"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/40 ring-4 ring-white">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <span className="text-[10px] font-extrabold text-orange-600 mt-0.5">Quick</span>
        </button>

        <Link
          to="/map"
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-bold ${
            location.pathname === '/map' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <MapPin className="w-5 h-5 mb-0.5" />
          <span>Map</span>
        </Link>

        <Link
          to={dashboardPath}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-bold ${
            location.pathname === dashboardPath ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="capitalize">{user?.role || 'Dashboard'}</span>
        </Link>
      </div>
    </div>
  );
};
