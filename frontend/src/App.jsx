import React, { useState, useEffect } from 'react'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { ToastProvider, useToast } from './context/ToastContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Card, { CardTitle, CardDescription } from './components/ui/Card'
import Button from './components/ui/Button'
import Badge from './components/ui/Badge'
import UrgencyBadge from './components/ui/UrgencyBadge'
import { CardSkeleton } from './components/ui/Skeleton'
import ErrorMessage from './components/ui/ErrorMessage'
import DemoBanner from './components/ui/DemoBanner'
import OfflineBanner from './components/ui/OfflineBanner'
import { foodService } from './api/foodService'
import { statsService } from './api/statsService'
import { authService } from './api/authService'
import { Database, Sparkles, Filter, CheckCircle2, MapPin } from 'lucide-react'

function ApiLayerPlayground() {
  const { addToast } = useToast()

  // State for live API data
  const [foods, setFoods] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [currentUser, setCurrentUser] = useState(null)

  const categories = ['All', 'Bakery', 'Prepared Meals', 'Produce', 'Dairy']

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [foodsResponse, statsResponse, meResponse] = await Promise.all([
        foodService.getFoods({ category: categoryFilter }),
        statsService.getOverview(),
        authService.getMe()
      ])
      setFoods(foodsResponse.items || [])
      setStats(statsResponse)
      setCurrentUser(meResponse.user)
    } catch (err) {
      setError(err.message || 'Failed to fetch API data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [categoryFilter])

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 dark:bg-charcoal-dark text-charcoal dark:text-cream-50 transition-colors">
      <OfflineBanner />
      <DemoBanner />

      <Navbar
        user={currentUser}
        onLogout={() => {
          authService.logout()
          setCurrentUser(null)
          addToast({ type: 'info', title: 'Logged Out', message: 'Signed out of session.' })
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Phase 3 Banner */}
        <section className="bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-3xl p-8 shadow-soft relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md">
              <Database className="w-3.5 h-3.5 text-accent-300" />
              <span>Phase 3: Central API Client, Contract & Mock Switch</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold tracking-tight">
              Decoupled API Architecture
            </h1>
            <p className="text-brand-100 text-sm leading-relaxed">
              Every request routes through <code>src/api/endpoints.js</code> and service modules. When
              <code>VITE_USE_MOCKS=true</code> is set, mock delay simulators serve contract-adherent data without touching real backend services.
            </p>
          </div>
        </section>

        {/* Live Counters fetched from statsService */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-white dark:bg-charcoal rounded-2xl border border-brand-100 dark:border-gray-800 shadow-soft">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">Meals Saved</span>
              <span className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-600 mt-1 block">
                {stats.mealsSaved.toLocaleString()}+
              </span>
            </div>
            <div className="p-5 bg-white dark:bg-charcoal rounded-2xl border border-brand-100 dark:border-gray-800 shadow-soft">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">Food Rescued</span>
              <span className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-600 mt-1 block">
                {stats.kgFoodSaved.toLocaleString()} kg
              </span>
            </div>
            <div className="p-5 bg-white dark:bg-charcoal rounded-2xl border border-brand-100 dark:border-gray-800 shadow-soft">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">CO2 Avoided</span>
              <span className="text-2xl sm:text-3xl font-heading font-extrabold text-accent-500 mt-1 block">
                {stats.co2AvoidedKg.toLocaleString()} kg
              </span>
            </div>
            <div className="p-5 bg-white dark:bg-charcoal rounded-2xl border border-brand-100 dark:border-gray-800 shadow-soft">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">Active Donors</span>
              <span className="text-2xl sm:text-3xl font-heading font-extrabold text-charcoal dark:text-cream-50 mt-1 block">
                {stats.activeDonors}
              </span>
            </div>
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Filter By Category:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  categoryFilter === cat
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white dark:bg-charcoal text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Food Listings Feed */}
        {error && (
          <ErrorMessage
            title="Unable to load food listings"
            message={error}
            onRetry={loadData}
          />
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {foods.map((food) => (
              <Card key={food.id} hoverEffect className="flex flex-col justify-between overflow-hidden p-0">
                <div className="relative h-44 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <img
                    src={food.imageUrl}
                    alt={food.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge status={food.status} />
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-charcoal/90 backdrop-blur-md rounded-full px-2.5 py-0.5 shadow-sm">
                    <UrgencyBadge expiryTime={food.expiryTime} />
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span className="font-semibold text-brand-600 dark:text-brand-400">{food.category}</span>
                      <span>{food.quantity} {food.unit}</span>
                    </div>
                    <h3 className="font-heading font-bold text-base line-clamp-1 text-charcoal dark:text-cream-50">
                      {food.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mt-1 leading-relaxed">
                      {food.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{food.pickupLocation}</span>
                    </div>
                    <span className="font-semibold text-charcoal dark:text-cream-50 shrink-0">
                      ★ {food.donor?.rating || '5.0'}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ApiLayerPlayground />
      </ToastProvider>
    </ThemeProvider>
  )
}
