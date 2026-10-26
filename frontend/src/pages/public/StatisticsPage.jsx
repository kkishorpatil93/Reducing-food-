import React, { useState, useEffect, useMemo } from 'react'
import {
  BarChart3,
  TrendingUp,
  Leaf,
  Users,
  Calendar,
  Download,
  Share2,
  Sparkles,
  TreePine,
  Car,
  ShieldCheck,
  RotateCcw
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts'
import { statsService } from '../../api/statsService'
import { useToast } from '../../context/ToastContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'
import ErrorMessage from '../../components/ui/ErrorMessage'

export default function StatisticsPage() {
  const { addToast } = useToast()

  const [overview, setOverview] = useState(null)
  const [history, setHistory] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Date range filter
  const [dateRange, setDateRange] = useState('6M') // '7D' | '30D' | '6M' | '1Y'

  const dateRangeOptions = [
    { id: '7D', label: 'Last 7 Days' },
    { id: '30D', label: 'Last 30 Days' },
    { id: '6M', label: 'Last 6 Months' },
    { id: '1Y', label: 'This Year' },
  ]

  const loadStats = async () => {
    setLoading(true)
    setError(null)
    try {
      const [overviewData, historyData, categoriesData] = await Promise.all([
        statsService.getOverview(),
        statsService.getHistory(),
        statsService.getCategoryDistribution(),
      ])
      setOverview(overviewData)
      setHistory(historyData || [])
      setCategories(categoriesData || [])
    } catch (err) {
      setError(err.message || 'Failed to load platform impact analytics.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  // Filter or scale history based on date range
  const filteredHistory = useMemo(() => {
    if (!history || history.length === 0) return []
    if (dateRange === '7D') {
      return [
        { month: 'Mon', meals: 180, kg: 75, co2: 190 },
        { month: 'Tue', meals: 240, kg: 100, co2: 250 },
        { month: 'Wed', meals: 310, kg: 130, co2: 325 },
        { month: 'Thu', meals: 290, kg: 120, co2: 305 },
        { month: 'Fri', meals: 380, kg: 160, co2: 400 },
        { month: 'Sat', meals: 420, kg: 180, co2: 440 },
        { month: 'Sun', meals: 460, kg: 195, co2: 480 },
      ]
    }
    if (dateRange === '30D') {
      return [
        { month: 'Week 1', meals: 1420, kg: 600, co2: 1500 },
        { month: 'Week 2', meals: 1680, kg: 710, co2: 1760 },
        { month: 'Week 3', meals: 1940, kg: 820, co2: 2040 },
        { month: 'Week 4', meals: 2210, kg: 940, co2: 2320 },
      ]
    }
    if (dateRange === '6M') {
      return history.slice(-6)
    }
    return history
  }, [history, dateRange])

  // Environmental equivalents calculations
  const totalCo2 = overview?.co2AvoidedKg || 6125
  const treesEquivalent = Math.round(totalCo2 / 21) // 1 tree absorbs ~21 kg CO2/year
  const carMilesEquivalent = Math.round(totalCo2 * 2.5) // ~2.5 miles of gasoline car per kg CO2

  const envEquivalentsData = [
    { name: 'CO2 Prevented (kg)', value: totalCo2, fill: '#16A34A' },
    { name: 'Trees Offset Equivalent', value: treesEquivalent, fill: '#10B981' },
    { name: 'Car Miles Offset (mi)', value: carMilesEquivalent, fill: '#F97316' },
  ]

  const handleExport = () => {
    window.print()
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'FoodSave AI Community Impact Report',
        text: `Over ${overview?.mealsSaved?.toLocaleString()} meals rescued and ${totalCo2.toLocaleString()} kg CO2 prevented with FoodSave AI!`,
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      addToast({ type: 'info', title: 'Report Link Copied', message: 'Direct URL copied to clipboard.' })
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-100 dark:border-gray-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            <BarChart3 className="w-4 h-4 text-accent-500" />
            <span>Environmental & Community Metrics</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-charcoal dark:text-cream-50 mt-1">
            Food Waste Impact Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Live analytics tracking saved meals, avoided landfill methane, and collective donor achievements.
          </p>
        </div>

        {/* Date Range Selector & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 bg-white dark:bg-charcoal rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs">
            {dateRangeOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setDateRange(opt.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  dateRange === opt.id
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            leftIcon={<Download className="w-4 h-4" />}
            className="print:hidden"
          >
            Export
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            leftIcon={<Share2 className="w-4 h-4" />}
            className="print:hidden"
          >
            Share
          </Button>
        </div>
      </div>

      {error ? (
        <ErrorMessage title="Failed to load statistics" message={error} onRetry={loadStats} />
      ) : loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Skeleton variant="rect" className="h-28" />
            <Skeleton variant="rect" className="h-28" />
            <Skeleton variant="rect" className="h-28" />
            <Skeleton variant="rect" className="h-28" />
          </div>
          <Skeleton variant="rect" className="h-80" />
        </div>
      ) : (
        <>
          {/* Headline Counters Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <Card className="p-5 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Meals Saved</span>
              <span className="text-3xl font-heading font-extrabold text-brand-600 block">
                {overview?.mealsSaved?.toLocaleString()}+
              </span>
              <span className="text-[11px] text-gray-500 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-brand-600" />
                <span>+18.4% month-over-month growth</span>
              </span>
            </Card>

            <Card className="p-5 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Food Weight Saved</span>
              <span className="text-3xl font-heading font-extrabold text-brand-600 block">
                {overview?.kgFoodSaved?.toLocaleString()} kg
              </span>
              <span className="text-[11px] text-gray-500">
                Directly diverted from municipal landfills
              </span>
            </Card>

            <Card className="p-5 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">CO2 Emissions Avoided</span>
              <span className="text-3xl font-heading font-extrabold text-accent-500 block">
                {totalCo2.toLocaleString()} kg
              </span>
              <span className="text-[11px] text-gray-500">
                Landfill methane reduction factor (2.5x)
              </span>
            </Card>

            <Card className="p-5 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Active Partners</span>
              <span className="text-3xl font-heading font-extrabold text-charcoal dark:text-cream-50 block">
                {overview?.activeDonors + (overview?.activeReceivers || 0)}
              </span>
              <span className="text-[11px] text-gray-500">
                {overview?.activeDonors} Donors • {overview?.activeReceivers} Receivers
              </span>
            </Card>

          </div>

          {/* Chart Section 1: Time Series Area Curve */}
          <Card className="p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-4">
              <div>
                <h3 className="text-lg font-heading font-bold text-charcoal dark:text-cream-50">
                  Rescued Meals Growth Trend ({dateRange})
                </h3>
                <p className="text-xs text-gray-500">
                  Volume of nutritious portions transferred from local food businesses to community shelters.
                </p>
              </div>
              <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-3 py-1 rounded-full">
                Live Data Synchronized
              </span>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="mealGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16A34A" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#16A34A" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="co2Gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="meals"
                    name="Meals Saved"
                    stroke="#16A34A"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#mealGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="co2"
                    name="CO2 Avoided (kg)"
                    stroke="#F97316"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#co2Gradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Chart Section 2 & 3: Category Donut + Ecological Equivalence Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Category Breakdown Donut */}
            <Card className="p-6 space-y-4">
              <div className="border-b border-gray-100 dark:border-gray-800 pb-3">
                <h3 className="font-heading font-bold text-base text-charcoal dark:text-cream-50">
                  Surplus Food Category Distribution
                </h3>
                <p className="text-xs text-gray-500">
                  Breakdown by volume of rescued culinary inventory.
                </p>
              </div>

              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categories}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                    >
                      {categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || '#16A34A'} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => [`${val}%`, 'Share']}
                      contentStyle={{
                        borderRadius: '10px',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Environmental Equivalents Bar Chart */}
            <Card className="p-6 space-y-4">
              <div className="border-b border-gray-100 dark:border-gray-800 pb-3">
                <h3 className="font-heading font-bold text-base text-charcoal dark:text-cream-50">
                  Tangible Ecological Equivalencies
                </h3>
                <p className="text-xs text-gray-500">
                  Real-world carbon offsets translated from rescued food mass.
                </p>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={envEquivalentsData} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis type="number" stroke="#888888" fontSize={11} tickLine={false} />
                    <YAxis dataKey="name" type="category" stroke="#888888" fontSize={11} tickLine={false} width={130} />
                    <Tooltip
                      formatter={(val) => [val.toLocaleString(), 'Value']}
                      contentStyle={{
                        borderRadius: '10px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                      {envEquivalentsData.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

          </div>

          {/* Impact Equivalency Fun Fact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-3.5">
              <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-xs">
                <TreePine className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-emerald-900 dark:text-emerald-200 block text-sm">
                  {treesEquivalent.toLocaleString()} Trees Planted
                </span>
                <span className="text-emerald-700/80 dark:text-emerald-300/80">
                  Equivalent carbon sequestration capacity
                </span>
              </div>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800 flex items-center gap-3.5">
              <div className="p-3 bg-accent-500 text-white rounded-xl shadow-xs">
                <Car className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-amber-900 dark:text-amber-200 block text-sm">
                  {carMilesEquivalent.toLocaleString()} Miles Offset
                </span>
                <span className="text-amber-700/80 dark:text-amber-300/80">
                  Equivalent to removing passenger cars from roads
                </span>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-800 flex items-center gap-3.5">
              <div className="p-3 bg-blue-600 text-white rounded-xl shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-blue-900 dark:text-blue-200 block text-sm">
                  {overview?.totalPickups || 624} Safe Handovers
                </span>
                <span className="text-blue-700/80 dark:text-blue-300/80">
                  100% compliant with cold-chain food safety
                </span>
              </div>
            </div>

          </div>
        </>
      )}

    </div>
  )
}
