import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/variables.css'
import './styles/global.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import RecuperarSenha from './pages/RecuperarSenha.jsx'


function Root() {
  const [loggedIn, setLoggedIn] = useState(
    () => localStorage.getItem('loggedIn') === 'true'
  )
  const [view, setView] = useState('login') // 'login' | 'recuperar-senha'

  if (loggedIn) {
    return <App />
  }

  if (view === 'recuperar-senha') {
    return <RecuperarSenha onVoltar={() => setView('login')} />
  }

  return (
    <Login
      onLoginSuccess={() => {
        localStorage.setItem('loggedIn', 'true')
        setLoggedIn(true)
      }}
      onForgotPassword={() => setView('recuperar-senha')}
    />
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)