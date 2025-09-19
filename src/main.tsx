import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { GlobalStyles } from './styles/GlobalStyles'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalStyles />
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#2d2d2d',
          color: '#ffffff',
          border: '1px solid #404040'
        }
      }}
    />
  </React.StrictMode>
)
