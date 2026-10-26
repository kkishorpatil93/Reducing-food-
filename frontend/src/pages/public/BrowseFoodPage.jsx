import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Heart,
  Grid,
  Map as MapIcon,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Star,
  Sparkles
} from 'lucide-react'
import { foodService } from '../../api/foodService'
import { useFavorites } from '../../hooks/useFavorites'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import UrgencyBadge from '../../components/ui/UrgencyBadge'
import { CardSkeleton } from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import ErrorMessage from '../../components/ui/ErrorMessage'

export default function BrowseFoodPage() {
  const { isFavorite, toggleFavorite } = useFavorites()

  // Data & loading states
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedDietary, setSelectedDietary] = useState('All')
  const [sortBy, setSortBy] = useState('soonest_expiry')
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'map'
  const [selectedMapPin, setSelectedMapPin] = useState(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const categories = ['All', 'Bakery', 'Prepared Meals', 'Produce', 'Dairy', 'Pantry Staples']
  const statuses = ['All', 'Available', 'Requested', 'Accepted']
  const dietaryFilters = ['All', 'Vegetarian', 'Vegan', 'Halal', 'Gluten-Free']

  const fetchFoods = async () => {
    setLoading(true)
    setError(null)
    try {
      // Pass category & status to service layer
      const res = await foodService.getFoods({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        status: selectedStatus !== 'All' ? selectedStatus : undefined,
        search: searchQuery.trim() || undefined,
        dietary: selectedDietary !== 'All' ? selectedDietary : undefined,
      })
      setFoods(res.items || [])
    } catch (err) {
      setError(err.message || 'Failed to load food listings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFoods()
    setCurrentPage(1)
  }, [selectedCategory, selectedStatus, selectedDietary, searchQuery])

  // Client-side filtering & sorting for favorites and options
  const processedFoods = useMemo(() => {
    let result = [...foods]

    if (showOnlyFavorites) {
      result = result.filter((f) => isFavorite(f.id))
    }

    // Sort order
    if (sortBy === 'soonest_expiry') {
      result.sort((a, b) => new Date(a.expiryTime).getTime() - new Date(b.expiryTime).getTime())
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    } else if (sortBy === 'quantity_desc') {
      result.sort((a, b) => b.quantity - a.quantity)
    }

    return result
  }, [foods, showOnlyFavorites, sortBy, isFavorite])

  // Pagination slice
  const totalItems = processedFoods.length
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1
  const paginatedFoods = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return processedFoods.slice(start, start + itemsPerPage)
  }, [processedFoods, currentPage, itemsPerPage])

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
    setSelectedStatus('All')
    setSelectedDietary('All')
    setShowOnlyFavorites(false)
    setSortBy('soonest_expiry')
    setCurrentPage(1)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & View Mode Switch */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-100 dark:border-gray-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            <Sparkles className="w-4 h-4 text-accent-500" />
            <span>Community Surplus Directory</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-charcoal dark:text-cream-50 mt-1">
            Browse Available Food
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Discover edible food donations from verified restaurants and grocers in your neighborhood.
          </p>
        </div>

        {/* Map / List View Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-charcoal rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'grid'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Grid List</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'map'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>Map View</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Controls Card */}
      <Card className="p-5 sm:p-6 space-y-4">
        
        {/* Top search & sorting row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by food name, description, address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream-50 dark:bg-charcoal-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream-50 dark:bg-charcoal-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="soonest_expiry">Sort: Expiry Soonest</option>
              <option value="newest">Sort: Recently Listed</option>
              <option value="quantity_desc">Sort: Highest Quantity</option>
            </select>
          </div>

          <div className="sm:col-span-3 flex items-center justify-between sm:justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowOnlyFavorites((prev) => !prev)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                showOnlyFavorites
                  ? 'bg-rose-50 border-rose-300 text-rose-600 dark:bg-rose-950/40 dark:border-rose-800'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-current text-rose-500' : ''}`} />
              <span>Saved Only</span>
            </button>

            <button
              type="button"
              onClick={resetFilters}
              title="Reset all search filters"
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-charcoal dark:hover:text-cream-50 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Filter categories pills */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold uppercase tracking-wider text-gray-400 mr-1">Categories:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-cream-100 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status & Dietary tags row */}
        <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-gray-400">Status:</span>
            <div className="flex gap-1.5">
              {statuses.map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    selectedStatus === st
                      ? 'bg-charcoal text-white dark:bg-cream-100 dark:text-charcoal'
                      : 'text-gray-500 hover:text-charcoal dark:hover:text-cream-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-gray-400">Dietary:</span>
            <div className="flex gap-1.5">
              {dietaryFilters.map((df) => (
                <button
                  key={df}
                  onClick={() => setSelectedDietary(df)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    selectedDietary === df
                      ? 'bg-accent-500 text-white'
                      : 'text-gray-500 hover:text-accent-600'
                  }`}
                >
                  {df}
                </button>
              ))}
            </div>
          </div>
        </div>

      </Card>

      {/* Main Content Area: Grid View vs Interactive Map View */}
      {error ? (
        <ErrorMessage title="Error loading directory" message={error} onRetry={fetchFoods} />
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : paginatedFoods.length === 0 ? (
        <EmptyState
          title="No food listings found"
          description="Try broadening your category filters or search terms to discover surplus food nearby."
          actionLabel="Clear All Filters"
          onAction={resetFilters}
        />
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedFoods.map((food) => {
              const fav = isFavorite(food.id)
              return (
                <Card
                  key={food.id}
                  hoverEffect
                  className="p-0 overflow-hidden flex flex-col justify-between group"
                >
                  {/* Photo & Overlays */}
                  <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <img
                      src={food.imageUrl}
                      alt={food.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge status={food.status} />
                    </div>

                    {/* Favorite Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(food.id)
                      }}
                      aria-label={fav ? 'Remove from saved' : 'Save to favorites'}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-charcoal/90 backdrop-blur-sm text-gray-400 hover:text-rose-500 transition-colors shadow-sm"
                    >
                      <Heart className={`w-4 h-4 ${fav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    {/* Urgency Badge overlay */}
                    <div className="absolute bottom-3 right-3 bg-white/95 dark:bg-charcoal/95 backdrop-blur-md rounded-full px-2.5 py-0.5 shadow-sm">
                      <UrgencyBadge expiryTime={food.expiryTime} />
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span className="font-semibold text-brand-600 dark:text-brand-400">{food.category}</span>
                        <span className="font-bold text-charcoal dark:text-cream-50 bg-cream-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
                          {food.quantity} {food.unit}
                        </span>
                      </div>

                      <h3 className="font-heading font-bold text-base text-charcoal dark:text-cream-50 line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {food.title}
                      </h3>

                      <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mt-1.5 leading-relaxed">
                        {food.description}
                      </p>

                      {/* Dietary tags pills */}
                      {food.dietaryTags && food.dietaryTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {food.dietaryTags.map((t) => (
                            <span key={t} className="text-[10px] px-2 py-0.5 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 rounded-md font-medium">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer Row */}
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
                      <div className="text-xs text-gray-500 truncate">
                        <div className="flex items-center gap-1 truncate font-medium text-charcoal dark:text-cream-100">
                          <span className="truncate">{food.donor?.name || 'Local Donor'}</span>
                          <span className="text-amber-500 shrink-0">★ {food.donor?.rating || '4.9'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-gray-400 truncate mt-0.5">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate">{food.pickupLocation}</span>
                        </div>
                      </div>

                      <Link to={`/foods/${food.id}`} className="shrink-0">
                        <Button variant="primary" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>

                  </div>
                </Card>
              )
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-brand-100 dark:border-gray-800">
              <span className="text-xs text-gray-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1}–{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} listings
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                >
                  Prev
                </Button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-colors ${
                      currentPage === i + 1
                        ? 'bg-brand-600 text-white'
                        : 'bg-white dark:bg-charcoal text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* INTERACTIVE MAP VIEW SIMULATION */
        <div className="space-y-6">
          <div className="relative w-full h-[520px] bg-gradient-to-br from-cream-200 via-emerald-50 to-amber-50 dark:from-gray-900 dark:via-charcoal-dark dark:to-gray-800 rounded-3xl border border-brand-100 dark:border-gray-800 overflow-hidden shadow-soft flex items-center justify-center p-6">
            
            {/* Map Grid Lines SVG */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#map-grid)" />
            </svg>

            {/* Neighborhood Indicators */}
            <div className="absolute top-6 left-6 bg-white/90 dark:bg-charcoal/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-200 shadow-xs">
              📍 Downtown &amp; Midtown Rescue Zone
            </div>

            {/* Interactive Pins on Map */}
            {processedFoods.map((food, idx) => {
              // Distribute pins across stylized coordinates
              const positions = [
                { top: '35%', left: '25%' },
                { top: '48%', left: '55%' },
                { top: '65%', left: '38%' },
                { top: '28%', left: '72%' },
                { top: '75%', left: '68%' },
                { top: '40%', left: '42%' },
              ]
              const pos = positions[idx % positions.length]
              const isSelected = selectedMapPin?.id === food.id

              return (
                <div
                  key={food.id}
                  style={{ top: pos.top, left: pos.left }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedMapPin(food)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs shadow-md transition-all ${
                      isSelected
                        ? 'bg-accent-500 text-white ring-4 ring-accent-300 scale-110 z-30'
                        : 'bg-brand-600 hover:bg-brand-700 text-white'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate max-w-[100px]">{food.title}</span>
                  </button>
                </div>
              )
            })}

            {/* Popup Card when a Pin is selected */}
            {selectedMapPin && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 max-w-sm w-full mx-4 animate-scale-up">
                <Card className="p-4 shadow-soft-hover border-brand-500 relative">
                  <button
                    onClick={() => setSelectedMapPin(null)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    ✕
                  </button>
                  <div className="flex gap-3 items-start">
                    <img
                      src={selectedMapPin.imageUrl}
                      alt={selectedMapPin.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <Badge status={selectedMapPin.status} size="sm" />
                        <span className="text-[11px] text-gray-500">{selectedMapPin.quantity} {selectedMapPin.unit}</span>
                      </div>
                      <h4 className="font-heading font-bold text-sm truncate mt-1 text-charcoal dark:text-cream-50">
                        {selectedMapPin.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span>{selectedMapPin.pickupLocation}</span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                    <Link to={`/foods/${selectedMapPin.id}`}>
                      <Button variant="primary" size="sm">
                        View Details &amp; Claim
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
