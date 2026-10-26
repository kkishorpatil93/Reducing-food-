import React, { useState, useEffect } from 'react';
import { calculateServings, getLiveUrgency } from '../lib/utils';
import { DietType, FoodCategory } from '../types';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { useDonationStore } from '../store/donationStore';
import {
  Utensils,
  ShieldAlert,
  MapPin,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Flame,
  Info,
  Calendar,
  Phone,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';

interface DonationWizardProps {
  onSuccess?: (createdDonation: any) => void;
  onCancel?: () => void;
  initialValues?: {
    food_name?: string;
    qty_kg?: number;
    category?: FoodCategory;
    diet?: DietType;
  };
}

export const DonationWizard: React.FC<DonationWizardProps> = ({
  onSuccess,
  onCancel,
  initialValues,
}) => {
  const { user } = useAuthStore();
  const { fetchDonations, fetchStats } = useDonationStore();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [foodName, setFoodName] = useState(initialValues?.food_name || 'Grand Buffet Rice, Dal & Mixed Vegetable Curry');
  const [category, setCategory] = useState<FoodCategory>(initialValues?.category || 'cooked');
  const [diet, setDiet] = useState<DietType>(initialValues?.diet || 'veg');
  const [qtyKg, setQtyKg] = useState<number>(initialValues?.qty_kg || 15);
  const [storage, setStorage] = useState<'ambient' | 'refrigerated' | 'heated'>('refrigerated');
  const [refrigerated, setRefrigerated] = useState(true);

  // Safety & Packaging
  const [packagingIntact, setPackagingIntact] = useState(true);
  const [preparedAt, setPreparedAt] = useState(new Date().toISOString().slice(0, 16));
  const [consumeBy, setConsumeBy] = useState(
    new Date(Date.now() + 4 * 3600 * 1000).toISOString().slice(0, 16)
  );
  // Mandatory food safety acknowledgment checkbox (non-negotiable rule)
  const [safetyAcknowledged, setSafetyAcknowledged] = useState(false);

  // Logistics
  const [pickupAddress, setPickupAddress] = useState(
    user?.address || '142 Riverside Ave, Central District (Back Kitchen Dock)'
  );
  const [landmark, setLandmark] = useState('Opposite Central Metro Station Gate 2');
  const [availableFrom, setAvailableFrom] = useState(new Date().toISOString().slice(0, 16));
  const [availableUntil, setAvailableUntil] = useState(
    new Date(Date.now() + 4 * 3600 * 1000).toISOString().slice(0, 16)
  );
  const [contact, setContact] = useState(user?.phone || '+1-555-0101');
  const [instructions, setInstructions] = useState('Packed in food-grade insulated catering trays. Call kitchen intercom upon arrival.');

  // Live computed values
  const servings = calculateServings(qtyKg, category);
  const urgency = getLiveUrgency(new Date(availableUntil).toISOString());

  // Step validation
  const validateStep = (currentStep: number): boolean => {
    setErrorMessage(null);
    if (currentStep === 1) {
      if (!foodName.trim()) {
        setErrorMessage('Please specify the food item or dish name.');
        return false;
      }
      if (!qtyKg || qtyKg <= 0) {
        setErrorMessage('Please provide a valid quantity in kilograms.');
        return false;
      }
    }
    if (currentStep === 2) {
      if (!safetyAcknowledged) {
        setErrorMessage(
          'Mandatory: You must review and agree to the food safety responsibility disclaimer before proceeding.'
        );
        return false;
      }
    }
    if (currentStep === 3) {
      if (!pickupAddress.trim()) {
        setErrorMessage('Pickup address is required.');
        return false;
      }
      if (!contact.trim()) {
        setErrorMessage('Contact phone number is required.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(4, prev + 1));
    }
  };

  const handlePrev = () => {
    setErrorMessage(null);
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(2) || !validateStep(3)) return;

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        donor_id: user?.id || 'user-donor-demo',
        food_name: foodName,
        category,
        diet,
        qty_kg: qtyKg,
        storage,
        refrigerated: refrigerated ? 1 : 0,
        packaging_intact: packagingIntact ? 1 : 0,
        safety_acknowledged: safetyAcknowledged ? 1 : 0,
        prepared_at: new Date(preparedAt).toISOString(),
        consume_by: new Date(consumeBy).toISOString(),
        pickup_address: pickupAddress,
        landmark,
        lat: user?.lat || 12.9716,
        lng: user?.lng || 77.5946,
        available_from: new Date(availableFrom).toISOString(),
        available_until: new Date(availableUntil).toISOString(),
        contact,
        instructions,
      };

      const result = await api.donations.create(payload);
      await fetchDonations();
      await fetchStats();

      if (onSuccess) {
        onSuccess(result.donation);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit food donation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, title: 'Food Info', icon: Utensils },
    { num: 2, title: 'Food Safety', icon: ShieldAlert },
    { num: 3, title: 'Pickup Location', icon: MapPin },
    { num: 4, title: 'Confirm & Post', icon: CheckCircle },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-3xl mx-auto">
      {/* Wizard Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-green-900 text-white p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
              4-Step Donation Wizard
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mt-2">Donate Surplus Food</h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
              Connect surplus meals with verified NGOs and volunteer couriers
            </p>
          </div>

          {/* Servings Live Impact Pill */}
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-right">
            <span className="text-[11px] uppercase tracking-wider text-emerald-200 font-semibold block">
              Estimated Yield
            </span>
            <span className="text-2xl font-black text-white">~{servings}</span>
            <span className="text-xs text-emerald-200 font-medium ml-1">Meals</span>
          </div>
        </div>

        {/* Progress Bar / Stepper */}
        <div className="mt-8 grid grid-cols-4 gap-2">
          {stepsList.map((s) => {
            const Icon = s.icon;
            const isDone = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div key={s.num} className="flex flex-col items-center text-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
                    isCurrent
                      ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/30 shadow-md'
                      : isDone
                      ? 'bg-emerald-400 text-emerald-950'
                      : 'bg-emerald-900/60 text-emerald-300/70 border border-emerald-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[11px] sm:text-xs mt-2 font-medium hidden sm:block ${
                    isCurrent ? 'text-amber-300 font-bold' : isDone ? 'text-emerald-200' : 'text-emerald-400/60'
                  }`}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wizard Body */}
      <div className="p-6 sm:p-8">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Action Required</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* STEP 1: FOOD DETAILS */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                Food Name / Dish Description *
              </label>
              <input
                type="text"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="e.g. Grand Buffet Mixed Rice, Dal & Vegetable Curry"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900"
              />
              <p className="text-xs text-slate-500 mt-1">
                Provide clear, accurate description of items prepared.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FoodCategory)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-900 bg-white"
                >
                  <option value="cooked">Cooked Food / Catered Meals (Factor ~2.33x)</option>
                  <option value="bakery">Bakery & Bread (Factor ~5.0x)</option>
                  <option value="raw_produce">Raw Produce / Vegetables (Factor ~2.5x)</option>
                  <option value="dairy">Dairy & Fresh Items (Factor ~2.5x)</option>
                  <option value="packaged">Packaged / Canned Goods (Factor ~2.0x)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Dietary Classification *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['veg', 'non_veg', 'vegan'] as DietType[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDiet(d)}
                      className={`py-3 px-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                        diet === d
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {d === 'veg' ? '🌱 Veg' : d === 'vegan' ? '🌿 Vegan' : '🍖 Non-Veg'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Quantity (in Kilograms) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    step="0.5"
                    value={qtyKg}
                    onChange={(e) => setQtyKg(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-xl border border-emerald-300 focus:ring-2 focus:ring-emerald-500 text-slate-900 font-bold text-lg"
                  />
                  <span className="absolute right-4 top-3.5 text-slate-500 font-semibold text-sm">
                    KG
                  </span>
                </div>
                <div className="flex gap-2 mt-2">
                  {[5, 10, 15, 25].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setQtyKg(preset)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${
                        qtyKg === preset
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-emerald-100'
                      }`}
                    >
                      {preset} kg
                    </button>
                  ))}
                </div>
              </div>

              {/* Automatic Meal Calculator Demonstration */}
              <div className="flex flex-col justify-center bg-white p-4 rounded-xl border border-emerald-200 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Meal Serving Estimation</span>
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-emerald-700">{servings}</span>
                  <span className="text-slate-600 font-medium text-sm">Estimated Meals</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Formula: {qtyKg} kg × {category === 'cooked' ? '2.333' : category === 'bakery' ? '5.0' : '2.5'} multiplier.
                  {qtyKg === 15 && category === 'cooked' && (
                    <strong className="text-emerald-700 block mt-0.5">
                      ✓ Exactly ~35 meals for hackathon demonstration!
                    </strong>
                  )}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                Current Storage Condition
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'ambient', label: 'Room Temperature', desc: 'Covered in dry area' },
                  { id: 'refrigerated', label: 'Refrigerated (≤ 4°C)', desc: 'Chilled in cold room' },
                  { id: 'heated', label: 'Heated Holding (≥ 60°C)', desc: 'Warm buffet warmer' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setStorage(s.id as any);
                      setRefrigerated(s.id === 'refrigerated');
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      storage === s.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-semibold text-xs block">{s.label}</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: FOOD SAFETY & PACKAGING */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Zero-Compromise Food Safety Standard</p>
                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                  Food safety is of paramount importance. Surplus food must have been handled
                  strictly in accordance with local hygiene regulations.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Prepared At Timestamp *
                </label>
                <input
                  type="datetime-local"
                  value={preparedAt}
                  onChange={(e) => setPreparedAt(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Best Before / Consume By *
                </label>
                <input
                  type="datetime-local"
                  value={consumeBy}
                  onChange={(e) => setConsumeBy(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={packagingIntact}
                  onChange={(e) => setPackagingIntact(e.target.checked)}
                  className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-slate-800">
                  Food is sealed or packed in sanitized food-grade containers (aluminum trays, food boxes, or sealed canisters).
                </span>
              </label>

              {/* NON-NEGOTIABLE SAFETY DISCLAIMER CHECKBOX */}
              <div className="p-4 sm:p-5 rounded-2xl border-2 border-red-300 bg-red-50/80 shadow-sm">
                <label className="flex items-start gap-3.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={safetyAcknowledged}
                    onChange={(e) => setSafetyAcknowledged(e.target.checked)}
                    className="w-6 h-6 text-red-600 rounded border-red-400 focus:ring-red-500 shrink-0 mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-red-800 bg-red-200 px-2 py-0.5 rounded">
                      Mandatory Legal & Safety Acknowledgment
                    </span>
                    <p className="text-sm font-bold text-red-950 mt-1.5 leading-snug">
                      "Only donate food that is safe, properly stored, and suitable for consumption. The donor remains responsible for food safety."
                    </p>
                    <p className="text-xs text-red-700 mt-1">
                      Check this box to confirm compliance before donation publication. FoodBridge AI does not inspect individual meals and never claims food is safe.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PICKUP LOGISTICS */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                Pickup Address *
              </label>
              <input
                type="text"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="Street address, building, floor or loading dock"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Landmark / Meeting Point
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Metro Gate 2, Kitchen Back Entrance"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Donor Contact Phone *
                </label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="+1-555-0101"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Privacy guarantee: Phone is masked until a courier accepts the pickup.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Available From *
                </label>
                <input
                  type="datetime-local"
                  value={availableFrom}
                  onChange={(e) => setAvailableFrom(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Available Until (Hard Deadline) *
                </label>
                <input
                  type="datetime-local"
                  value={availableUntil}
                  onChange={(e) => setAvailableUntil(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                Special Pickup Instructions
              </label>
              <textarea
                rows={2}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Ring kitchen bell B; parking available in loading bay."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & CONFIRM */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <h3 className="font-bold text-emerald-950 text-base flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Donation Summary & Match Preview</span>
              </h3>
              <p className="text-xs text-emerald-800 mt-1">
                Your donation will immediately be scored by the Smart Matching Algorithm and routed to top nearby NGOs.
              </p>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded-xl border border-emerald-100">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold block">Quantity</span>
                  <span className="text-lg font-bold text-slate-900">{qtyKg} KG</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-emerald-100">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold block">Meal Servings</span>
                  <span className="text-lg font-bold text-emerald-600">~{servings} Meals</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-emerald-100">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold block">Diet</span>
                  <span className="text-lg font-bold text-slate-900 capitalize">{diet}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-emerald-100">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold block">Urgency</span>
                  <span className="text-lg font-bold capitalize text-amber-600">{urgency}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Dish Name:</span>
                <span className="font-semibold text-slate-900">{foodName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Pickup Address:</span>
                <span className="font-semibold text-slate-900">{pickupAddress}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Available Window:</span>
                <span className="font-semibold text-slate-900">
                  Until {new Date(availableUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Food Safety Checked:</span>
                <span className="font-semibold text-emerald-700">✓ Acknowledged by Donor</span>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
          <div>
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : onCancel ? (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 text-slate-500 hover:text-slate-800 text-sm font-semibold"
              >
                Cancel
              </button>
            ) : null}
          </div>

          <div>
            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-7 py-3 rounded-2xl text-base font-extrabold shadow-lg shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>{submitting ? 'Posting...' : 'POST FOOD DONATION'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
