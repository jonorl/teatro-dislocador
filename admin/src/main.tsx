// main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ClerkProvider } from '@clerk/clerk-react'

const isProd = import.meta.env.MODE === "PROD" || import.meta.env.PROD;

const clerkPublishableKey = isProd
  ? import.meta.env.VITE_DISLOCADOR_PROD_PUBLIC_CLERK_PUBLISHABLE_KEY
  : import.meta.env.VITE_DISLOCADOR_DEV_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error("Missing Clerk Publishable Key");
}

// In production, force the engine to load directly from your verified subdomain
const providerProps = {
  publishableKey: clerkPublishableKey,
  signInFallbackRedirectUrl: "/admin",
  signUpFallbackRedirectUrl: "/admin",
  ...(isProd ? {
    clerkJSUrl: "https://frontend-api.clerk.services/npm/@clerk/clerk-js@5/dist/clerk.browser.js"
  } : {})
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider {...providerProps}>
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)