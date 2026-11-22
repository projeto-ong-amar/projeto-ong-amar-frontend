import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/variables.css'
import './styles/global.css'
import './styles/alto-contraste.css'
import Root from './Root.jsx'
import { iniciarAltoContraste } from './utils/altoContraste.js'

iniciarAltoContraste()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
