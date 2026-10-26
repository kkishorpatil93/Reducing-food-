import React, { useState } from 'react'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { ToastProvider, useToast } from './context/ToastContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Sidebar from './components/layout/Sidebar'
import Button from './components/ui/Button'
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/ui/Card'
import Input from './components/ui/Input'
import Modal from './components/ui/Modal'
import Badge from './components/ui/Badge'
import UrgencyBadge from './components/ui/UrgencyBadge'
import Skeleton, { CardSkeleton } from './components/ui/Skeleton'
import EmptyState from './components/ui/EmptyState'
import ErrorMessage from './components/ui/ErrorMessage'
import DemoBanner from './components/ui/DemoBanner'
import OfflineBanner from './components/ui/OfflineBanner'
import { Sparkles, Heart, Clock, Search, ShieldCheck } from 'lucide-react'

function DesignSystemPlayground() {
  const { isDark, toggleTheme } = useTheme()
  const { addToast } = useToast()

  // State for testing interactive elements
  const [modalOpen, setModalOpen] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('Secret123!')
  const [inputError, setInputError] = useState('')
  const [showSkeletons, setShowSkeletons] = useState(false)
  const [activeTab, setActiveTab] = useState('components')

  // Sample user for header/sidebar preview
  const [sampleUser, setSampleUser] = useState({
    name: 'Green Bakery & Cafe',
    role: 'restaurant',
  })

  const triggerLoadingTest = () => {
    setButtonLoading(true)
    setTimeout(() => {
      setButtonLoading(false)
      addToast({
        type: 'success',
        title: 'Action Succeeded',
        message: 'The asynchronous operation completed cleanly with zero delay.'
      })
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 dark:bg-charcoal-dark text-charcoal dark:text-cream-50 transition-colors">
      {/* System Banners */}
      <OfflineBanner />
      <DemoBanner />

      {/* Glassmorphic Navbar */}
      <Navbar
        user={sampleUser}
        onLogout={() => {
          setSampleUser(null)
          addToast({ type: 'info', title: 'Logged Out', message: 'You have safely ended your session.' })
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Phase 2 Header */}
        <section className="bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-3xl p-8 sm:p-10 shadow-soft relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-accent-300" />
              <span>Phase 2: Complete Design System & Reusable UI</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight">
              FoodSave AI Design Primitives
            </h1>
            <p className="text-brand-100 text-sm sm:text-base leading-relaxed">
              Carefully engineered with accessible color contrast, WCAG AA compliance, dark/light persistence,
              fluid mobile responsiveness, and high-quality reusable components.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-medium">
              <span className="px-3 py-1 rounded-lg bg-black/20">Forest Green (#16A34A)</span>
              <span className="px-3 py-1 rounded-lg bg-black/20">Warm Orange Accent (#F97316)</span>
              <span className="px-3 py-1 rounded-lg bg-black/20">Cream Canvas (#FFFBF2)</span>
              <span className="px-3 py-1 rounded-lg bg-black/20">Poppins + Inter Fonts</span>
            </div>
          </div>
        </section>

        {/* Section 1: Food Status Flow Badges */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-bold">Food Status Flow Badges</h2>
            <span className="text-xs text-gray-500">Live Status Sequence</span>
          </div>
          <Card>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              All 7 lifecycle food statuses are represented with distinct semantic color badges and animated pulsing dots for active listings:
            </p>
            <div className="flex flex-wrap gap-3 items-center">
              <Badge status="Available" />
              <Badge status="Requested" />
              <Badge status="Accepted" />
              <Badge status="Collected" />
              <Badge status="Expired" />
              <Badge status="Cancelled" />
              <Badge status="Rejected" />
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Special Urgency Indicators (Less than 2 hours to expiry)
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                <UrgencyBadge hoursLeft={1.2} />
                <UrgencyBadge hoursLeft={0.5} />
                <UrgencyBadge hoursLeft={5} />
                <UrgencyBadge hoursLeft={0} />
              </div>
            </div>
          </Card>
        </section>

        {/* Section 2: Buttons & Interactive Triggers */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-bold">Button Variants & Action Feedback</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSkeletons((p) => !p)}
            >
              Toggle Skeleton Mode: {showSkeletons ? 'ON' : 'OFF'}
            </Button>
          </div>
          <Card>
            <div className="flex flex-wrap gap-3 items-center mb-6">
              <Button variant="primary">Primary Action</Button>
              <Button variant="secondary">Warm Orange Accent</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="danger">Danger / Cancel</Button>
              <Button variant="ghost">Ghost Style</Button>
              <Button
                variant="primary"
                isLoading={buttonLoading}
                onClick={triggerLoadingTest}
              >
                Click to Test Spinner
              </Button>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-2">
              <span className="text-xs font-semibold text-gray-400 mr-2 self-center">Trigger Toasts:</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => addToast({ type: 'success', title: 'Food Rescued!', message: 'The collection request was accepted by the bakery.' })}
              >
                Success Toast
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => addToast({ type: 'warning', title: 'Expiring Soon', message: 'This item will expire in 45 minutes.' })}
              >
                Warning Toast
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => addToast({ type: 'error', title: 'Request Failed', message: 'Could not communicate with the food coordination service.' })}
              >
                Error Toast
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setModalOpen(true)}
              >
                Open Accessible Modal
              </Button>
            </div>
          </Card>
        </section>

        {/* Section 3: Accessible Form Inputs */}
        <section className="space-y-4">
          <h2 className="text-xl font-heading font-bold">Form Controls & Validation States</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardTitle>Standard Inputs</CardTitle>
              <CardDescription>Keyboard accessible, with label association and helper text</CardDescription>
              <div className="mt-4 space-y-4">
                <Input
                  label="Listing Title"
                  placeholder="e.g. 10 Loaves of Fresh Sourdough"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                  helperText="Clear, descriptive food name helps local receivers find it fast."
                />

                <Input
                  label="Password (with show/hide eye)"
                  type="password"
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                  required
                />
              </div>
            </Card>

            <Card>
              <CardTitle>Error Handling & Textareas</CardTitle>
              <CardDescription>Visual error states with role="alert" message</CardDescription>
              <div className="mt-4 space-y-4">
                <Input
                  label="Pickup Location"
                  placeholder="Street address..."
                  value=""
                  onChange={() => {}}
                  error="Pickup address is required so receivers can navigate to the donation."
                />

                <Input
                  label="Pickup Instructions"
                  rows={3}
                  placeholder="e.g. Ring the back kitchen buzzer after 8pm..."
                  helperText="Optional notes for delivery van drivers or volunteers."
                />
              </div>
            </Card>
          </div>
        </section>

        {/* Section 4: Loading & Empty States */}
        <section className="space-y-4">
          <h2 className="text-xl font-heading font-bold">Loading Skeletons & Empty States</h2>
          {showSkeletons ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EmptyState
                title="No Donations Rescued Yet"
                description="Once you post food or accept collection requests, your impact log will appear here."
                actionLabel="Create First Donation"
                onAction={() => addToast({ type: 'info', title: 'Add Food', message: 'Add Food flow will launch in Phase 6.' })}
              />

              <ErrorMessage
                title="Could not sync food inventory"
                message="We were unable to reach the food coordination server. Please verify your connection."
                onRetry={() => addToast({ type: 'success', title: 'Reconnected', message: 'Inventory refreshed successfully.' })}
              />
            </div>
          )}
        </section>

        {/* Section 5: Sidebar Preview */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-bold">Role-Based Dashboard Sidebar Preview</h2>
            <div className="flex gap-2 text-xs">
              <Button
                size="sm"
                variant={sampleUser?.role === 'restaurant' ? 'primary' : 'outline'}
                onClick={() => setSampleUser({ name: 'Sunrise Bistro', role: 'restaurant' })}
              >
                Donor View
              </Button>
              <Button
                size="sm"
                variant={sampleUser?.role === 'receiver' ? 'primary' : 'outline'}
                onClick={() => setSampleUser({ name: 'Community Kitchen NGO', role: 'receiver' })}
              >
                Receiver View
              </Button>
              <Button
                size="sm"
                variant={sampleUser?.role === 'admin' ? 'primary' : 'outline'}
                onClick={() => setSampleUser({ name: 'Site Administrator', role: 'admin' })}
              >
                Admin View
              </Button>
            </div>
          </div>
          <div className="flex rounded-3xl overflow-hidden border border-brand-100 dark:border-gray-800 shadow-soft">
            <Sidebar
              user={sampleUser}
              onLogout={() => {
                setSampleUser(null)
                addToast({ type: 'info', title: 'Signed out', message: 'User session closed.' })
              }}
            />
            <div className="flex-1 p-8 bg-white/50 dark:bg-charcoal/50 flex flex-col items-center justify-center text-center">
              <ShieldCheck className="w-12 h-12 text-brand-600 mb-3" />
              <h3 className="text-lg font-heading font-bold">
                Dashboard Canvas Area
              </h3>
              <p className="text-xs text-gray-500 max-w-md mt-1">
                The sidebar dynamically configures options based on whether the logged in role is <strong>Donor/Restaurant</strong>, <strong>NGO/Receiver</strong>, or <strong>Admin</strong>.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Accessible Interactive Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm Food Collection"
        description="Please confirm you have volunteers ready for pickup at the scheduled time."
      >
        <div className="space-y-4">
          <div className="p-3.5 bg-cream-100 dark:bg-gray-800 rounded-2xl border border-brand-100 dark:border-gray-700 text-xs space-y-1">
            <p><strong>Item:</strong> 15 Loaves Artisan Bread</p>
            <p><strong>Donor:</strong> Green Bakery (Downtown)</p>
            <p><strong>Window:</strong> Today, 6:00 PM - 8:30 PM</p>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            By accepting, you commit to food safety standards and prompt collection before expiration.
          </p>
          <div className="flex items-center justify-end gap-3 pt-3">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setModalOpen(false)
                addToast({ type: 'success', title: 'Confirmed!', message: 'Pickup details sent to donor.' })
              }}
            >
              Confirm Collection
            </Button>
          </div>
        </div>
      </Modal>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <DesignSystemPlayground />
      </ToastProvider>
    </ThemeProvider>
  )
}
