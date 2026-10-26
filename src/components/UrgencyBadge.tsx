import React from 'react';
import { AlertCircle, Clock, CheckCircle2, Flame } from 'lucide-react';
import { UrgencyLevel } from '../types';
import { formatTimeRemaining } from '../lib/utils';

interface UrgencyBadgeProps {
  urgency: UrgencyLevel;
  availableUntil?: string;
  showTime?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({
  urgency,
  availableUntil,
  showTime = true,
  size = 'md',
}) => {
  const timeText = availableUntil ? formatTimeRemaining(availableUntil) : '';

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs sm:text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  };

  if (urgency === 'critical') {
    return (
      <span
        className={`inline-flex items-center font-semibold rounded-full bg-red-100 text-red-800 border border-red-300 shadow-sm animate-pulse ${sizeClasses[size]}`}
        title="Expires in under 1 hour! Critical priority"
      >
        <Flame className="w-3.5 h-3.5 text-red-600 animate-bounce" />
        <span>CRITICAL</span>
        {showTime && timeText && <span className="opacity-90 font-normal">({timeText})</span>}
      </span>
    );
  }

  if (urgency === 'high') {
    return (
      <span
        className={`inline-flex items-center font-semibold rounded-full bg-orange-100 text-orange-800 border border-orange-300 ${sizeClasses[size]}`}
        title="Expires in 1-2 hours"
      >
        <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
        <span>HIGH</span>
        {showTime && timeText && <span className="opacity-90 font-normal">({timeText})</span>}
      </span>
    );
  }

  if (urgency === 'medium') {
    return (
      <span
        className={`inline-flex items-center font-medium rounded-full bg-amber-100 text-amber-800 border border-amber-300 ${sizeClasses[size]}`}
        title="Expires in 2-4 hours"
      >
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        <span>MEDIUM</span>
        {showTime && timeText && <span className="opacity-90 font-normal">({timeText})</span>}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 ${sizeClasses[size]}`}
      title="Expires in >4 hours"
    >
      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
      <span>LOW URGENCY</span>
      {showTime && timeText && <span className="opacity-90 font-normal">({timeText})</span>}
    </span>
  );
};
