import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/variables.css'
import './styles/global.css'
import './styles/alto-contraste.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import RecuperarSenha from './pages/RecuperarSenha.jsx'
import RedefinirSenha from './pages/RedefinirSenha.jsx'
import {
  EVENTO_SESSAO_ENCERRADA,
  limparSessaoLocal,
  logout,
} from './services/authService.js'
import { iniciarAltoContraste } from './utils/altoContraste.js'

function Root() {
  const [usuario, setUsuario] = useState(null)
  const [view, setView] = useState(() => (
    window.location.pathname === '/redefinir-senha' ? 'redefinir-senha' : 'login'
  ))

  useEffect(() => {
    limparSessaoLocal()

    function encerrarSessao() {
      setUsuario(null)
    }

    function sincronizarLogout(evento) {
      if (evento.key === 'loggedIn' && evento.newValue !== 'true') {
        encerrarSessao()
      }
    }

    window.addEventListener(EVENTO_SESSAO_ENCERRADA, encerrarSessao)
    window.addEventListener('storage', sincronizarLogout)

    return () => {
      window.removeEventListener(EVENTO_SESSAO_ENCERRADA, encerrarSessao)
      window.removeEventListener('storage', sincronizarLogout)
    }
  }, [])

  if (usuario) {
    return (
      <App
        usuario={usuario}
        onSair={() => {
          limparSessaoLocal()
          setUsuario(null)
          void logout().catch(() => {})
        }}
      />
    )
  }

  if (view === 'recuperar-senha') {
    return <RecuperarSenha onVoltar={() => setView('login')} />
  }

  if (view === 'redefinir-senha') {
    return (
      <RedefinirSenha
        aoVoltar={() => {
          window.history.replaceState({}, '', '/')
          setView('login')
        }}
      />
    )
  }

  return (
    <Login
      aoLoginComSucesso={(usuarioAutenticado) => {
        setUsuario(usuarioAutenticado)
      }}
      aoEsquecerSenha={() => setView('recuperar-senha')}
    />
  )
}

iniciarAltoContraste()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)