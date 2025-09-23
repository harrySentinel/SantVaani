import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { AdminAuthProvider } from '@/contexts/AdminAuthContext'
import AdminProtectedRoute from '@/components/AdminProtectedRoute'
import Layout from '@/components/Layout'
import Dashboard from '@/pages/Dashboard'
import SaintsPage from '@/pages/Saints'
import LivingSaintsPage from '@/pages/LivingSaints'
import DivineFormsPage from '@/pages/DivineForms'
import BhajansPage from '@/pages/Bhajans'
import QuotesPage from '@/pages/Quotes'
import SpiritualFactsPage from '@/pages/SpiritualFacts'
import EventsPage from '@/pages/Events'

// All content management pages are now complete

function App() {
  console.log('App component rendering...')

  return (
    <AdminAuthProvider>
      <AdminProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Default route redirects to dashboard */}
              <Route index element={<Navigate to="/dashboard" replace />} />

              {/* Dashboard */}
              <Route path="dashboard" element={<Dashboard />} />

              {/* Content Management Pages */}
              <Route path="saints" element={<SaintsPage />} />

              {/* Living Saints Management */}
              <Route path="living-saints" element={<LivingSaintsPage />} />

              {/* Divine Forms Management */}
              <Route path="divine-forms" element={<DivineFormsPage />} />

              {/* Bhajans Management */}
              <Route path="bhajans" element={<BhajansPage />} />

              {/* Quotes Management */}
              <Route path="quotes" element={<QuotesPage />} />

              {/* Spiritual Facts Management */}
              <Route path="spiritual-facts" element={<SpiritualFactsPage />} />

              {/* Events Management */}
              <Route path="events" element={<EventsPage />} />

              {/* 404 fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>

          <Toaster />
        </div>
      </AdminProtectedRoute>
    </AdminAuthProvider>
  )
}

export default App