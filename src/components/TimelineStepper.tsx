import React from 'react';
import { DonationStatus } from '../types';
import { Check, Clock, Truck, Home, Sparkles, CheckCircle2 } from 'lucide-react';

interface TimelineStepperProps {
  status: DonationStatus;
  pickup?: any;
}

export const TimelineStepper: React.FC<TimelineStepperProps> = ({ status, pickup }) => {
  const steps: { key: DonationStatus; label: string; icon: any; time?: string }[] = [
    { key: 'Created', label: 'Surplus Posted', icon: Sparkles },
    { key: 'Searching', label: 'Smart Matching', icon: Clock },
    { key: 'Accepted', label: 'Courier Assigned', icon: Check, time: pickup?.accepted_at },
    { key: 'Picked Up', label: 'In Transit', icon: Truck, time: pickup?.picked_up_at },
    { key: 'Delivered', label: 'Delivered to NGO', icon: Home, time: pickup?.delivered_at },
    { key: 'Distributed', label: 'Meals Served', icon: CheckCircle2, time: pickup?.distributed_at },
  ];

  const statusOrder: Record<DonationStatus, number> = {
    Created: 0,
    Searching: 1,
    Accepted: 2,
    'Picked Up': 3,
    Delivered: 4,
    Distributed: 5,
    Completed: 6,
    Cancelled: -1,
    Expired: -1,
  };

  const currentIdx = statusOrder[status] ?? 0;

  if (status === 'Cancelled' || status === 'Expired') {
    return (
      <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm font-semibold flex items-center justify-between">
        <span>Donation lifecycle halted: {status}</span>
        <span className="text-xs font-normal">Closed in database</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Redistribution Lifecycle
        </h4>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
          Status: {status}
        </span>
      </div>

      <div className="relative">
        {/* Horizontal Connector Line for Desktop */}
        <div className="hidden md:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-200 z-0">
          <div
            className="h-full bg-emerald-600 transition-all duration-500"
            style={{ width: `${Math.min(100, (currentIdx / (steps.length - 1)) * 100)}%` }}
          ></div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 relative z-10">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = currentIdx >= idx;
            const isCurrent = currentIdx === idx;

            return (
              <div key={step.key} className="flex flex-col items-center text-center">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                    isCurrent
                      ? 'bg-amber-500 text-white ring-4 ring-amber-500/20 scale-110 font-bold'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs mt-2 font-bold ${
                    isCurrent
                      ? 'text-amber-600'
                      : isCompleted
                      ? 'text-emerald-700'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
                {step.time && (
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(step.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
