import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Root element not found')
}

try {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <BrowserRouter basename="/">
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  )
} catch (error) {
  console.error('Failed to render app:', error)
  root.innerHTML = '<div style="padding: 20px; color: red;">Failed to load admin panel. Check console for errors.</div>'
}