import React from 'react';
import {
  Utensils,
  Sparkles,
  Truck,
  HeartHandshake,
  CheckCircle2,
  ShieldCheck,
  Scale,
  Clock,
  Compass
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
          Platform Architecture & Workflow
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mt-4">
          How FoodBridge AI Operates
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
          From kitchen surplus to community nourishment in under 45 minutes, guided by our transparent 6-factor Smart Matching Algorithm.
        </p>
      </div>

      {/* 4 Pipeline Stages */}
      <div className="space-y-6">
        {[
          {
            step: '01',
            title: '1. Food Donation & Safety Declaration',
            desc: 'Donors (restaurants, banquet halls, caterers, university messes) list surplus food with dish name, category, quantity in kilograms, and storage condition. Our engine immediately calculates meal servings (e.g. 15 kg cooked food = ~35 meals). Crucially, the donor must certify food safety and packaging hygiene before posting.',
            icon: Utensils,
            color: 'bg-emerald-600 text-white'
          },
          {
            step: '02',
            title: '2. Smart Matching Algorithm (Deterministic)',
            desc: 'We honestly label our matching algorithm: it is a deterministic 6-factor mathematical scoring model. It evaluates distance (30%), availability (20%), remaining NGO intake capacity (20%), time-to-pickup vs expiration (15%), dietary fit (10%), and workload rotation (5%). Top 3-5 candidates receive instant matches with transparent breakdowns.',
            icon: Sparkles,
            color: 'bg-amber-500 text-white'
          },
          {
            step: '03',
            title: '3. Rapid Courier Pickup & Navigation',
            desc: 'Active student and civic volunteers receive live push alerts via Server-Sent Events (SSE). Upon acceptance, precise pickup coordinates and contact information are unlocked, ensuring donor privacy is protected beforehand.',
            icon: Truck,
            color: 'bg-blue-600 text-white'
          },
          {
            step: '04',
            title: '4. NGO Handover & Dignified Distribution',
            desc: 'Couriers deliver sealed food directly to verified shelters and community kitchens. NGO coordinators log meal distributions to shelter residents, night shelters, or families in need, updating the global impact counter in real time.',
            icon: CheckCircle2,
            color: 'bg-purple-600 text-white'
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.step} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-bold ${s.color}`}>
                <Icon className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stage {s.step}</span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">{s.title}</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl text-center space-y-4">
        <h3 className="text-2xl font-bold">Experience the Full Cycle in Under 2 Minutes</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Switch roles using our top Hackathon Demo Bar to test Donor posting, Volunteer acceptance, and NGO distribution.
        </p>
        <div className="pt-2">
          <Link
            to="/donor?action=new"
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm inline-block shadow-md"
          >
            Start Donor Demo Now →
          </Link>
        </div>
      </div>
    </div>
  );
};
