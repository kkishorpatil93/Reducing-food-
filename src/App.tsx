import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useDonationStore } from './store/donationStore';
import { DemoBanner } from './components/DemoBanner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ChatAssistant } from './components/ChatAssistant';
import { QuickDonationModal } from './components/QuickDonationModal';
import { MobileBottomNav } from './components/MobileBottomNav';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DonorDashboard } from './pages/DonorDashboard';
import { VolunteerDashboard } from './pages/VolunteerDashboard';
import { NgoDashboard } from './pages/NgoDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { BrowseDonationsPage } from './pages/BrowseDonationsPage';
import { DonationDetailsPage } from './pages/DonationDetailsPage';
import { MapViewPage } from './pages/MapViewPage';
import { ImpactDashboardPage } from './pages/ImpactDashboardPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { TrustSafetyPage } from './pages/TrustSafetyPage';

export function App() {
  const { initAuth } = useAuthStore();
  const { setupSse, fetchDonations, fetchStats, fetchNotifications } = useDonationStore();
  const [quickDonateOpen, setQuickDonateOpen] = useState(false);

  useEffect(() => {
    initAuth();
    setupSse();
    fetchDonations();
    fetchStats();
    fetchNotifications();
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
        {/* Top Persistent Hackathon Demo Bar */}
        <DemoBanner />

        {/* Responsive Navbar */}
        <Navbar onOpenQuickDonate={() => setQuickDonateOpen(true)} />

        {/* Main Content View */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage onOpenQuickDonate={() => setQuickDonateOpen(true)} />} />
            <Route path="/donor" element={<DonorDashboard />} />
            <Route path="/volunteer" element={<VolunteerDashboard />} />
            <Route path="/ngo" element={<NgoDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/donations" element={<BrowseDonationsPage />} />
            <Route path="/donations/:id" element={<DonationDetailsPage />} />
            <Route path="/map" element={<MapViewPage />} />
            <Route path="/impact" element={<ImpactDashboardPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/trust" element={<TrustSafetyPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Floating Rule-Based Assistant Chat Widget */}
        <ChatAssistant />

        {/* Quick Donation Modal */}
        <QuickDonationModal
          isOpen={quickDonateOpen}
          onClose={() => setQuickDonateOpen(false)}
        />

        {/* Mobile Persistent Bottom Tab Bar (Screen width < 768px) */}
        <MobileBottomNav onOpenQuickDonate={() => setQuickDonateOpen(true)} />

        {/* Comprehensive Accessible Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
