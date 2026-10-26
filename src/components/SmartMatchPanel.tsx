import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { NgoMatch, VolunteerMatch } from '../types';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  ShieldCheck,
  Building,
  Users,
  Check,
  Info
} from 'lucide-react';

interface SmartMatchPanelProps {
  donationId: string;
  onPickupAccepted?: () => void;
  canAccept?: boolean;
}

export const SmartMatchPanel: React.FC<SmartMatchPanelProps> = ({
  donationId,
  onPickupAccepted,
  canAccept = true,
}) => {
  const [ngos, setNgos] = useState<NgoMatch[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedNgoId, setExpandedNgoId] = useState<string | null>(null);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [acceptedSuccess, setAcceptedSuccess] = useState(false);

  useEffect(() => {
    async function loadMatches() {
      setIsLoading(true);
      try {
        const data = await api.donations.getMatches(donationId);
        setNgos(data.ngos || []);
        setVolunteers(data.volunteers || []);
        if (data.ngos && data.ngos.length > 0) {
          setExpandedNgoId(data.ngos[0].ngo_id);
        }
      } catch (err) {
        console.error('Failed to load matches', err);
      } finally {
        setIsLoading(false);
      }
    }
    if (donationId) {
      loadMatches();
    }
  }, [donationId]);

  const handleAccept = async (ngoId: string) => {
    setAcceptingId(ngoId);
    try {
      await api.pickups.accept(donationId, 'user-volunteer-demo', ngoId);
      setAcceptedSuccess(true);
      if (onPickupAccepted) {
        onPickupAccepted();
      }
    } catch (err) {
      alert('Could not assign pickup: ' + (err as Error).message);
    } finally {
      setAcceptingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent mb-3"></div>
        <p className="text-sm font-semibold text-slate-700">Calculating Multi-Factor Proximity & Capacity Matches...</p>
        <p className="text-xs text-slate-400 mt-1">Applying 6-Factor Haversine Scoring Algorithm</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
      {/* Header with Honest Labeling */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold">Smart Matching Algorithm</h3>
            <span className="text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
              Honest Math Scoring
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic 6-factor weighting (Distance 30%, Availability 20%, Capacity 20%, Speed 15%, Diet 10%, Load 5%)
          </p>
        </div>
      </div>

      {acceptedSuccess && (
        <div className="m-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-sm">
            <p className="font-bold">Pickup Assigned & Confirmed!</p>
            <p className="text-xs text-emerald-700">
              Volunteer courier has been notified and transit coordinates are synchronized.
            </p>
          </div>
        </div>
      )}

      {/* Matches List */}
      <div className="p-4 sm:p-6 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <Building className="w-4 h-4 text-emerald-600" />
          <span>Top Matching NGOs & Food Banks</span>
        </h4>

        {ngos.length === 0 ? (
          <p className="text-sm text-slate-500 italic p-4 bg-slate-50 rounded-2xl">
            No active NGOs found within radius. Expanding perimeter search...
          </p>
        ) : (
          ngos.map((ngo, idx) => {
            const isExpanded = expandedNgoId === ngo.ngo_id;
            return (
              <div
                key={ngo.ngo_id}
                className={`border rounded-2xl transition-all overflow-hidden ${
                  idx === 0
                    ? 'border-emerald-300 bg-emerald-50/30 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black ${
                        ngo.match_score >= 85
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                          : ngo.match_score >= 70
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-white'
                      }`}
                    >
                      <span className="text-sm leading-none">{ngo.match_score}%</span>
                      <span className="text-[9px] uppercase tracking-tighter opacity-80 mt-0.5">Match</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-slate-900 text-sm sm:text-base">{ngo.name}</h5>
                        {idx === 0 && (
                          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            Top Recommendation
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{ngo.address} ({ngo.distance_km} km away)</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={() => setExpandedNgoId(isExpanded ? null : ngo.ngo_id)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 inline-flex items-center gap-1"
                    >
                      <span>Breakdown</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {canAccept && (
                      <button
                        onClick={() => handleAccept(ngo.ngo_id)}
                        disabled={acceptingId === ngo.ngo_id || acceptedSuccess}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {acceptingId === ngo.ngo_id ? (
                          <span>Assigning...</span>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Select & Assign</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Factor Breakdown */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-200/60 bg-white/60">
                    <div className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Mathematical Scoring Breakdown (0–100%):</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {Object.entries(ngo.breakdown).map(([key, item]) => (
                        <div key={key} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          <div className="flex justify-between items-center text-[11px] mb-1">
                            <span className="capitalize font-medium text-slate-600">
                              {key.replace('_', ' ')}
                            </span>
                            <span className="font-bold text-slate-900">
                              {item.score}/{item.max}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-600 h-full rounded-full"
                              style={{ width: `${(item.score / item.max) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-[10px] text-slate-500 mt-1 block truncate">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Volunteer Matches Section */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Available Volunteer Couriers Nearby</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {volunteers.map((v) => (
              <div key={v.volunteer_id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-slate-900">{v.name}</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                      {v.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {v.distance_km} km away • {v.points} pts
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-blue-700">{v.match_score}%</span>
                  <span className="block text-[10px] text-slate-400">Courier Fit</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
