/**
 * Mock API service.
 *
 * Mientras el backend no esté listo, acá simulamos las respuestas de la API
 * con datos mock. La interfaz es la misma que después usará axios, así que
 * el front no necesita cambios cuando llegue el momento de conectar.
 *
 * Incluye la lógica del CU 28: filtros de búsqueda (con los flujos
 * alternativos A1 y A2), registro de recepción con las 4 opciones,
 * y actualización consistente de estados en bolsín, remitos y documentos.
 */

import type {
  Bolsin,
  BolsinDetalle,
  BolsinFilterParams,
  LoginRequest,
  LoginResponse,
  RecepcionResponse,
  RegistrarRecepcionRequest,
  Comision,
  Usuario,
} from '@/types'
import {
  BOLSINES,
  COMISIONES,
  USUARIO_EB,
} from './data'

// Simula la latencia de red para que la UX sea realista
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

// ─── Helpers internos ───

function getBolsinDetalleById(id: number): BolsinDetalle | undefined {
  return BOLSINES.find((b) => b.id === id)
}

/**
 * Aplica los filtros que manda el usuario. Filtra siempre por estado ("Enviado")
 * y CM destino (la del usuario logueado). Opcionalmente filtra por precinto y/o
 * CM origen.
 */
function filterBolsines(params: BolsinFilterParams): Bolsin[] {
  // Primero filtramos por estado y CM destino (siempre presente)
  let result = BOLSINES.filter(
    (b) => b.estadoActual === params.estado && b.cmDestino.id === params.cmDestino
  )

  // Filtro opcional por número de precinto (búsqueda parcial, case insensitive)
  if (params.precinto) {
    result = result.filter((b) =>
      b.nroPrecinto.toLowerCase().includes(params.precinto!.toLowerCase())
    )
  }

  // Filtro opcional por CM de origen
  if (params.cmOrigen) {
    result = result.filter((b) => b.cmOrigen.id === params.cmOrigen)
  }

  return result
}

// ─── Servicios Mock ───
// Cada función mock corresponde a un endpoint del contrato openapi.yaml.
// Después, acá nomás cambiamos el body para que llame a axios.

/**
 * Login del usuario. Acepta cualquier usuario/contraseña en este mock.
 * Devuelve un token ficticio y los datos del usuario mock.
 */
export async function mockLogin(data: LoginRequest): Promise<LoginResponse> {
  await delay()
  if (!data.nombreUsuario || !data.contrasenia) {
    throw { exito: false, mensaje: 'Credenciales inválidas', codigo: 'AUTH_ERROR' }
  }
  return {
    token: 'mock-token-grupo8-2026',
    usuario: USUARIO_EB,
  }
}

export async function mockGetUsuario(id: number): Promise<Usuario> {
  await delay()
  if (id !== USUARIO_EB.id) {
    throw { exito: false, mensaje: 'Usuario no encontrado', codigo: 'NOT_FOUND' }
  }
  return USUARIO_EB
}

export async function mockGetComisiones(): Promise<Comision[]> {
  await delay(200)
  return COMISIONES
}

/**
 * Busca bolsines según los filtros del usuario.
 *
 * Flujo normal: devuelve los bolsines que cumplen los filtros.
 * Flujo alternativo A1: si se filtró por precinto y no hay resultados,
 *   devuelve error específico de "precinto no encontrado".
 * Flujo alternativo A2: si se filtró por CM origen y no hay resultados,
 *   devuelve error específico de "CM origen no encontrada".
 */
export async function mockGetBolsines(
  params: BolsinFilterParams
): Promise<Bolsin[]> {
  // Verificamos cada filtro por separado antes de combinarlos.
  // Si ambos filtros están presentes y no hay resultados, no podemos
  // saber cuál causó el problema — así que verificamos cada uno
  // independientemente contra la base de datos mock.
  if (params.precinto) {
    const precintoExiste = BOLSINES.some(
      (b) =>
        b.estadoActual === params.estado &&
        b.cmDestino.id === params.cmDestino &&
        b.nroPrecinto.toLowerCase().includes(params.precinto!.toLowerCase())
    )
    if (!precintoExiste) {
      throw {
        exito: false,
        mensaje: 'No se encuentra bolsín con el número de precinto ingresado',
        codigo: 'A1',
      }
    }
  }

  if (params.cmOrigen) {
    const cmOrigenExiste = BOLSINES.some(
      (b) =>
        b.estadoActual === params.estado &&
        b.cmDestino.id === params.cmDestino &&
        b.cmOrigen.id === params.cmOrigen
    )
    if (!cmOrigenExiste) {
      throw {
        exito: false,
        mensaje: 'No se encuentra bolsín con la CM de origen ingresada',
        codigo: 'A2',
      }
    }
  }

  // Ahora aplicamos ambos filtros y devolvemos — si pasaron las
  // verificaciones de arriba, esto siempre va a tener resultados.
  const results = filterBolsines(params)
  return results
}

