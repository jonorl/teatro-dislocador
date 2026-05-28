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

const providerProps = {
  publishableKey: clerkPublishableKey,
  signInFallbackRedirectUrl: "/admin",
  signUpFallbackRedirectUrl: "/admin",
  ...(isProd ? {
    // Force the frontend to fetch the auth engine from your verified auth subdomain
    clerkJSUrl: "https://clerk.teatrodislocador.ar/npm/@clerk/clerk-js@5/dist/clerk.browser.js"
  } : {})
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider {...providerProps} >
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)