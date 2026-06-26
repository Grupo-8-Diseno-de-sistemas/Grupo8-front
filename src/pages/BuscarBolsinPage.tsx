import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { getBolsines, getComisiones } from '@/api/service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Search, AlertCircle, Package, Filter, X } from 'lucide-react'
import type { Bolsin, Comision } from '@/types'

export function BuscarBolsinPage() {
  const navigate = useNavigate()
  const { usuario, token } = useAuthStore()

  const [todosLosBolsines, setTodosLosBolsines] = useState<Bolsin[]>([])
  const [comisiones, setComisiones] = useState<Comision[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [errorA1, setErrorA1] = useState('')

  const [precintoInput, setPrecintoInput] = useState('')
  const [cmOrigenId, setCmOrigenId] = useState('')

  const fetchBolsines = (nroPrecinto?: string, cmOrigen?: number) => {
    if (!token) return Promise.resolve()
    setLoading(true)
    setError('')
    setErrorA1('')

    return getBolsines({
      sesionId: Number(token),
      ...(nroPrecinto ? { nroPrecinto } : {}),
      ...(cmOrigen ? { cmOrigenId: cmOrigen } : {}),
    })
      .then((bolsines) => setTodosLosBolsines(bolsines))
      .catch((err: any) => {
        if (err?.status === 404) {
          setErrorA1(err?.message || err?.detail || err?.mensaje || 'No se encontró el bolsín ingresado.')
          setTodosLosBolsines([])
        } else {
          setError(err?.mensaje || err?.message || 'Error al cargar los bolsines')
        }
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!token) return
    Promise.all([
      getBolsines({ sesionId: Number(token) }),
      getComisiones(),
    ])
      .then(([bolsines, cms]) => {
        setTodosLosBolsines(bolsines)
        setComisiones(cms)
      })
      .catch((err: any) => {
        setError(err?.mensaje || err?.message || 'Error al cargar los bolsines')
      })
      .finally(() => setLoading(false))
  }, [token])

  const handleBuscar = () => {
    const precinto = precintoInput.trim() || undefined
    const cmOrigen = cmOrigenId && cmOrigenId !== 'todas' ? Number(cmOrigenId) : undefined
    fetchBolsines(precinto, cmOrigen)
  }

  const handleLimpiar = () => {
    setPrecintoInput('')
    setCmOrigenId('')
    fetchBolsines()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-stone-900">
          Registrar recepción de bolsín
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          CM destino:{' '}
          <span className="font-medium text-stone-700">
            {usuario?.cm.nombre}
          </span>
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-stone-500" />
            <CardTitle className="text-sm">Filtros de búsqueda</CardTitle>
          </div>
          <CardDescription>
            Buscar por número de precinto o comisión médica de origen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="filter-precinto">Nro. de Precinto</Label>
              <Input
                id="filter-precinto"
                autoComplete="off"
                placeholder="Ej: PREC-001-2026"
                value={precintoInput}
                onChange={(e) => setPrecintoInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
              />
            </div>
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="filter-cm-origen">CM Origen</Label>
              <select
                id="filter-cm-origen"
                className="flex h-9 w-full rounded-md border border-stone-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-950"
                value={cmOrigenId}
                onChange={(e) => setCmOrigenId(e.target.value)}
              >
                <option value="todas">Todas las CM</option>
                {comisiones
                  .filter((c) => c.id !== usuario?.cm.id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
              </select>
            </div>
            <Button onClick={handleBuscar} disabled={loading}>
              <Search className="h-4 w-4" />
              Buscar
            </Button>
            <Button variant="outline" onClick={handleLimpiar} disabled={loading}>
              <X className="h-4 w-4" />
              Limpiar
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div>
            <p className="font-medium text-red-800">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => fetchBolsines()}
            >
              Reintentar
            </Button>
          </div>
        </div>
      )}

      {errorA1 && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p className="font-medium text-amber-800">{errorA1}</p>
        </div>
      )}

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      )}

      {!loading && !error && !errorA1 && todosLosBolsines.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <Package className="mb-4 h-12 w-12 text-stone-300" />
            <p className="text-lg font-medium text-stone-700">
              No hay bolsines en estado Enviado para tu CM
            </p>
            <p className="mt-1 text-sm text-stone-500">
              No se encontraron bolsines pendientes de recepción en{' '}
              {usuario?.cm.nombre}
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && !errorA1 && todosLosBolsines.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-stone-500">
            Se encontraron{' '}
            <span className="font-medium">{todosLosBolsines.length}</span>{' '}
            bolsín(es) pendiente(s) de recepción
          </p>
          {todosLosBolsines.map((bolsin) => (
            <Card
              key={bolsin.id}
              className="cursor-pointer transition-colors hover:border-stone-400"
              onClick={() => navigate(`/bolsines/${bolsin.id}`)}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-stone-500" />
                    <span className="font-medium text-stone-900">
                      Precinto: {bolsin.nroPrecinto}
                    </span>
                  </div>
                  <p className="text-sm text-stone-500">
                    CM Origen:{' '}
                    <span className="font-medium text-stone-700">
                      {bolsin.cmOrigen.nombre}
                    </span>
                  </p>
                  <p className="text-xs text-stone-400">
                    Fecha envío:{' '}
                    {new Date(bolsin.fechaEnvio).toLocaleDateString('es-AR')}
                  </p>
                </div>
                <Badge variant="warning">Enviado</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
