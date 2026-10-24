import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { WebGLErrorBoundary } from './WebGLErrorBoundary'
import './index.css'

// If anything crashes while rendering, show a friendly page instead of a blank screen.
const CrashFallback = (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center', fontFamily: 'Inter, sans-serif', color: '#1c1c1e', background: '#fafaf9' }}>
    <h1 style={{ fontSize: 24, fontWeight: 800, color: '#7A0000' }}>Something went wrong</h1>
    <p style={{ marginTop: 8, maxWidth: 420, fontSize: 14, color: '#6b7280' }}>
      Please refresh the page. If it keeps happening, message us on Facebook and we'll help you book your phone.
    </p>
    <button onClick={() => window.location.reload()} style={{ marginTop: 20, padding: '10px 20px', borderRadius: 12, border: 0, background: '#7A0000', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
      Refresh
    </button>
  </div>
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WebGLErrorBoundary fallback={CrashFallback}>
      <App />
    </WebGLErrorBoundary>
  </React.StrictMode>,
)
