/**
 * Punto de entrada del router.
 *
 * Define las rutas de la aplicación:
 *   - /login → pantalla de login (pública)
 *   - /bolsines → listado de bolsines (protegida)
 *   - /bolsines/:id → detalle del bolsín (protegida)
 *   - * → cualquier otra ruta redirige a /bolsines
 *
 * Las rutas protegidas están envueltas en AuthGuard + Layout, así que
 * comparten el header y el layout común automáticamente.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { LoginPage } from '@/pages/LoginPage'
import { BuscarBolsinPage } from '@/pages/BuscarBolsinPage'
import { DetalleBolsinPage } from '@/pages/DetalleBolsinPage'
import { HomePage } from '@/pages/HomePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas protegidas con layout compartido */}
        <Route
          element={
            <AuthGuard>
              <Layout />
            </AuthGuard>
          }
        >
          <Route path="/home" element={<HomePage />} />
          <Route path="/bolsines" element={<BuscarBolsinPage />} />
          <Route path="/bolsines/:id" element={<DetalleBolsinPage />} />
        </Route>

        {/* Catch-all: redirige al home (menú principal) */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
