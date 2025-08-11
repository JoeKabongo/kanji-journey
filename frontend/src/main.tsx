import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { GoogleOAuthProvider } from '@react-oauth/google'

import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </GoogleOAuthProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>
)
