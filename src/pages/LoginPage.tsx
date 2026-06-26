/**
 * Pantalla de inicio de sesión.
 *
 * Es la primera pantalla que ve el usuario. Pide usuario y contraseña,
 * y si las credenciales son válidas, redirige al listado de bolsines.
 *
 * Mientras se procesa el login, mostramos un botón deshabilitado con
 * "Ingresando..." para feedback visual. Si hay error, se muestra un
 * mensaje en una card roja arriba del formulario.
 *
 * Si el usuario ya está autenticado (por ejemplo, porque recargó y el
 * estado persiste), redirigimos automáticamente al listado.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { login } from '@/api/service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, AlertCircle } from 'lucide-react'

export function LoginPage() {
  const [nombreUsuario, setNombreUsuario] = useState('')
  const [contrasenia, setContrasenia] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { login: authLogin, isAuthenticated } = useAuthStore()

  // Si ya está autenticado, no debería estar acá; lo mandamos al menú principal
  if (isAuthenticated) {
    navigate('/home', { replace: true })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await login({ nombreUsuario, contrasenia })
      authLogin(response.token, response.usuario)
      navigate('/home', { replace: true })
    } catch (err: any) {
      setError(err?.mensaje || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-stone-900">
            <Package className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-xl">PPAI Bolsines</CardTitle>
          <CardDescription>
            Sistema de Gestión de Bolsines
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                name="username"
                autoComplete="username"
                placeholder="Ingrese su usuario"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Ingrese su contraseña"
                value={contrasenia}
                onChange={(e) => setContrasenia(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
