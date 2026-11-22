import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { store } from './app/store'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            // Dark toasts that match the app (gray-800 card, gray-100 text)
            style: {
              background: '#1f2937',
              color: '#f3f4f6',
              border: '1px solid #374151',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#1f2937' } },
            error: { iconTheme: { primary: '#f87171', secondary: '#1f2937' } },
          }}
        />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)