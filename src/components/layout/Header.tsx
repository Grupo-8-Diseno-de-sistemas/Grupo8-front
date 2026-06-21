/**
 * Header principal de la aplicación.
 *
 * Muestra el nombre del sistema y los datos del usuario logueado
 * (nombre, apellido, comisión médica). Incluye un botón de "Salir"
 * que desautentica y redirige al login.
 *
 * Si el usuario no está autenticado, el header no se renderiza.
 * Esto pasa porque el AuthGuard ya protege las rutas hijas, pero por
 * las dudas tenemos el guard condicional acá también.
 */

import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { useLocation, useNavigate } from 'react-router-dom'
import { LogOut, Package, ArrowLeft } from 'lucide-react'

export function Header() {
  const { usuario, logout, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/home'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!isAuthenticated) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="flex h-16 items-center justify-between px-6">
        <button
          onClick={() => navigate('/home')}
          className="flex cursor-pointer items-center gap-3"
        >
          {isHome ? (
            <Package className="h-6 w-6 text-stone-900" />
          ) : (
            <ArrowLeft className="h-5 w-5 text-stone-600" />
          )}
          <h1 className="text-lg font-semibold text-stone-900">PPAI Bolsines</h1>
        </button>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-stone-900">
              {usuario?.nombre} {usuario?.apellido}
            </p>
            <p className="text-xs text-stone-500">{usuario?.cm.nombre}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Salir
          </Button>
        </div>
      </div>
    </header>
  )
}
