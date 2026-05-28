import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App'
import './index.css'

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
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)