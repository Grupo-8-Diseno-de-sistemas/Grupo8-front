/**
 * Entry point de la aplicación.
 *
 * Monta la app en el DOM con StrictMode habilitado. StrictMode no afecta
 * la build de producción; en desarrollo ayuda a detectar efectos secundarios
 * y problemas de concurrencia ejecutando ciertos hooks dos veces.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
