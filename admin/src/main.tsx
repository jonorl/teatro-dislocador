// main.tsx or index.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'

// Determine the key based on Vite's mode context
const isProd = import.meta.env.MODE === "PROD" || import.meta.env.PROD;

const clerkPublishableKey = isProd
  ? import.meta.env.VITE_DISLOCADOR_PROD_PUBLIC_CLERK_PUBLISHABLE_KEY
  : import.meta.env.VITE_DISLOCADOR_DEV_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error("Missing Clerk Publishable Key");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPublishableKey} afterSignOutUrl="/admin">
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)