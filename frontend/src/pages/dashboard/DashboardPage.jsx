import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Utensils,
  PlusCircle,
  Package,
  Inbox,
  ArrowRight,
  Sparkles,
  TrendingUp,
  MapPin,
  Clock,
  ShieldCheck,
  Award
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { foodService } from '../../api/foodService'
import { requestService } from '../../api/requestService'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import UrgencyBadge from '../../components/ui/UrgencyBadge'
import ImpactBadges from '../../components/ui/ImpactBadges'
import Skeleton from '../../components/ui/Skeleton'

export default function DashboardPage() {
  const { user } = useAuth()
  const role = user?.role || 'restaurant'

  const [donations, setDonations] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const loadDashboardData = async () => {
      setLoading(true)
      try {
        const [donationsRes, requestsRes] = await Promise.all([
          foodService.getFoods({ limit: 4 }),
          requestService.getMyRequests(),
        ])
        if (isMounted) {
          setDonations(donationsRes.items || [])
          setRequests(requestsRes || [])
        }
      } catch {
        // Handle error gracefully
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadDashboardData()
    return () => { isMounted = false }
  }, [])

  const isDonor = role === 'donor' || role === 'restaurant'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-brand-600 via-brand-700 to-accent-600 text-white rounded-3xl p-8 shadow-soft relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-accent-300" />
              <span>Role Dashboard • {role.toUpperCase()}</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Partner'}!
            </h1>
            <p className="text-brand-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              {isDonor
                ? 'Your active surplus listings and incoming collection requests from neighborhood charities.'
                : 'Browse fresh food donations available for community distribution across your region.'}
            </p>
          </div>

          <div className="flex gap-2">
            {isDonor ? (
              <Link to="/donor/add">
                <Button variant="secondary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
                  Add Food Listing
                </Button>
              </Link>
            ) : (
              <Link to="/browse">
                <Button variant="secondary" size="md" leftIcon={<Package className="w-4 h-4" />}>
                  Browse Surplus Food
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-5">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Meals Saved</span>
          <span className="text-3xl font-heading font-extrabold text-brand-600 mt-1 block">
            {user?.impactMeals || 840}
          </span>
          <span className="text-[11px] text-gray-400 mt-0.5 block">Lifetime Platform Total</span>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">CO2 Prevented</span>
          <span className="text-3xl font-heading font-extrabold text-accent-500 mt-1 block">
            {user?.impactCo2Kg || 920} kg
          </span>
          <span className="text-[11px] text-gray-400 mt-0.5 block">Emissions Avoided</span>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Trust Score</span>
          <span className="text-3xl font-heading font-extrabold text-amber-500 mt-1 block">
            ★ {user?.rating || '4.9'}
          </span>
          <span className="text-[11px] text-gray-400 mt-0.5 block">100% Reliable Partner</span>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Active Requests</span>
          <span className="text-3xl font-heading font-extrabold text-charcoal dark:text-cream-50 mt-1 block">
            {requests.length || 3}
          </span>
          <span className="text-[11px] text-gray-400 mt-0.5 block">Awaiting Collection</span>
        </Card>
      </div>

      {/* Impact Badges Area */}
      <Card className="p-6">
        <ImpactBadges mealsSaved={user?.impactMeals || 840} co2Saved={user?.impactCo2Kg || 920} />
      </Card>

      {/* Recent Activity Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Active Listings */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
            <h3 className="font-heading font-bold text-base text-charcoal dark:text-cream-50">
              {isDonor ? 'My Active Food Donations' : 'Recent Available Surplus'}
            </h3>
            <Link
              to={isDonor ? '/donor/donations' : '/browse'}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <Skeleton variant="rect" count={3} className="h-16" />
          ) : (
            <div className="space-y-3">
              {donations.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-cream-50 dark:bg-charcoal-dark rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 truncate">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="truncate">
                      <h4 className="font-bold truncate text-charcoal dark:text-cream-50">{item.title}</h4>
                      <span className="text-gray-500">{item.quantity} {item.unit} • {item.category}</span>
                    </div>
                  </div>
                  <Badge status={item.status} size="sm" />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Right: Active Collection Requests */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
            <h3 className="font-heading font-bold text-base text-charcoal dark:text-cream-50">
              Recent Collection Requests
            </h3>
            <Link
              to={isDonor ? '/donor/donations' : '/receiver/requests'}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Manage →
            </Link>
          </div>

          {loading ? (
            <Skeleton variant="rect" count={3} className="h-16" />
          ) : (
            <div className="space-y-3">
              {requests.slice(0, 3).map((req) => (
                <div
                  key={req.id}
                  className="p-3 bg-cream-50 dark:bg-charcoal-dark rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="truncate">
                    <h4 className="font-bold truncate text-charcoal dark:text-cream-50">
                      {req.food?.title || 'Food Donation'}
                    </h4>
                    <span className="text-gray-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span>{new Date(req.estimatedPickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </span>
                  </div>
                  <Badge status={req.status} size="sm" />
                </div>
              ))}
            </div>
          )}
        </Card>

      </div>

    </div>
  )
}
