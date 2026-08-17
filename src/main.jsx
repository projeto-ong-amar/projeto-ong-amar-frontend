import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/variables.css'
import './styles/global.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'

/**
 * Root — front-end only auth gate (no backend involved).
 * Shows the Login page until the person "logs in", then renders the App
 * shell. The logged-in state is remembered locally so a page refresh
 * doesn't bounce back to the login screen.
 */
function Root() {
  const [loggedIn, setLoggedIn] = useState(
    () => localStorage.getItem('loggedIn') === 'true'
  )

  if (!loggedIn) {
    return (
      <Login
        onLoginSuccess={() => {
          localStorage.setItem('loggedIn', 'true')
          setLoggedIn(true)
        }}
      />
    )
  }

  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)