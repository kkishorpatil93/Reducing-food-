import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7)
    const newToast = { id, type, title, message }

    setToasts((prev) => [...prev, newToast])

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
    return id
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast Notification Container with Accessibility aria-live */}
      <div 
        aria-live="polite" 
        aria-atomic="true"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onClose }) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />
  }

  const borderColors = {
    success: 'border-l-4 border-l-brand-500',
    error: 'border-l-4 border-l-red-500',
    warning: 'border-l-4 border-l-amber-500',
    info: 'border-l-4 border-l-blue-500'
  }

  return (
    <div
      role="status"
      className={`pointer-events-auto flex items-start gap-3 p-4 bg-white dark:bg-charcoal text-charcoal dark:text-cream-50 rounded-xl shadow-soft-hover border border-gray-100 dark:border-gray-800 ${borderColors[toast.type] || borderColors.info} animate-slide-in transition-all`}
    >
      {icons[toast.type] || icons.info}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <h4 className="text-sm font-semibold leading-tight mb-0.5">{toast.title}</h4>
        )}
        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        aria-label="Dismiss notification"
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors shrink-0 p-1 rounded-md"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
