/**
 * Pantalla de búsqueda de bolsines (paso 5 del CU 28).
 *
 * Cuando el usuario logueado entra, automáticamente cargamos todos los
 * bolsines en estado "Enviado" que tengan como destino la CM del usuario.
 *
 * El usuario puede filtrar por:
 *   - Número de precinto (búsqueda parcial)
 *   - CM de origen
 *
 * Los filtros se persisten en la URL (?precinto=X&cmOrigen=Y) para que
 * si el usuario navega al detalle y vuelve, no pierda su búsqueda.
 *
 * Estados que maneja la pantalla:
 *   - Loading: esqueletos grises animados mientras se cargan los datos
 *   - Error con reintento: si hay un error, mostramos el mensaje y un botón
 *     para reintentar (incluye los flujos A1 y A2: precinto no encontrado,
 *     CM origen no encontrada)
 *   - Empty: si no hay bolsines, mostramos un mensaje claro
 *   - Lista: los bolsines aparecen como cards clickeables
 *
 * Cada item de la lista es clickeable y navega al detalle del bolsín.
 */

import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
import { Search, AlertCircle, Package, Filter } from 'lucide-react'
import type { Bolsin, Comision } from '@/types'

export function BuscarBolsinPage() {
  const navigate = useNavigate()
  const { usuario } = useAuthStore()
  const [searchParams, setSearchParams] = useSearchParams()

  // ─── Estados de la pantalla ───
  const [bolsines, setBolsines] = useState<Bolsin[]>([])
  const [comisiones, setComisiones] = useState<Comision[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // ─── Filtros sincronizados con la URL ───
  const [precintoFilter, setPrecintoFilter] = useState(
    searchParams.get('precinto') || ''
  )
  const [cmOrigenFilter, setCmOrigenFilter] = useState(
    searchParams.get('cmOrigen') || ''
  )

  // ─── Carga inicial de datos ───
  const cargarBolsines = useCallback(
    async (params?: { precinto?: string; cmOrigen?: number }) => {
      if (!usuario) return
      setLoading(true)
      setError('')

      try {
        const data = await getBolsines({
          estado: 'Enviado',
          cmDestino: usuario.cm.id,
          ...(params?.precinto && { precinto: params.precinto }),
          ...(params?.cmOrigen && { cmOrigen: params.cmOrigen }),
        })
        setBolsines(data)
      } catch (err: any) {
        setError(err?.mensaje || 'Error al cargar los bolsines')
        setBolsines([])
      } finally {
        setLoading(false)
      }
    },
    [usuario]
  )

  // Carga inicial SOLO al montar, no cuando cambian los filtros
  useEffect(() => {
    cargarBolsines()

    // Si la URL tiene filtros, disparar la búsqueda con esos valores
    const precintoParam = searchParams.get('precinto')
    const cmOrigenParam = searchParams.get('cmOrigen')
    if (precintoParam || cmOrigenParam) {
      cargarBolsines({
        ...(precintoParam && { precinto: precintoParam }),
        ...(cmOrigenParam && { cmOrigen: Number(cmOrigenParam) }),
      })
    }

    getComisiones().then(setComisiones).catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ─── Aplica los filtros y los persiste en la URL ───
  const handleFilter = async () => {
    if (!usuario) return
    setLoading(true)
    setError('')

    // Construimos los query params para la URL
    const params = new URLSearchParams()
    if (precintoFilter.trim()) params.set('precinto', precintoFilter.trim())
    if (cmOrigenFilter && cmOrigenFilter !== 'todas')
      params.set('cmOrigen', cmOrigenFilter)

    // Actualizamos la URL sin forzar recarga (replace)
    setSearchParams(params, { replace: true })

    try {
      const apiParams: any = {
        estado: 'Enviado',
        cmDestino: usuario.cm.id,
      }

      if (precintoFilter.trim()) {
        apiParams.precinto = precintoFilter.trim()
      }

      if (cmOrigenFilter && cmOrigenFilter !== 'todas') {
        apiParams.cmOrigen = Number(cmOrigenFilter)
      }

      const data = await getBolsines(apiParams)
      setBolsines(data)
    } catch (err: any) {
      setError(err?.mensaje || 'Error al filtrar bolsines')
      setBolsines([])
    } finally {
      setLoading(false)
    }
  }

  // Limpia los filtros, la URL y recarga todo sin filtros
  const handleLimpiar = () => {
    setPrecintoFilter('')
    setCmOrigenFilter('')
    setSearchParams({}, { replace: true })
    cargarBolsines()
  }

  const irADetalle = (id: number) => {
    navigate(`/bolsines/${id}`)
  }

  return (
    <div className="space-y-6">
      {/* ─── Cabecera ─── */}
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

      {/* ─── Panel de filtros ─── */}
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
                value={precintoFilter}
                onChange={(e) => setPrecintoFilter(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
              />
            </div>
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="filter-cm-origen">CM Origen</Label>
              <select
                id="filter-cm-origen"
                className="flex h-9 w-full rounded-md border border-stone-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-950"
                value={cmOrigenFilter}
                onChange={(e) => setCmOrigenFilter(e.target.value)}
              >
                <option value="todas">Todas las CM</option>
                {/* Excluimos la CM del usuario porque los bolsines no vienen de acá */}
                {comisiones
                  .filter((c) => c.id !== usuario?.cm.id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
              </select>
            </div>
            <Button onClick={handleFilter} disabled={loading}>
              <Search className="h-4 w-4" />
              Buscar
            </Button>
            <Button
              variant="outline"
              onClick={handleLimpiar}
              disabled={loading}
            >
              Limpiar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ─── Estado: error con mensaje contextual ─── */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div>
            <p className="font-medium text-red-800">{error}</p>
            <p className="mt-1 text-sm text-red-600">
              {error.includes('precinto')
                ? 'Verifique el número de precinto e intente nuevamente.'
                : error.includes('CM de origen')
                  ? 'Verifique la comisión médica de origen seleccionada.'
                  : 'Intente nuevamente más tarde.'}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={cargarBolsines}
            >
              Reintentar
            </Button>
          </div>
        </div>
      )}

      {/* ─── Estado: cargando (skeletons) ─── */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      )}

      {/* ─── Estado: sin resultados ─── */}
      {!loading && !error && bolsines.length === 0 && (
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

      {/* ─── Estado: lista de bolsines ─── */}
      {!loading && !error && bolsines.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-stone-500">
            Se encontraron{' '}
            <span className="font-medium">{bolsines.length}</span> bolsín(es)
            pendiente(s) de recepción
          </p>
          {bolsines.map((bolsin) => (
            <Card
              key={bolsin.id}
              className="cursor-pointer transition-colors hover:border-stone-400"
              onClick={() => irADetalle(bolsin.id)}
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
