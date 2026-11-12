import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import ComingSoonPage from './components/ComingSoonPage'
import ErrorBoundary from './components/ErrorBoundary'
import { PreferredCityProvider } from './context/PreferredCityContext'
import './index.css'
import { initTheme } from './lib/theme'

// Hasta el lanzamiento, el dominio público muestra la página de «Próximamente».
// En local y en las vistas previas de Vercel se sigue viendo la app.
// Para lanzar la web, cambia LAUNCHED a true.
const LAUNCHED = false
const PUBLIC_HOST = /^(www\.)?plancerca\.com$/
const showComingSoon = !LAUNCHED && PUBLIC_HOST.test(window.location.hostname)

initTheme()

ReactDOM.createRoot(document.getElementById('root')!).render(
  showComingSoon ? (
    <ComingSoonPage />
  ) : (
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <PreferredCityProvider>
            <App />
          </PreferredCityProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  ),
)
