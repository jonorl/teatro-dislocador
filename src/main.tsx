import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import TeatroDislocadorApp from './App.tsx'
import AdminDashboard from './AdminDashboard.tsx'

// Grab your development or production Publishable Key from .env
// Check if the Vite environment mode is explicitly 'production'
const isProd = import.meta.env.MODE === "production";

const CLERK_PUBLISHABLE_KEY = isProd
  ? import.meta.env.VITE_DISLOCADOR_PUBLIC_CLERK_PUBLISHABLE_KEY
  : import.meta.env.VITE_DISLOCADOR_DEV_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key")
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<TeatroDislocadorApp />} />
          
          {/* Private CMS Panel */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)