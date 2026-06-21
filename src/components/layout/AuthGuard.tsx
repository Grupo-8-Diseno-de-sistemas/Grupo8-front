/**
 * Guard de autenticación para rutas protegidas.
 *
 * Si el usuario no está autenticado, redirige al login y guarda la ruta
 * actual en el state de React Router. Eso permite que después del login
 * podamos redirigir de vuelta a donde quería ir originalmente.
 *
 * Se usa envolviendo rutas hijas en el router:
 *   <Route element={<AuthGuard><Layout /></AuthGuard>}>...</Route>
 */

import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    // Guardamos la ruta actual para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
