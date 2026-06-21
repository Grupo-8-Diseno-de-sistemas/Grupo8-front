/**
 * Pantalla de detalle del bolsín (pasos 6 a 9 del CU 28).
 *
 * Acá el usuario ve la información completa del bolsín: datos generales,
 * remitos con su documentación, historial de cambios de estado, y las
 * opciones de recepción disponibles.
 *
 * Flujo principal:
 *   1. Se cargan los datos del bolsín por ID
 *   2. Paso 7: el usuario selecciona una opción de recepción (1 a 4)
 *   3. Paso 8: hace click en "Continuar" y confirma en el modal
 *      (flujo A6: puede cancelar y volver atrás)
 *   4. Paso 9: se registra la recepción y se muestra el resultado
 *
 * Estados visibles:
 *   - Loading: skeletons mientras carga el detalle
 *   - Error: si el bolsín no existe o hay error de red
 *   - Paso 7: opciones de recepción con botón "Continuar"
 *   - Paso 8 (modal): confirmación con resumen de la opción elegida
 *   - Registrando: spinner mientras se procesa
 *   - Resultado: éxito o error post-registro
 *   - Historial: siempre visible, muestra la trazabilidad completa
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { getBolsinDetalle, registrarRecepcion } from '@/api/service'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Package,
  ClipboardList,
} from 'lucide-react'
import {
  OPCIONES_RECEPCION,
  type BolsinDetalle,
  type OpcionRecepcion,
} from '@/types'

export function DetalleBolsinPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { usuario } = useAuthStore()

  // ─── Estados del componente ───
  const [bolsin, setBolsin] = useState<BolsinDetalle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Opción de recepción seleccionada (1 a 4)
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string>('')

  // Control del diálogo de confirmación y registro
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
  const [registrando, setRegistrando] = useState(false)
  const [resultado, setResultado] = useState<{
    exito: boolean
    mensaje: string
  } | null>(null)

  // ─── Al montar, cargamos el detalle del bolsín ───
  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError('')

    getBolsinDetalle(Number(id))
      .then((data) => {
        setBolsin(data)
      })
      .catch((err: any) => {
        setError(err?.mensaje || 'Error al cargar el detalle del bolsín')
      })
      .finally(() => setLoading(false))
  }, [id])

  // ─── Paso 7: el usuario selecciona una opción ───
  const handleSeleccionarOpcion = (value: string) => {
    setOpcionSeleccionada(value)
    setResultado(null)
    // La confirmación se abre después, cuando el usuario hace click en "Continuar"
  }

  // ─── Paso 8: el usuario hace click en "Continuar" → se abre la confirmación ───
  const handleContinuar = () => {
    setMostrarConfirmacion(true)
  }

  // ─── A6: el usuario cancela la confirmación ───
  const handleCancelar = () => {
    setMostrarConfirmacion(false)
    // No se limpia la opción seleccionada, así el usuario puede corregir
    // o volver a intentar sin tener que elegir de nuevo
  }

  // ─── El usuario confirma y se registra la recepción ───
  const handleConfirmar = async () => {
    if (!bolsin || !usuario) return
    setRegistrando(true)

    try {
      const response = await registrarRecepcion(bolsin.id, {
        opcion: Number(opcionSeleccionada) as 1 | 2 | 3 | 4,
        empleadoId: usuario.id,
      })

      // Actualizamos el bolsín con los nuevos estados devueltos por el backend
      setBolsin(response.bolsin)
      setResultado({
        exito: true,
        mensaje: response.mensaje,
      })
      setMostrarConfirmacion(false)
    } catch (err: any) {
      setResultado({
        exito: false,
        mensaje: err?.mensaje || 'Error al registrar la recepción',
      })
    } finally {
      setRegistrando(false)
    }
  }

  // ─── Estado: cargando ───
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-60 w-full rounded-xl" />
      </div>
    )
  }

  // ─── Estado: error o bolsín no encontrado ───
  if (error || !bolsin) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg font-medium text-stone-700">{error || 'Bolsín no encontrado'}</p>
        <Button variant="outline" onClick={() => navigate('/bolsines')}>
          <ArrowLeft className="h-4 w-4" />
          Volver al listado
        </Button>
      </div>
    )
  }

  // Buscamos la opción seleccionada para mostrar en la confirmación
  const opcionActual: OpcionRecepcion | undefined = OPCIONES_RECEPCION.find(
    (o) => o.id === Number(opcionSeleccionada)
  )

  return (
    <div className="space-y-6">
      {/* ─── Botón para volver al listado ─── */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/bolsines')}
        className="mb-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al listado
      </Button>

      {/* ─── Resultado post-registro (éxito o error) ───
           Aparece al tope para que sea lo primero que ve el usuario
           después de registrar. */}
      {resultado && (
        <Card
          className={
            resultado.exito
              ? 'border-emerald-200 bg-emerald-50'
              : 'border-red-200 bg-red-50'
          }
        >
          <CardContent className="flex items-start gap-3 p-4">
            {resultado.exito ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            )}
            <div>
              <p
                className={
                  resultado.exito
                    ? 'font-medium text-emerald-800'
                    : 'font-medium text-red-800'
                }
              >
                {resultado.exito ? 'Recepción registrada' : 'Error'}
              </p>
              <p
                className={
                  resultado.exito
                    ? 'mt-1 text-sm text-emerald-700'
                    : 'mt-1 text-sm text-red-700'
                }
              >
                {resultado.mensaje}
              </p>
              {resultado.exito && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => navigate('/home')}
                >
                  Volver al menú principal
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── Cabecera del bolsín: datos principales ─── */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-stone-500" />
                <CardTitle>Bolsín {bolsin.nroPrecinto}</CardTitle>
              </div>
              <p className="mt-1 text-sm text-stone-500">
                {bolsin.cmOrigen.nombre} → {bolsin.cmDestino.nombre}
              </p>
            </div>
            <Badge variant={resultado?.exito ? 'success' : 'warning'}>
              {resultado?.exito ? 'Recibido' : bolsin.estadoActual}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-stone-500">Precinto:</span>{' '}
              <span className="font-medium">{bolsin.nroPrecinto}</span>
            </div>
            <div>
              <span className="text-stone-500">Peso:</span>{' '}
              <span className="font-medium">{bolsin.peso ? `${bolsin.peso}g` : '-'}</span>
            </div>
            <div>
              <span className="text-stone-500">Fecha envío:</span>{' '}
              <span className="font-medium">
                {new Date(bolsin.fechaEnvio).toLocaleDateString('es-AR')}
              </span>
            </div>
            <div>
              <span className="text-stone-500">CM Origen:</span>{' '}
              <span className="font-medium">{bolsin.cmOrigen.nombre}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── Historial de cambios de estado ───
           Línea de tiempo con todos los estados por los que pasó el bolsín,
           desde "Creado" hasta el estado actual. Siempre visible. */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Historial del Bolsín</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bolsin.cambiosEstado.map((cambio, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-100">
                  <div className="h-2 w-2 rounded-full bg-stone-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-900">{cambio.estado}</p>
                  <p className="text-xs text-stone-500">
                    {new Date(cambio.fecha).toLocaleString('es-AR')} —{' '}
                    {cambio.empleadoResponsable}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ─── Remitos y Documentación ───
           Se oculta después de un registro exitoso porque los datos ya
           cambiaron y no tendría sentido mostrar las opciones de nuevo. */}
      {!resultado?.exito && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-stone-500" />
              <CardTitle className="text-sm">Remitos y Documentación</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {bolsin.remitos.map((remito) => (
              <div key={remito.id} className="rounded-lg border border-stone-200">
                {/* Cabecera del remito */}
                <div className="flex items-center justify-between border-b border-stone-100 bg-stone-50 px-4 py-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-stone-500" />
                    <span className="text-sm font-medium">{remito.nroRemito}</span>
                  </div>
                  <Badge variant={remito.estadoActual === 'Enviado' ? 'warning' : 'success'}>
                    {remito.estadoActual}
                  </Badge>
                </div>
                {/* Lista de documentos del remito */}
                <div className="divide-y divide-stone-100">
                  {remito.documentacion.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between px-4 py-2.5">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-stone-900">{doc.asunto}</p>
                        <p className="text-xs text-stone-500">{doc.tipoDocumento}</p>
                      </div>
                      <Badge
                        variant={
                          doc.estadoActual === 'En Bolsín Saliente'
                            ? 'secondary'
                            : doc.estadoActual === 'Recibida y Aceptada'
                              ? 'success'
                              : doc.estadoActual === 'No Recibida'
                                ? 'destructive'
                                : 'outline'
                        }
                      >
                        {doc.estadoActual}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ─── Paso 7: Opciones de Recepción ───
           El usuario elije una opción (1 a 4). Al hacer click en
           "Continuar" pasa a la confirmación (paso 8).
           Siempre visible (incluso detrás del modal de confirmación),
           solo se oculta después del registro exitoso. */}
      {!resultado?.exito && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Opciones de Recepción</CardTitle>
            <p className="text-xs text-stone-500">
              Seleccione la opción que corresponda según el contenido del bolsín recibido
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={opcionSeleccionada}
              onValueChange={handleSeleccionarOpcion}
            >
              {OPCIONES_RECEPCION.map((opcion) => (
                <RadioGroupItem key={opcion.id} value={String(opcion.id)} id={`opc-${opcion.id}`}>
                  <div>
                    <p className="font-medium text-stone-900">{opcion.titulo}</p>
                    <p className="mt-1 text-sm text-stone-500">{opcion.descripcion}</p>
                  </div>
                </RadioGroupItem>
              ))}
            </RadioGroup>

            <div className="flex items-center gap-3 border-t border-stone-100 pt-4">
              <Button
                onClick={handleContinuar}
                disabled={!opcionSeleccionada}
              >
                Continuar
              </Button>
              {!opcionSeleccionada && (
                <p className="text-xs text-stone-400">
                  Seleccione una opción para continuar
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── Paso 8: Confirmación (modal) ───
           Al hacer click en "Continuar" se abre este modal con los
           detalles de la opción elegida y los botones Confirmar /
           Cancelar. Cancelar (A6) cierra el modal pero mantiene la
           opción seleccionada.
           
           Cuando se está registrando, el modal muestra un spinner
           en vez de los botones. El backdrop semi-transparente deja
           ver las opciones detrás. */}
      {mostrarConfirmacion && opcionActual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={registrando ? undefined : handleCancelar}
          />

          {/* Modal */}
          <div className="relative mx-4 w-full max-w-md rounded-xl border border-stone-200 bg-white shadow-xl">
            <div className="border-b border-stone-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                </div>
                <h3 className="text-base font-semibold text-stone-900">
                  Confirmar registro de recepción
                </h3>
              </div>
            </div>

            <div className="space-y-3 px-6 py-4">
              {/* Resumen de la opción elegida */}
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
                  Opción seleccionada
                </p>
                <p className="mt-1 text-sm font-medium text-stone-900">
                  {opcionActual.titulo}
                </p>
                <p className="mt-0.5 text-sm text-stone-600">
                  {opcionActual.descripcion}
                </p>
              </div>

              <p className="text-xs text-stone-500">
                Esta acción actualizará el estado del bolsín, los remitos y
                la documentación asociada. No se podrá deshacer.
              </p>
            </div>

            <div className="flex justify-end gap-2 border-t border-stone-100 px-6 py-4">
              {registrando ? (
                <div className="flex w-full items-center justify-center gap-2 py-1">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-stone-300 border-t-stone-900" />
                  <p className="text-sm text-stone-600">Registrando recepción…</p>
                </div>
              ) : (
                <>
                  <Button variant="outline" onClick={handleCancelar}>
                    Cancelar
                  </Button>
                  <Button onClick={handleConfirmar}>
                    <CheckCircle2 className="h-4 w-4" />
                    Confirmar recepción
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      
    </div>
  )
}
