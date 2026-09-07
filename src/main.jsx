import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/variables.css'
import './styles/global.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import RecuperarSenha from './pages/RecuperarSenha.jsx'
import {
  EVENTO_SESSAO_ENCERRADA,
  limparSessaoLocal,
  logout,
  validarSessao,
} from './services/authService.js'

function Root() {
  const [usuario, setUsuario] = useState(null)
  const [carregandoSessao, setCarregandoSessao] = useState(true)
  const [view, setView] = useState('login') 

  useEffect(() => {
    async function carregarSessao() {
      try {
        setUsuario(await validarSessao())
      } catch {
        limparSessaoLocal()
        setUsuario(null)
      } finally {
        setCarregandoSessao(false)
      }
    }

    function encerrarSessao() {
      setUsuario(null)
      setCarregandoSessao(false)
    }

    function sincronizarLogout(evento) {
      if (evento.key === 'loggedIn' && evento.newValue !== 'true') {
        encerrarSessao()
      }
    }

    window.addEventListener(EVENTO_SESSAO_ENCERRADA, encerrarSessao)
    window.addEventListener('storage', sincronizarLogout)
    carregarSessao()

    return () => {
      window.removeEventListener(EVENTO_SESSAO_ENCERRADA, encerrarSessao)
      window.removeEventListener('storage', sincronizarLogout)
    }
  }, [])

  if (carregandoSessao) {
    return null
  }

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

  return (
    <Login
      aoLoginComSucesso={(usuarioAutenticado) => {
        setUsuario(usuarioAutenticado)
      }}
      aoEsquecerSenha={() => setView('recuperar-senha')}
    />
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)