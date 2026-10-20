import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from '@/context/LanguageContext'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'
import { Navbar } from '@/components/common/Navbar'
import { Footer } from '@/components/common/Footer'
import { AIAssistantModal } from '@/components/AIAssistantModal'

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

function App() {
  const [aiModalOpen, setAiModalOpen] = useState(false)

  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-neutral-50 text-black font-sans antialiased">
              {/* Global Navigation */}
              <Navbar onOpenAiModal={() => setAiModalOpen(true)} />

              {/* Main Routed Page Content */}
              <main className="flex-1">
                <Routes>
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
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              {/* Footer */}
              <Footer />

              {/* Global AI Assistant Modal */}
              <AIAssistantModal
                isOpen={aiModalOpen}
                onClose={() => setAiModalOpen(false)}
              />
            </div>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
