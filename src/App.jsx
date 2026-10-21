import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { LanguageProvider } from '@/context/LanguageContext'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'
import { Navbar } from '@/components/common/Navbar'
import { Footer } from '@/components/common/Footer'
import { AIAssistantModal } from '@/components/AIAssistantModal'
import { AuthPromptModal } from '@/components/AuthPromptModal'

// Pages
import { Home } from '@/pages/Home'
import { SearchPage } from '@/pages/Search'
import { Categories } from '@/pages/Categories'
import { BusinessDetailPage } from '@/pages/BusinessDetail'
import { RegisterBusinessPage } from '@/pages/RegisterBusiness'
import { ClaimBusinessPage } from '@/pages/ClaimBusiness'
import { CustomerDashboard } from '@/pages/customer/CustomerDashboard'
import { CustomerBookingsPage } from '@/pages/customer/CustomerBookingsPage'
import { OwnerDashboard } from '@/pages/owner/OwnerDashboard'
import { OwnerBookingsPage } from '@/pages/owner/OwnerBookingsPage'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { LoginPage } from '@/pages/Login'
import { RegisterPage } from '@/pages/Register'
import { PrivacyPolicy } from '@/pages/PrivacyPolicy'
import { TermsOfService } from '@/pages/TermsOfService'
import { HelpSupport } from '@/pages/HelpSupport'

function AppShell() {
  const [aiModalOpen, setAiModalOpen] = useState(false)
  const { user, loading } = useAuth()
  const location = useLocation()
  const [authPromptOpen, setAuthPromptOpen] = useState(false)

  // Prompt visitor to sign in or register upon first entering the application
  useEffect(() => {
    if (!loading && !user) {
      const isAuthRoute = location.pathname === '/login' || location.pathname === '/register'
      const dismissed = sessionStorage.getItem('nearzy_auth_prompt_dismissed')
      if (!isAuthRoute && !dismissed) {
        setAuthPromptOpen(true)
      }
    }
  }, [loading, user, location.pathname])

  const handleCloseAuthPrompt = () => {
    setAuthPromptOpen(false)
    sessionStorage.setItem('nearzy_auth_prompt_dismissed', 'true')
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-black font-sans antialiased">
      {/* Global Navigation */}
      <Navbar 
        onOpenAiModal={() => setAiModalOpen(true)} 
        onOpenAuthModal={() => setAuthPromptOpen(true)}
      />

      {/* Main Routed Page Content with Smooth Animated Transmissions */}
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home onOpenAiModal={() => setAiModalOpen(true)} />} />
            <Route path="/search" element={<SearchPage onOpenAiModal={() => setAiModalOpen(true)} />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/business/:slug" element={<BusinessDetailPage />} />
            <Route path="/register-business" element={<RegisterBusinessPage />} />
            <Route path="/claim-business" element={<ClaimBusinessPage />} />
            <Route path="/dashboard" element={<CustomerDashboard />} />
            <Route path="/bookings" element={<CustomerBookingsPage />} />
            <Route path="/my-bookings" element={<CustomerBookingsPage />} />
            <Route path="/owner-dashboard" element={<OwnerDashboard />} />
            <Route path="/owner/bookings" element={<OwnerBookingsPage />} />
            <Route path="/owner-bookings" element={<OwnerBookingsPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/support" element={<HelpSupport onOpenAiModal={() => setAiModalOpen(true)} />} />
            <Route path="/help" element={<HelpSupport onOpenAiModal={() => setAiModalOpen(true)} />} />
            <Route path="/help-support" element={<HelpSupport onOpenAiModal={() => setAiModalOpen(true)} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />

      {/* Welcome Entrance Sign In / Register Prompt Modal */}
      <AuthPromptModal
        isOpen={authPromptOpen}
        onClose={handleCloseAuthPrompt}
      />

      {/* Global AI Assistant Modal */}
      <AIAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
      />
    </div>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppShell />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