export async function mockGetBolsinDetalle(
  id: number
): Promise<BolsinDetalle> {
  await delay()
  const bolsin = getBolsinDetalleById(id)
  if (!bolsin) {
    throw { exito: false, mensaje: 'Bolsín no encontrado', codigo: 'NOT_FOUND' }
  }
  return bolsin
}

/**
 * Registra la recepción del bolsín según la opción seleccionada.
 *
 * La opción define cómo se actualizan los estados:
 *   Opción 1 - Todo ok: bolsín → "Recibido en CM destino", remitos y docs → "Recibido y Aceptado"
 *   Opción 2 - Documentación faltante: bolsín → "Recibido parcial", algunos docs → "No Recibida"
 *   Opción 3 - Documentación no correspondiente: bolsín → "Recibido con observaciones", docs → "Recibida y Rechazada"
 *   Opción 4 - Redirigir: bolsín → "Recibido - Pendiente redirección", docs → "Para Redirigir"
 *
 * Además, agrega un nuevo cambio de estado al historial.
 */
export async function mockRegistrarRecepcion(
  bolsinId: number,
  data: RegistrarRecepcionRequest
): Promise<RecepcionResponse> {
  await delay(600)

  const bolsin = getBolsinDetalleById(bolsinId)
  if (!bolsin) {
    throw { exito: false, mensaje: 'Bolsín no encontrado', codigo: 'NOT_FOUND' }
  }

  // A6: si el usuario no confirma, esto nunca se llama. Se maneja en el front
  // con el diálogo de confirmación que, si se cancela, no llega acá.

  // Mensajes de éxito según la opción elegida
  const mensajes: Record<number, string> = {
    1: `Recepción registrada exitosamente. Bolsín ${bolsin.nroPrecinto} actualizado a "Recibido en CM destino". Remitos y documentación actualizados a "Recibido y Aceptado".`,
    2: `Recepción registrada parcialmente. Se notificará a la CM origen sobre la documentación faltante.`,
    3: `Recepción registrada. La documentación no correspondiente será devuelta a la CM origen.`,
    4: `Recepción registrada. La documentación será redirigida al área correspondiente.`,
  }

  // Construimos el bolsín actualizado con los nuevos estados
  const updatedBolsin: BolsinDetalle = {
    ...bolsin,
    estadoActual:
      data.opcion === 1
        ? 'Recibido en CM destino'
        : data.opcion === 2
          ? 'Recibido parcial'
          : data.opcion === 3
            ? 'Recibido con observaciones'
            : 'Recibido - Pendiente redirección',
    cambiosEstado: [
      ...bolsin.cambiosEstado,
      {
        fecha: new Date().toISOString(),
        estado:
          data.opcion === 1
            ? 'Recibido en CM destino'
            : data.opcion === 2
              ? 'Recibido parcial'
              : data.opcion === 3
                ? 'Recibido con observaciones'
                : 'Para redirigir',
        empleadoResponsable: `${USUARIO_EB.nombre} ${USUARIO_EB.apellido}`,
      },
    ],
    // Actualizamos estados de remitos y documentación según la opción
    remitos: bolsin.remitos.map((r) => ({
      ...r,
      estadoActual:
        data.opcion === 1
          ? 'Recibido y Aceptado'
          : data.opcion === 2
            ? 'Recibido y Aceptado Parcial'
            : 'Recibido y Rechazado',
      documentacion: r.documentacion.map((d) => ({
        ...d,
        estadoActual:
          data.opcion === 1
            ? 'Recibida y Aceptada'
            : data.opcion === 2
              ? d.id % 2 === 0
                ? 'Recibida y Aceptada'
                : 'No Recibida'
              : data.opcion === 3
                ? 'Recibida y Rechazada'
                : 'Para Redirigir',
      })),
    })),
  }

  // Persistimos el cambio en el array mock para que la navegación
  // dentro de la misma sesión muestre datos consistentes. Si el usuario
  // vuelve al listado y entra al detalle de nuevo, va a ver los estados
  // actualizados. Al recargar la página se pierde, como es esperable
  // en un mock en memoria.
  const idx = BOLSINES.findIndex((b) => b.id === bolsinId)
  if (idx !== -1) {
    BOLSINES[idx] = updatedBolsin
  }

  return {
    exito: true,
    mensaje: mensajes[data.opcion] || 'Recepción registrada.',
    bolsin: updatedBolsin,
  }
}
