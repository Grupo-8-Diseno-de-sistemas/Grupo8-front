/**
 * Pantalla principal / menú del sistema.
 *
 * Después del login, el usuario ve las opciones disponibles del sistema.
 * De los 3 módulos, solo "Registrar recepción de bolsín" está activo
 * porque los otros (Consultar seguimiento, Generar bolsín) pertenecen
 * a otros CUs que no estamos desarrollando. Se muestran igual para
 * dar contexto del sistema completo, pero deshabilitados.
 *
 * Cada opción es una card vertical apilada, con icono, título y descripción
 * breve. Mismo estilo visual que las cards de la lista de bolsines.
 */

import { useNavigate } from 'react-router-dom'
import { Package, Search, FileText } from 'lucide-react'

const OPCIONES = [
  {
    id: 'registrar',
    titulo: 'Registrar recepción de bolsín',
    descripcion:
      'Registrar la recepción de un bolsín y actualizar los estados de remitos y documentación',
    icono: Package,
    ruta: '/bolsines',
    activo: true,
  },
  {
    id: 'consultar',
    titulo: 'Consultar seguimiento de bolsines',
    descripcion: 'Consultar el estado y la trazabilidad de los bolsines enviados',
    icono: Search,
    ruta: null,
    activo: false,
  },
  {
    id: 'generar',
    titulo: 'Generar bolsín',
    descripcion: 'Crear un nuevo bolsín con remitos y documentación asociada',
    icono: FileText,
    ruta: null,
    activo: false,
  },
]

export function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* ─── Cabecera ─── */}
      <div>
        <h2 className="text-2xl font-bold text-stone-900">PPAI Bolsines</h2>
        <p className="mt-1 text-sm text-stone-500">
          Seleccione el módulo al que desea acceder
        </p>
      </div>

      {/* ─── Opciones del menú ─── */}
      <div className="space-y-3">
        {OPCIONES.map((opcion) => {
          const Icono = opcion.icono

          return (
            <div
              key={opcion.id}
              onClick={() => opcion.activo && opcion.ruta && navigate(opcion.ruta)}
              className={
                opcion.activo
                  ? 'flex cursor-pointer items-center gap-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition-colors hover:border-stone-400'
                  : 'flex cursor-not-allowed items-center gap-4 rounded-xl border border-stone-200 bg-white p-5 opacity-50 shadow-sm'
              }
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-stone-100">
                <Icono className="h-5 w-5 text-stone-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-stone-900">{opcion.titulo}</p>
                  {!opcion.activo && (
                    <span className="rounded bg-stone-200 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-stone-500">
                      No disponible
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-stone-500">
                  {opcion.descripcion}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
