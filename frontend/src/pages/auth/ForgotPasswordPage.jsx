import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { KeyRound, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { isValidEmail } from '../../utils/validators'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) {
      setError('Please provide your email address.')
      return
    }
    if (!isValidEmail(email)) {
      setError('Please provide a valid email address.')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 600)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-accent-500 text-white flex items-center justify-center mx-auto shadow-md">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-charcoal dark:text-cream-50">
            Reset Your Password
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Enter your account email and we'll send you instructions to reset your password.
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold text-charcoal dark:text-cream-50">
                  Password Reset Email Sent
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto leading-relaxed">
                  If an account exists for <strong>{email}</strong>, you will receive password reset instructions shortly.
                </p>
              </div>
              <div className="pt-2">
                <Link to="/login">
                  <Button variant="primary" size="md" className="w-full">
                    Return to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="e.g. donor@greenbakery.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError('')
                }}
                leftIcon={<Mail className="w-4 h-4" />}
                error={error}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isSubmitting}
              >
                Send Reset Link
              </Button>

              <div className="pt-3 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-charcoal dark:hover:text-cream-50 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </Card>

      </div>
    </div>
  )
}
