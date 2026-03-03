import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ModeProvider } from './context/ModeContext'
import AppRouter from './routes/AppRouter'  // ← fixed: routes not router
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ModeProvider>
          <AppRouter />
        </ModeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)