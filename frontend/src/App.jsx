import React from 'react'

export default function App() {
  return (
    <div className="min-h-screen bg-cream-100 dark:bg-charcoal-dark text-charcoal dark:text-cream-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white dark:bg-charcoal rounded-3xl p-8 shadow-soft border border-brand-100 dark:border-gray-800 text-center">
        <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-5 text-2xl font-bold shadow-sm">
          🌱
        </div>
        <h1 className="text-3xl font-heading font-bold text-brand-700 dark:text-brand-400 mb-2">
          FoodSave AI
        </h1>
        <p className="text-sm uppercase tracking-wider font-semibold text-accent-500 mb-4">
          Phase 1: Environment & Project Setup Ready
        </p>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
          Vite, React 19, Tailwind CSS, React Router, and Axios are configured. 
          Ready to construct our design system and reusable UI components in Phase 2.
        </p>

        <div className="grid grid-cols-2 gap-3 text-xs text-left mb-6 font-medium">
          <div className="p-3 bg-brand-50 dark:bg-gray-800 rounded-xl border border-brand-100 dark:border-gray-700">
            <span className="text-brand-600 font-bold">✓ Palette:</span> Warm Cream + Forest Green + Orange
          </div>
          <div className="p-3 bg-brand-50 dark:bg-gray-800 rounded-xl border border-brand-100 dark:border-gray-700">
            <span className="text-brand-600 font-bold">✓ Fonts:</span> Poppins (Headings) & Inter (Body)
          </div>
          <div className="p-3 bg-brand-50 dark:bg-gray-800 rounded-xl border border-brand-100 dark:border-gray-700">
            <span className="text-brand-600 font-bold">✓ Branch:</span> feature/frontend-phase1
          </div>
          <div className="p-3 bg-brand-50 dark:bg-gray-800 rounded-xl border border-brand-100 dark:border-gray-700">
            <span className="text-brand-600 font-bold">✓ Contract:</span> docs/api-contract.md
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-semibold transition-all shadow-sm">
          Awaiting Phase 2: Design System
        </div>
      </div>
    </div>
  )
}
