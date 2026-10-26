import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Sprout,
  Utensils,
  Truck,
  Building2,
  Heart,
  ShieldCheck,
  Clock,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Star,
  Users,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  MapPin,
  Leaf
} from 'lucide-react'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import UrgencyBadge from '../../components/ui/UrgencyBadge'
import Skeleton, { CardSkeleton } from '../../components/ui/Skeleton'
import ErrorMessage from '../../components/ui/ErrorMessage'
import { statsService } from '../../api/statsService'
import { foodService } from '../../api/foodService'
import { useAuth } from '../../hooks/useAuth'

export default function HomePage() {
  const { user } = useAuth()

  // State for impact metrics
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState(null)

  // State for preview food listings
  const [previewFoods, setPreviewFoods] = useState([])
  const [foodsLoading, setFoodsLoading] = useState(true)

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState(0)

  // Load live platform stats
  const fetchStats = async () => {
    setStatsLoading(true)
    setStatsError(null)
    try {
      const data = await statsService.getOverview()
      setStats(data)
    } catch (err) {
      setStatsError(err.message || 'Could not load impact counters')
    } finally {
      setStatsLoading(false)
    }
  }

  // Load preview listings
  const fetchPreviewFoods = async () => {
    setFoodsLoading(true)
    try {
      const res = await foodService.getFoods({ limit: 3, status: 'Available' })
      setPreviewFoods(res.items || [])
    } catch {
      setPreviewFoods([])
    } finally {
      setFoodsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    fetchPreviewFoods()
  }, [])

  // 3-Step Process data
  const steps = [
    {
      step: '01',
      title: 'Donors List Surplus',
      desc: 'Bakeries, restaurants, and grocers upload extra food with quantity, pickup window, and dietary tags in 60 seconds.',
      icon: Utensils,
      color: 'bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300',
    },
    {
      step: '02',
      title: 'Receivers Claim Instantly',
      desc: 'Verified local shelters, charities, and community kitchens get alerted in real-time and reserve meals with one tap.',
      icon: Clock,
      color: 'bg-accent-100 text-accent-700 dark:bg-accent-950 dark:text-accent-300',
    },
    {
      step: '03',
      title: 'Safe, Quick Handover',
      desc: 'Volunteers pick up the food following cold-chain safety rules. The listing updates to "Collected" and impact metrics grow.',
      icon: Truck,
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    },
  ]

  // Who it is for data
  const audienceSegments = [
    {
      title: 'Restaurants & Bakeries',
      badge: 'Donors',
      icon: Utensils,
      points: [
        'Prevent prepared food from entering landfills',
        'Receive automated tax donation receipts',
        'Enhance your neighborhood eco-reputation',
      ],
    },
    {
      title: 'Supermarkets & Farms',
      badge: 'Producers',
      icon: Sprout,
      points: [
        'Rescue bulk produce, wonky fruit & near-date dairy',
        'Coordinate volume pickups with community vans',
        'Cut disposal bin and waste management costs',
      ],
    },
    {
      title: 'NGOs & Community Shelters',
      badge: 'Receivers',
      icon: Building2,
      points: [
        'Secure wholesome ingredients for daily meal programs',
        'Automated real-time notifications for nearby surplus',
        'Transparent pickup confirmations and donor ratings',
      ],
    },
    {
      title: 'Local Families & Volunteers',
      badge: 'Community',
      icon: Heart,
      points: [
        'Access dignity-first food support with zero stigma',
        'Deliver rescued meals to elderly or vulnerable neighbors',
        'Earn platform community impact achievements',
      ],
    },
  ]

  // Sample Testimonials
  const testimonials = [
    {
      quote:
        'FoodSave AI cut our bakery’s evening waste to zero. Instead of throwing out 30 loaves of artisan sourdough every night, a local youth shelter picks them up within an hour.',
      author: 'Chef Marco Rossi',
      role: 'Owner & Head Baker',
      organization: 'Green Hearth Bakery',
      rating: 5,
    },
    {
      quote:
        'Our soup kitchen feeds 150 people daily on a tight budget. The real-time urgency alerts let our volunteers grab fresh prepared meals right after lunch service.',
      author: 'Sarah Jenkins',
      role: 'Logistics Director',
      organization: 'Hope Community Care',
      rating: 5,
    },
    {
      quote:
        'The app is remarkably simple. We list imperfect apples and squash by the crate, and community kitchens take them immediately. It’s a win for the farm and the earth.',
      author: 'David Chen',
      role: 'Farm Manager',
      organization: 'Valley Green Co-op',
      rating: 5,
    },
  ]

  // FAQs
  const faqs = [
    {
      q: 'Are food donors protected from liability when donating?',
      a: 'Yes. In many jurisdictions including under the Good Samaritan Food Donation Act, donors and non-profits are protected from civil and criminal liability when donating apparently wholesome food in good faith.',
    },
    {
      q: 'What happens if food is not claimed before the expiry time?',
      a: 'If a listing reaches its stated expiration window without being accepted, our system automatically moves its status to "Expired" to prevent any compromised food from being distributed.',
    },
    {
      q: 'Is there any fee or subscription to use FoodSave AI?',
      a: 'No. FoodSave AI is 100% free for donors, food banks, shelters, and community members. Our mission is pure waste reduction and hunger relief.',
    },
    {
      q: 'What safety standards are required for prepared meals?',
      a: 'Prepared hot food must be maintained above 65°C (149°F) or chilled promptly below 4°C (40°F) in food-grade covered containers, labeled with preparation time and major allergens.',
    },
    {
      q: 'Can an individual volunteer pick up donations?',
      a: 'Yes! Individuals registered as community volunteers can claim and transport food directly to seniors, community fridges, or shelters in their neighborhood.',
    },
  ]

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pb-20 border-b border-brand-100/60 dark:border-gray-800/60">
        {/* Soft Organic Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none -z-10">
          <div className="absolute top-10 left-10 w-96 h-96 bg-brand-200/40 dark:bg-brand-900/15 rounded-full blur-3xl" />
          <div className="absolute top-20 right-10 w-80 h-80 bg-accent-200/40 dark:bg-accent-900/15 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Onboarding Tip / Highlight Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 dark:bg-brand-950/70 border border-brand-200 dark:border-brand-800 text-brand-800 dark:text-brand-300 text-xs font-semibold shadow-xs animate-fade-in">
            <Sparkles className="w-4 h-4 text-accent-500" />
            <span>AI-Powered Local Food Rescue • Connecting Donors with Shelters</span>
          </div>

          {/* Main Headline & Subtitle */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl font-heading font-extrabold tracking-tight text-charcoal dark:text-cream-50 leading-[1.15]">
              Rescue Fresh Surplus Food.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-500">
                Nourish Communities.
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Every day, wholesome meals from restaurants, bakeries, and grocers go to waste.
              FoodSave AI bridges the gap—matching surplus with local shelters and families before time runs out.
            </p>
          </div>

          {/* Dual Call-To-Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link to="/browse">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="w-full sm:w-auto shadow-md"
              >
                Browse Surplus Food
              </Button>
            </Link>
            <Link to={user ? '/donor/add' : '/register'}>
              <Button
                variant="outline"
                size="lg"
                leftIcon={<Utensils className="w-5 h-5" />}
                className="w-full sm:w-auto"
              >
                Donate Surplus Food
              </Button>
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-gray-600 dark:text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              <span>Good Samaritan Act Protected</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-accent-500" />
              <span>Real-Time 2-Hour Urgency Tracking</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>100% Free Platform for All</span>
            </span>
          </div>

        </div>
      </section>

      {/* 2. LIVE IMPACT COUNTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-charcoal rounded-3xl p-8 sm:p-10 shadow-soft border border-brand-100 dark:border-gray-800">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-charcoal dark:text-cream-50">
              Collective Community Impact
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Real-time synchronization with registered food shelters and participating donors.
            </p>
          </div>

          {statsError ? (
            <ErrorMessage title="Failed to load impact counters" message={statsError} onRetry={fetchStats} />
          ) : statsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Skeleton variant="rect" className="h-28" />
              <Skeleton variant="rect" className="h-28" />
              <Skeleton variant="rect" className="h-28" />
              <Skeleton variant="rect" className="h-28" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              
              <div className="p-5 bg-cream-50 dark:bg-charcoal-dark rounded-2xl border border-brand-100 dark:border-gray-800/80 text-center space-y-1">
                <span className="text-2xl sm:text-4xl font-heading font-extrabold text-brand-600">
                  {stats?.mealsSaved?.toLocaleString()}+
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
                  Meals Saved
                </span>
              </div>

              <div className="p-5 bg-cream-50 dark:bg-charcoal-dark rounded-2xl border border-brand-100 dark:border-gray-800/80 text-center space-y-1">
                <span className="text-2xl sm:text-4xl font-heading font-extrabold text-brand-600">
                  {stats?.kgFoodSaved?.toLocaleString()} kg
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
                  Food Rescued
                </span>
              </div>

              <div className="p-5 bg-cream-50 dark:bg-charcoal-dark rounded-2xl border border-brand-100 dark:border-gray-800/80 text-center space-y-1">
                <span className="text-2xl sm:text-4xl font-heading font-extrabold text-accent-500">
                  {stats?.co2AvoidedKg?.toLocaleString()} kg
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
                  CO2 Avoided
                </span>
              </div>

              <div className="p-5 bg-cream-50 dark:bg-charcoal-dark rounded-2xl border border-brand-100 dark:border-gray-800/80 text-center space-y-1">
                <span className="text-2xl sm:text-4xl font-heading font-extrabold text-charcoal dark:text-cream-50">
                  {stats?.activeDonors}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
                  Active Donors
                </span>
              </div>

            </div>
          )}
        </div>
      </section>

      {/* 3. URGENT SURPLUS FEED PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-600 dark:text-accent-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Available for Pickup Right Now</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-charcoal dark:text-cream-50 mt-1">
              Recent Food Listings
            </h2>
          </div>
          <Link to="/browse">
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Available Food
            </Button>
          </Link>
        </div>

        {foodsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {previewFoods.map((food) => (
              <Card key={food.id} hoverEffect className="p-0 overflow-hidden flex flex-col justify-between">
                <div className="relative h-44 w-full bg-gray-100 dark:bg-gray-800">
                  <img
                    src={food.imageUrl}
                    alt={food.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge status={food.status} />
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 dark:bg-charcoal/95 backdrop-blur-sm rounded-full px-2.5 py-0.5 shadow-sm">
                    <UrgencyBadge expiryTime={food.expiryTime} />
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span className="font-semibold text-brand-600 dark:text-brand-400">{food.category}</span>
                      <span>{food.quantity} {food.unit}</span>
                    </div>
                    <h3 className="font-heading font-bold text-base line-clamp-1 text-charcoal dark:text-cream-50">
                      {food.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                      {food.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 truncate max-w-[180px]">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                      <span className="truncate">{food.pickupLocation}</span>
                    </div>
                    <Link to="/browse">
                      <Button variant="primary" size="sm">
                        Request
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* 4. HOW IT WORKS (3 SIMPLE STEPS) */}
      <section className="bg-cream-200/50 dark:bg-charcoal/40 py-16 border-y border-brand-100/60 dark:border-gray-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
              Simple 3-Step Lifecycle
            </span>
            <h2 className="text-3xl font-heading font-extrabold text-charcoal dark:text-cream-50">
              How FoodSave AI Works
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Eliminating friction between surplus food availability and community need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((st) => {
              const Icon = st.icon
              return (
                <Card key={st.step} className="relative p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-xs ${st.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-heading font-extrabold text-gray-200 dark:text-gray-700">
                      {st.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-heading font-bold text-charcoal dark:text-cream-50">
                    {st.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {st.desc}
                  </p>
                </Card>
              )
            })}
          </div>

        </div>
      </section>

      {/* 5. WHO IT IS FOR (4 SEGMENTS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-accent-600 dark:text-accent-400">
            Tailored For Every Partner
          </span>
          <h2 className="text-3xl font-heading font-extrabold text-charcoal dark:text-cream-50">
            Who Uses FoodSave AI?
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Whether donating a single tray of sandwiches or coordinating a daily distribution van.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {audienceSegments.map((seg) => {
            const Icon = seg.icon
            return (
              <Card key={seg.title} className="p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="accent" size="sm">{seg.badge}</Badge>
                  </div>
                  <h3 className="font-heading font-bold text-base text-charcoal dark:text-cream-50">
                    {seg.title}
                  </h3>
                  <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                    {seg.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      {/* 6. TESTIMONIALS (SAMPLE PARTNER FEEDBACK) */}
      <section className="bg-white dark:bg-charcoal py-16 border-y border-brand-100/60 dark:border-gray-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Community Voices
            </span>
            <h2 className="text-3xl font-heading font-extrabold text-charcoal dark:text-cream-50">
              Partner Testimonials
            </h2>
            <p className="text-xs text-gray-400">
              (Sample Feedback from Pilot Participants)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Card key={i} className="p-6 flex flex-col justify-between bg-cream-50/60 dark:bg-charcoal-dark/60 space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-1 text-amber-400">
                    {Array.from({ length: t.rating }).map((_, starIdx) => (
                      <Star key={starIdx} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-200/60 dark:border-gray-800">
                  <h4 className="text-xs font-bold text-charcoal dark:text-cream-50">{t.author}</h4>
                  <p className="text-[11px] text-gray-500">{t.role} • <strong>{t.organization}</strong></p>
                </div>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* 7. ACCESSIBLE FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl font-heading font-extrabold text-charcoal dark:text-cream-50">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Everything you need to know about food safety, pickup coordination, and legal protection.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx
            return (
              <div
                key={idx}
                className="bg-white dark:bg-charcoal rounded-2xl border border-brand-100 dark:border-gray-800 overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-heading font-bold text-sm sm:text-base text-charcoal dark:text-cream-50 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-gray-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-brand-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    role="region"
                    className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-800/60 animate-fade-in"
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* 8. FINAL CALL TO ACTION (CTA) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-600 via-brand-700 to-accent-600 text-white rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-soft relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md">
              <Leaf className="w-3.5 h-3.5 text-cream-100" />
              <span>Zero Waste • Maximum Community Nourishment</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight">
              Ready to Turn Food Waste Into Community Meals?
            </h2>
            <p className="text-brand-100 text-sm leading-relaxed">
              Join hundreds of restaurants, bakeries, grocery stores, and food shelters in your area today.
              Registration takes less than 2 minutes.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto shadow-md">
                  Join As Food Donor or Receiver
                </Button>
              </Link>
              <Link to="/browse">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-white hover:bg-white/10">
                  Explore Current Surplus
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
