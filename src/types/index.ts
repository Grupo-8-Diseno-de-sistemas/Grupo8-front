/**
 * Tipos del dominio compartidos entre el frontend y el contrato API.
 * La idea es mantenerlos alineados con el openapi.yaml para que cuando
 * conectemos con el backend real, todo matchee sin esfuerzo.
 *
 * Las interfaces reflejan las entidades del modelo de dominio que definimos
 * como grupo en el análisis: Bolsin, Remito, Documentacion, Estado, etc.
 * Básicamente, acá está el vocabulario del negocio en TypeScript.
 */

/**
 * Una comisión médica puede ser Central (CMC) o Jurisdiccional (CMJ).
 * Cada una tiene un código único tipo "CMJ-CBA" que se usa en los filtros.
 */
export interface Comision {
  id: number
  nombre: string
  codigo: string
  tipo: 'CMC' | 'CMJ'
}

/**
 * El usuario del sistema. El Encargado de Bolsines (EB) es nuestro actor principal.
 * Cada usuario pertenece a una comisión médica, y eso determina qué bolsines ve.
 */
export interface Usuario {
  id: number
  nombreUsuario: string
  nombre: string
  apellido: string
  email: string
  cm: Comision
}

/**
 * La documentación es lo que viaja dentro de los bolsines. Pueden ser
 * dictámenes, estudios médicos, cartas documento, etc. Cada una tiene
 * un estado que va cambiando según avanza el flujo: registrada, en remito,
 * en bolsín saliente, enviada, recibida...
 */
export interface Documentacion {
  id: number
  asunto: string
  tipoDocumento: string
  fechaPase?: string
  estadoActual: string
}

/**
 * Un remito agrupa documentación que va dirigida a una misma CM destino.
 * Cuando armás un bolsín, le metés uno o más remitos (cada uno con su
 * propia documentación). El remito también tiene su propio estado.
 */
export interface Remito {
  id: number
  nroRemito: string
  fechaEmision?: string
  estadoActual: string
  documentacion: Documentacion[]
}

/**
 * Registro de auditoría: cada vez que algo cambia de estado en el sistema,
 * guardamos cuándo fue, a qué estado pasó y quién fue el responsable.
 * Esto es clave para la trazabilidad que pide el ERS.
 */
export interface CambioEstado {
  fecha: string
  estado: string
  empleadoResponsable: string
}

/**
 * Versión liviana del bolsín para la lista. Tiene los datos principales
 * pero no incluye los remitos ni el historial completo. Sirve para la
 * pantalla de búsqueda donde solo mostramos precinto, CM origen y fecha.
 */
export interface Bolsin {
  id: number
  nroPrecinto: string
  fechaEnvio: string
  peso?: number
  cmOrigen: Comision
  cmDestino: Comision
  estadoActual: string
}

/**
 * Versión completa del bolsín con todo el detalle: los remitos que contiene,
 * la documentación de cada uno, y el historial de cambios de estado.
 * Se usa en la pantalla de detalle cuando el usuario selecciona un bolsín.
 */
export interface BolsinDetalle extends Bolsin {
  remitos: Remito[]
  cambiosEstado: CambioEstado[]
}

/**
 * Cuerpo de la request para registrar la recepción.
 * La opción indica qué situación se dio al recibir el bolsín (1 a 4),
 * y el empleadoId es quién está haciendo el registro.
 */
export interface RegistrarRecepcionRequest {
  opcion: 1 | 2 | 3 | 4
  empleadoId: number
}

/**
 * Lo que devuelve el backend después de registrar la recepción.
 * Incluye el bolsín ya actualizado con los nuevos estados.
 */
export interface RecepcionResponse {
  exito: boolean
  mensaje: string
  bolsin: BolsinDetalle
}

export interface ErrorResponse {
  exito: boolean
  mensaje: string
  codigo?: string
}

export interface LoginRequest {
  nombreUsuario: string
  contrasenia: string
}

export interface LoginResponse {
  token: string
  usuario: Usuario
}

/**
 * Parámetros para filtrar bolsines en la búsqueda.
 * El estado y cmDestino son obligatorios (siempre buscamos "Enviado"
 * para la CM del usuario). precinto y cmOrigen son filtros opcionales.
 */
export interface BolsinFilterParams {
  estado: string
  cmDestino: number
  precinto?: string
  cmOrigen?: number
}

/**
 * Las 4 opciones de recepción que define el CU 28 en el paso 7.
 * Las tenemos como constante para usarlas tanto en los radio buttons
 * como en la confirmación y el resultado.
 */
export interface OpcionRecepcion {
  id: 1 | 2 | 3 | 4
  titulo: string
  descripcion: string
}

export const OPCIONES_RECEPCION: OpcionRecepcion[] = [
  {
    id: 1,
    titulo: 'Contenido igual al registrado',
    descripcion: 'El contenido del bolsín es igual al registrado en el sistema.',
  },
  {
    id: 2,
    titulo: 'Documentación faltante',
    descripcion: 'No se recibe toda la documentación asociada a los remitos que contiene el bolsín.',
  },
  {
    id: 3,
    titulo: 'Documentación no correspondiente',
    descripcion: 'Existe documentación que no corresponde al destino (CM del usuario logueado).',
  },
  {
    id: 4,
    titulo: 'Redirigir a otra área',
    descripcion: 'La documentación se debe redirigir a otra área.',
  },
]
