/**
 * Layout principal de la aplicación.
 *
 * Es el wrapper que usan todas las rutas protegidas. Renderiza el Header
 * en la parte superior y el contenido de la ruta activa (Outlet) en un
 * contenedor centrado con padding uniforme.
 *
 * El AuthGuard envuelve a este Layout en el router, así que si el usuario
 * no está autenticado, ni siquiera llega acá.
 */

import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export function Layout() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
