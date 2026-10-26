import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LogIn, Lock, Mail, Sparkles, ArrowRight } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../context/ToastContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { isValidEmail } from '../../utils/validators'

export default function LoginPage() {
  const { login } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Demo accounts for rapid one-click testing
  const demoAccounts = [
    { label: 'Restaurant', email: 'donor@greenbakery.com', pass: 'Password123!' },
    { label: 'Farm Donor', email: 'farm@sunrise.com', pass: 'Password123!' },
    { label: 'NGO Receiver', email: 'ngo@foodforall.org', pass: 'Password123!' },
    { label: 'Admin', email: 'admin@foodsave.ai', pass: 'Password123!' },
  ]

  const handleFillDemo = (acc) => {
    setFormData({ email: acc.email, password: acc.pass })
    setErrors({})
  }

  const validate = () => {
    const errs = {}
    if (!formData.email) {
      errs.email = 'Email address is required.'
    } else if (!isValidEmail(formData.email)) {
      errs.email = 'Please enter a valid email address.'
    }
    if (!formData.password) {
      errs.password = 'Password is required.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await login(formData)
      addToast({
        type: 'success',
        title: 'Welcome Back!',
        message: `Signed in as ${response.user.name} (${response.user.role}).`
      })
      navigate(from, { replace: true })
    } catch (err) {
      setErrors({ form: err.message || 'Invalid email or password.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-md">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-charcoal dark:text-cream-50">
            Sign In to FoodSave AI
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Rescue surplus meals, support communities, and eliminate food waste.
          </p>
        </div>

        {/* Demo Fast-Fill Bar */}
        <div className="p-3 bg-brand-50 dark:bg-brand-950/40 rounded-2xl border border-brand-100 dark:border-brand-900/60 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-800 dark:text-brand-300">
            <Sparkles className="w-3.5 h-3.5 text-accent-500" />
            <span>Fast One-Click Demo Logins:</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {demoAccounts.map((acc) => (
              <button
                key={acc.label}
                type="button"
                onClick={() => handleFillDemo(acc)}
                className="px-2 py-1.5 bg-white dark:bg-charcoal rounded-xl text-[11px] font-medium text-gray-700 dark:text-gray-200 hover:border-brand-500 border border-gray-200 dark:border-gray-700 transition-colors shadow-xs"
              >
                {acc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Login Form Card */}
        <Card className="p-6 sm:p-8 space-y-5">
          {errors.form && (
            <div
              role="alert"
              className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 rounded-xl text-xs text-red-600 dark:text-red-400 font-medium"
            >
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input
              id="login-email"
              label="Email Address"
              type="email"
              placeholder="e.g. donor@greenbakery.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value })
                if (errors.email) setErrors({ ...errors, email: null })
              }}
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email}
              required
              autoComplete="email"
            />

            <div>
              <Input
                id="login-password"
                label="Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value })
                  if (errors.password) setErrors({ ...errors, password: null })
                }}
                leftIcon={<Lock className="w-4 h-4" />}
                error={errors.password}
                required
                autoComplete="current-password"
              />
              <div className="flex justify-end mt-1.5">
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 text-center text-xs text-gray-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              Create an account
            </Link>
          </div>
        </Card>

      </div>
    </div>
  )
}
