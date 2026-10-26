import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { User } from '../types';
import { Award, Trophy, Medal, Star, Flame, HeartHandshake, CheckCircle2 } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const [volunteers, setVolunteers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const data = await api.stats.getLeaderboard();
        setVolunteers(data);
      } catch (err) {
        console.error('Failed to load leaderboard', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadLeaderboard();
  }, []);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-amber-500 fill-amber-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-400 fill-slate-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-700 fill-amber-600" />;
    return <span className="font-bold text-slate-400 text-sm">#{rank}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
          Gamification & Recognition
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
          Volunteer Hero Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Recognizing the dedicated couriers rescuing surplus food and nourishing communities daily.
        </p>
      </div>

      {/* Badges System Showcase */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-600" />
          <span>Courier Milestone Badges</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: 'Food Saver', req: '5+ Pickups', desc: 'First rescue badge', color: 'border-emerald-200 bg-emerald-50 text-emerald-800' },
            { name: 'Community Hero', req: '25+ Pickups', desc: 'Active neighbourhood courier', color: 'border-blue-200 bg-blue-50 text-blue-800' },
            { name: 'Food Champion', req: '50+ Pickups', desc: 'Regional delivery pillar', color: 'border-purple-200 bg-purple-50 text-purple-800' },
            { name: 'FoodBridge Legend', req: '100+ Pickups', desc: 'Top tier community impact', color: 'border-amber-300 bg-amber-50 text-amber-900' },
          ].map((b) => (
            <div key={b.name} className={`p-4 rounded-2xl border text-center ${b.color}`}>
              <Award className="w-7 h-7 mx-auto mb-2" />
              <h4 className="font-bold text-xs sm:text-sm">{b.name}</h4>
              <span className="text-[11px] font-extrabold block text-emerald-700 mt-0.5">{b.req}</span>
              <p className="text-[10px] text-slate-500 mt-1">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">Top Rescuers This Season</h3>
          <span className="text-xs text-slate-500">+10 Points per verified pickup</span>
        </div>

        <div className="divide-y divide-slate-100">
          {volunteers.map((vol, idx) => {
            const rank = idx + 1;
            return (
              <div
                key={vol.id}
                className={`p-4 sm:p-5 flex items-center justify-between gap-4 transition-colors ${
                  rank <= 3 ? 'bg-amber-50/20 hover:bg-amber-50/40' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 text-center flex items-center justify-center">
                    {getRankBadge(rank)}
                  </div>

                  <img
                    src={vol.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={vol.name}
                    className="w-11 h-11 rounded-2xl object-cover ring-2 ring-slate-100"
                  />

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">{vol.name}</h4>
                    <span className="text-xs text-slate-500 block">
                      {vol.organization_name || 'Independent Courier'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div className="hidden sm:block">
                    <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                      {vol.badge || 'Food Saver'}
                    </span>
                  </div>

                  <div>
                    <span className="text-base sm:text-lg font-black text-emerald-700 block">
                      {vol.points} pts
                    </span>
                    <span className="text-[11px] text-slate-400 block">Points</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
