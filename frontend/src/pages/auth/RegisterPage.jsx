import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, Utensils, Sprout, Building2, HeartHandshake, Lock, Mail, User, Phone, Check } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../context/ToastContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { isValidEmail, isValidPassword } from '../../utils/validators'

export default function RegisterPage() {
  const { register } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [role, setRole] = useState('restaurant')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    organizationName: '',
    agreeTerms: false,
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const rolesList = [
    {
      id: 'restaurant',
      label: 'Restaurant / Cafe',
      description: 'Donate prepared meals, bakery goods, and daily surplus.',
      icon: Utensils,
    },
    {
      id: 'donor',
      label: 'Farm / Food Producer',
      description: 'Share harvest surplus, imperfect produce, or groceries.',
      icon: Sprout,
    },
    {
      id: 'ngo',
      label: 'NGO / Charity / Shelter',
      description: 'Rescue and distribute meals to local communities.',
      icon: Building2,
    },
    {
      id: 'receiver',
      label: 'Individual Receiver',
      description: 'Find food assistance for yourself or your family.',
      icon: HeartHandshake,
    },
  ]

  const validate = () => {
    const errs = {}
    if (!formData.name.trim()) errs.name = 'Full name is required.'
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.'
    } else if (!isValidEmail(formData.email)) {
      errs.email = 'Please enter a valid email address.'
    }
    if (!formData.password) {
      errs.password = 'Password is required.'
    } else if (!isValidPassword(formData.password)) {
      errs.password = 'Password must be at least 6 characters.'
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required for food pickup coordination.'
    }
    if ((role === 'restaurant' || role === 'ngo') && !formData.organizationName.trim()) {
      errs.organizationName = 'Organization or business name is required.'
    }
    if (!formData.agreeTerms) {
      errs.agreeTerms = 'You must agree to community food safety standards.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await register({
        ...formData,
        role,
      })
      addToast({
        type: 'success',
        title: 'Account Created Successfully!',
        message: `Welcome to FoodSave AI, ${response.user.name}.`
      })
      navigate('/')
    } catch (err) {
      setErrors({ form: err.message || 'Registration failed. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <div className="text-center space-y-2 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-md">
          <UserPlus className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-charcoal dark:text-cream-50">
          Create Your FoodSave Account
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Select your role to get matched with donors or community food shelters.
        </p>
      </div>

      <Card className="p-6 sm:p-8 space-y-6">
        {errors.form && (
          <div role="alert" className="p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 rounded-xl text-xs text-red-600 dark:text-red-400 font-medium">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          
          {/* Step 1: Role Selection Cards */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              1. Select Your Role <span className="text-accent-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rolesList.map((r) => {
                const Icon = r.icon
                const isSelected = role === r.id
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl text-left border transition-all ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50/70 dark:bg-brand-950/40 shadow-sm ring-1 ring-brand-600'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-charcoal hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-brand-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-charcoal dark:text-cream-50">{r.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />}
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                        {r.description}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step 2: Account Details */}
          <div className="space-y-4 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 block">
              2. Account Information
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name / Primary Contact"
                placeholder="Jane Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                leftIcon={<User className="w-4 h-4" />}
                error={errors.name}
                required
              />

              <Input
                label="Phone Number (for pickup)"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                leftIcon={<Phone className="w-4 h-4" />}
                error={errors.phone}
                required
              />
            </div>

            {(role === 'restaurant' || role === 'ngo') && (
              <Input
                label={role === 'restaurant' ? 'Restaurant / Business Name' : 'NGO / Shelter Organization Name'}
                placeholder="e.g. Green Bakery LLC"
                value={formData.organizationName}
                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                error={errors.organizationName}
                required
              />
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="jane@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email}
              required
            />

            <Input
              label="Password (min 6 characters)"
              type="password"
              placeholder="Create strong password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.password}
              required
            />
          </div>

          {/* Step 3: Terms Agreement */}
          <div className="space-y-1">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                className="mt-0.5 w-4 h-4 text-brand-600 rounded border-gray-300 focus:ring-brand-500"
              />
              <span className="text-xs text-gray-600 dark:text-gray-300 leading-snug">
                I agree to the <strong>Food Safety Guidelines</strong>, Good Samaritan food standards, and confirm that all donated surplus is wholesome and stored at safe temperatures.
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="text-xs text-red-500 font-medium pl-6">{errors.agreeTerms}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isSubmitting}
          >
            Complete Registration
          </Button>

          <p className="text-center text-xs text-gray-500 pt-2">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              Sign in to your account
            </Link>
          </p>
        </form>
      </Card>
    </div>
  )
}
