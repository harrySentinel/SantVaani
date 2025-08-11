import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import Layout from '@/components/Layout'
import Dashboard from '@/pages/Dashboard'
import SaintsPage from '@/pages/Saints'
import LivingSaintsPage from '@/pages/LivingSaints'
import DivineFormsPage from '@/pages/DivineForms'
import BhajansPage from '@/pages/Bhajans'
import QuotesPage from '@/pages/Quotes'

// All content management pages are now complete

function App() {
  console.log('App component rendering...')
  
  return (
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
          
          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
      
      <Toaster />
    </div>
  )
}

export default App