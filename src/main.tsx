import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { PreferredCityProvider } from './context/PreferredCityContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PreferredCityProvider>
        <App />
      </PreferredCityProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
