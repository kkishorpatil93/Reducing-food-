import React, { useRef } from 'react'
import { Printer, CheckCircle2, ShieldCheck, Download, X } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'

export default function ReceiptModal({ isOpen, onClose, donation }) {
  if (!donation) return null

  const receiptId = `RCP-${donation.id?.replace('food_', '').replace('req_', '') || Date.now()}`
  const dateFormatted = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const handlePrint = () => {
    window.print()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Donation Receipt"
      description="Record of surplus food transfer for community welfare."
      maxWidth="max-w-xl"
    >
      <div className="space-y-6 text-charcoal dark:text-cream-50" id="printable-receipt">
        
        {/* Receipt Header */}
        <div className="p-6 bg-cream-50 dark:bg-charcoal-dark rounded-2xl border border-brand-100 dark:border-gray-800 text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl font-heading font-extrabold text-brand-700 dark:text-brand-400">
              FoodSave AI
            </span>
            <span className="text-xs bg-brand-600 text-white px-2 py-0.5 rounded-full font-bold">
              VERIFIED
            </span>
          </div>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
            Zero Waste Surplus Transfer Certificate
          </p>
          <div className="pt-2 text-xs font-mono text-gray-400">
            Receipt ID: <strong className="text-charcoal dark:text-cream-100">{receiptId}</strong> • Date: {dateFormatted}
          </div>
        </div>

        {/* Item & Participant Summary */}
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-white dark:bg-charcoal rounded-xl border border-gray-100 dark:border-gray-800">
              <span className="text-gray-400 block mb-1">Donor Entity:</span>
              <strong className="text-sm block">{donation.donor?.name || donation.donorName || 'Green Bakery & Cafe'}</strong>
              <span className="text-gray-500 text-[11px]">{donation.pickupLocation || '42 Baker Street, Downtown'}</span>
            </div>

            <div className="p-3.5 bg-white dark:bg-charcoal rounded-xl border border-gray-100 dark:border-gray-800">
              <span className="text-gray-400 block mb-1">Recipient Organization:</span>
              <strong className="text-sm block">{donation.receiver?.name || 'Food For All Community Care'}</strong>
              <span className="text-gray-500 text-[11px]">Registered Non-Profit Partner</span>
            </div>
          </div>

          {/* Rescued Item Table */}
          <div className="p-4 bg-white dark:bg-charcoal rounded-xl border border-gray-100 dark:border-gray-800 space-y-2">
            <div className="flex justify-between font-bold border-b border-gray-100 dark:border-gray-800 pb-2">
              <span>Item Description</span>
              <span>Quantity</span>
            </div>
            <div className="flex justify-between py-1">
              <div>
                <span className="font-semibold block">{donation.title || donation.food?.title}</span>
                <span className="text-[11px] text-gray-500">{donation.category || 'Surplus Meals'}</span>
              </div>
              <span className="font-bold text-brand-600 dark:text-brand-400">
                {donation.quantity || donation.food?.quantity} {donation.unit || donation.food?.unit}
              </span>
            </div>
          </div>
        </div>

        {/* Legal & Tax Disclaimer */}
        <div className="p-3.5 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-700 text-[11px] text-gray-500 space-y-1 leading-relaxed">
          <p className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
            <span>Good Samaritan Food Donation Act Protection</span>
          </p>
          <p>
            This donation was made in good faith without charge. Donors and non-profits are protected under applicable food donation statutes. Retain this digital document for corporate tax deduction records and zero-waste ESG reports.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 print:hidden">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print Receipt
          </Button>
        </div>

      </div>
    </Modal>
  )
}
