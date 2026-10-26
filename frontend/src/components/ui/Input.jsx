import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function Input({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  required = false,
  leftIcon,
  rightIcon,
  className = '',
  rows,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)
  const inputId = id || name || `input-${Math.random().toString(36).substring(2, 7)}`
  const errorId = `${inputId}-error`
  const helperId = `${inputId}-helper`

  const isPassword = type === 'password'
  const computedType = isPassword ? (showPassword ? 'text' : 'password') : type

  const baseInputStyles = `w-full rounded-xl border bg-white dark:bg-charcoal text-charcoal dark:text-cream-50 placeholder-gray-400 dark:placeholder-gray-500 text-sm transition-all duration-150 focus:outline-none focus:ring-2 disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:opacity-60 disabled:cursor-not-allowed ${
    error
      ? 'border-red-400 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900/40'
      : 'border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-brand-200 dark:focus:ring-brand-900/30'
  } ${leftIcon ? 'pl-10' : 'pl-4'} ${rightIcon || isPassword ? 'pr-11' : 'pr-4'} py-2.5`

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300"
        >
          {label} {required && <span className="text-accent-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-gray-400 dark:text-gray-500 pointer-events-none flex items-center">
            {leftIcon}
          </div>
        )}

        {rows ? (
          <textarea
            id={inputId}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            rows={rows}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={`${baseInputStyles} py-3`}
            {...props}
          />
        ) : (
          <input
            id={inputId}
            name={name}
            type={computedType}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={baseInputStyles}
            {...props}
          />
        )}

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}

        {!isPassword && rightIcon && (
          <div className="absolute right-3.5 text-gray-400 dark:text-gray-500 pointer-events-none flex items-center">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <span id={errorId} role="alert" className="text-xs text-red-500 font-medium">
          {error}
        </span>
      ) : helperText ? (
        <span id={helperId} className="text-xs text-gray-500 dark:text-gray-400">
          {helperText}
        </span>
      ) : null}
    </div>
  )
}
