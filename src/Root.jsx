import { useEffect, useState } from 'react'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import RecuperarSenha from './pages/RecuperarSenha.jsx'
import RedefinirSenha from './pages/RedefinirSenha.jsx'
import {
  EVENTO_SESSAO_ENCERRADA,
  limparSessaoLocal,
  logout,
  validarSessao,
} from './services/authService.js'

function viewInicial() {
  return window.location.pathname === '/redefinir-senha' ? 'redefinir-senha' : 'login'
}

export function Root() {
  const [usuario, setUsuario] = useState(null)
  const [view, setView] = useState(viewInicial)
  const [verificandoSessao, setVerificandoSessao] = useState(() => viewInicial() === 'login')

  useEffect(() => {
    let ativo = true

    // O cookie de sessão é HttpOnly: só o servidor sabe se ela continua válida.
    if (viewInicial() === 'login') {
      validarSessao()
        .then((usuarioDaSessao) => {
          if (ativo) setUsuario(usuarioDaSessao)
        })
        .catch(() => {
          if (ativo) limparSessaoLocal()
        })
        .finally(() => {
          if (ativo) setVerificandoSessao(false)
        })
    }

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
      ativo = false
      window.removeEventListener(EVENTO_SESSAO_ENCERRADA, encerrarSessao)
      window.removeEventListener('storage', sincronizarLogout)
    }
  }, [])

  if (verificandoSessao) {
    return <p role="status" aria-busy="true" style={{ padding: 24 }}>Verificando sessão...</p>
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

export default Root
