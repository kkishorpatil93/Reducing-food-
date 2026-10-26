import React from 'react'
import { Award, Shield, Sparkles, Sprout, Heart, Flame } from 'lucide-react'

export default function ImpactBadges({ mealsSaved = 0, co2Saved = 0 }) {
  const allBadges = [
    {
      id: 'first_rescue',
      title: 'First Rescue',
      desc: 'Completed your first donation or food claim',
      icon: Sprout,
      unlocked: true,
      color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300',
    },
    {
      id: 'bronze_rescuer',
      title: 'Bronze Rescuer',
      desc: 'Saved over 100 wholesome meals',
      icon: Award,
      unlocked: mealsSaved >= 100 || true,
      color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300',
    },
    {
      id: 'co2_champion',
      title: 'CO2 Champion',
      desc: 'Prevented over 500 kg of greenhouse gases',
      icon: Sparkles,
      unlocked: co2Saved >= 500 || true,
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300',
    },
    {
      id: 'community_guardian',
      title: 'Community Pillar',
      desc: 'Maintained a 4.8+ rating across 10+ pickups',
      icon: Heart,
      unlocked: true,
      color: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300',
    },
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Impact Badges &amp; Achievements (UI Only)
        </h4>
        <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400">
          4 / 4 Unlocked
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {allBadges.map((badge) => {
          const Icon = badge.icon
          return (
            <div
              key={badge.id}
              className={`p-3 rounded-2xl border flex flex-col items-center text-center space-y-1.5 transition-transform hover:-translate-y-0.5 ${badge.color}`}
            >
              <div className="p-2 rounded-xl bg-white/80 dark:bg-black/20 shadow-xs">
                <Icon className="w-5 h-5" />
              </div>
              <h5 className="font-heading font-bold text-xs">{badge.title}</h5>
              <p className="text-[10px] opacity-80 leading-tight">{badge.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
