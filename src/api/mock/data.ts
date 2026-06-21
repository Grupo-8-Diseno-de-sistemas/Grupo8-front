/**
 * Datos mock para simular el backend mientras desarrollamos.
 * La idea es tener data coherente que refleje el modelo de dominio
 * del TPI: comisiones médicas, usuarios, bolsines con sus remitos y
 * documentación, cambios de estado, etc.
 *
 * Cuando el backend esté listo, esto se reemplaza por llamadas HTTP reales.
 * Mientras tanto, estos datos nos permiten desarrollar y probar la UI
 * sin depender de nadie.
 */

import type {
  Comision,
  Usuario,
  BolsinDetalle,
  Remito,
  Documentacion,
  CambioEstado,
} from '@/types'

// ─── Comisiones Médicas ───
// El sistema maneja dos tipos: Comisión Médica Central (CMC) y
// Comisiones Médicas Jurisdiccionales (CMJ). Cada CM tiene un código
// único que se usa, por ejemplo, en los filtros de búsqueda.
// La CMC es la que centraliza y distribuye; las CMJ son provinciales.

export const CMC: Comision = {
  id: 1,
  nombre: 'Comisión Médica Central',
  codigo: 'CMC',
  tipo: 'CMC',
}

export const CM_CORDOBA: Comision = {
  id: 2,
  nombre: 'Comisión Médica Córdoba',
  codigo: 'CMJ-CBA',
  tipo: 'CMJ',
}

export const CM_VILLA_MARIA: Comision = {
  id: 3,
  nombre: 'Comisión Médica Villa María',
  codigo: 'CMJ-VM',
  tipo: 'CMJ',
}

export const CM_MENDOZA: Comision = {
  id: 4,
  nombre: 'Comisión Médica Mendoza',
  codigo: 'CMJ-MDZ',
  tipo: 'CMJ',
}

export const CM_ROSARIO: Comision = {
  id: 5,
  nombre: 'Comisión Médica Rosario',
  codigo: 'CMJ-ROS',
  tipo: 'CMJ',
}

export const CM_PARANA: Comision = {
  id: 6,
  nombre: 'Comisión Médica Paraná',
  codigo: 'CMJ-PAR',
  tipo: 'CMJ',
}

// Lista completa de comisiones para cuando necesitemos poblar selects
export const COMISIONES: Comision[] = [
  CMC,
  CM_CORDOBA,
  CM_VILLA_MARIA,
  CM_MENDOZA,
  CM_ROSARIO,
  CM_PARANA,
]

// ─── Usuarios ───
// El Encargado de Bolsines (EB) es el actor principal del CU 28.
// Acá tenemos dos usuarios de prueba que pertenecen a CM Córdoba.

export const USUARIO_EB: Usuario = {
  id: 1,
  nombreUsuario: 'egallardo',
  nombre: 'Ezequiel',
  apellido: 'Gallardo',
  email: 'ezegalla11@gmail.com',
  cm: CM_CORDOBA,
}

export const USUARIO_EB2: Usuario = {
  id: 2,
  nombreUsuario: 'sbacci',
  nombre: 'Salvador',
  apellido: 'Bacci',
  email: 'salvador_bacci@hotmail.com',
  cm: CM_CORDOBA,
}

// ─── Documentación ───
// La documentación viaja dentro de los remitos. Puede ser dictámenes,
// estudios médicos, cartas documento, expedientes, etc. Cada documento
// tiene un estado que refleja en qué punto del flujo está.

// Documentos del bolsín 1 (3 documentos, todos con estado "En Bolsín Saliente")
const DOCS_BOLSIN_1: Documentacion[] = [
  {
    id: 1,
    asunto: 'Dictamen médico N° 2026-001',
    tipoDocumento: 'Dictamen',
    fechaPase: '2026-06-10',
    estadoActual: 'En Bolsín Saliente',
  },
  {
    id: 2,
    asunto: 'Estudio de diagnóstico - Paciente Pérez',
    tipoDocumento: 'Estudio Médico',
    fechaPase: '2026-06-10',
    estadoActual: 'En Bolsín Saliente',
  },
  {
    id: 3,
    asunto: 'Carta documento - Recurso N° 458',
    tipoDocumento: 'Carta Documento',
    fechaPase: '2026-06-11',
    estadoActual: 'En Bolsín Saliente',
  },
]

// Documentos del bolsín 2 (2 documentos)
const DOCS_BOLSIN_2: Documentacion[] = [
  {
    id: 4,
    asunto: 'Expediente administrativo N° 789/2026',
    tipoDocumento: 'Expediente',
    fechaPase: '2026-06-12',
    estadoActual: 'En Bolsín Saliente',
  },
  {
    id: 5,
    asunto: 'Resultados de laboratorio - Paciente López',
    tipoDocumento: 'Estudio Médico',
    fechaPase: '2026-06-12',
    estadoActual: 'En Bolsín Saliente',
  },
]

// Documentos del bolsín 3 (4 documentos, variados)
const DOCS_BOLSIN_3: Documentacion[] = [
  {
    id: 6,
    asunto: 'Notificación judicial - Causa N° 3341',
    tipoDocumento: 'Carta Documento',
    fechaPase: '2026-06-13',
    estadoActual: 'En Bolsín Saliente',
  },
  {
    id: 7,
    asunto: 'Dictamen pericial - Accidente laboral',
    tipoDocumento: 'Dictamen',
    fechaPase: '2026-06-13',
    estadoActual: 'En Bolsín Saliente',
  },
  {
    id: 8,
    asunto: 'Estudio complementario - Resonancia magnética',
    tipoDocumento: 'Estudio Médico',
    fechaPase: '2026-06-13',
    estadoActual: 'En Bolsín Saliente',
  },
  {
    id: 9,
    asunto: 'Informe de auditoría médica',
    tipoDocumento: 'Expediente',
    fechaPase: '2026-06-14',
    estadoActual: 'En Bolsín Saliente',
  },
]

// ─── Remitos ───
// Un remito agrupa documentación dirigida a un mismo destino.
// Un bolsín puede tener uno o más remitos.

const REMITOS_BOLSIN_1: Remito[] = [
  {
    id: 1,
    nroRemito: 'REM-001-2026',
    fechaEmision: '2026-06-10',
    estadoActual: 'Enviado',
    documentacion: [DOCS_BOLSIN_1[0], DOCS_BOLSIN_1[1]],
  },
  {
    id: 2,
    nroRemito: 'REM-002-2026',
    fechaEmision: '2026-06-11',
    estadoActual: 'Enviado',
    documentacion: [DOCS_BOLSIN_1[2]],
  },
]

const REMITOS_BOLSIN_2: Remito[] = [
  {
    id: 3,
    nroRemito: 'REM-003-2026',
    fechaEmision: '2026-06-12',
    estadoActual: 'Enviado',
    documentacion: DOCS_BOLSIN_2,
  },
]

const REMITOS_BOLSIN_3: Remito[] = [
  {
    id: 4,
    nroRemito: 'REM-004-2026',
    fechaEmision: '2026-06-13',
    estadoActual: 'Enviado',
    documentacion: [DOCS_BOLSIN_3[0], DOCS_BOLSIN_3[1], DOCS_BOLSIN_3[2]],
  },
  {
    id: 5,
    nroRemito: 'REM-005-2026',
    fechaEmision: '2026-06-14',
    estadoActual: 'Enviado',
    documentacion: [DOCS_BOLSIN_3[3]],
  },
]

// ─── Cambios de Estado ───
// Cada vez que el bolsín cambia de estado, se registra un evento
// con fecha, empleado responsable y el estado al que pasó.
// Esto nos da trazabilidad completa.

const CAMBIOS_BOLSIN_1: CambioEstado[] = [
  {
    fecha: '2026-06-10T09:00:00Z',
    estado: 'Creado',
    empleadoResponsable: 'Salvador Bacci',
  },
  {
    fecha: '2026-06-10T16:30:00Z',
    estado: 'Cerrado',
    empleadoResponsable: 'Salvador Bacci',
  },
  {
    fecha: '2026-06-11T08:00:00Z',
    estado: 'Enviado',
    empleadoResponsable: 'Salvador Bacci',
  },
]

const CAMBIOS_BOLSIN_2: CambioEstado[] = [
  {
    fecha: '2026-06-12T10:00:00Z',
    estado: 'Creado',
    empleadoResponsable: 'Salvador Bacci',
  },
  {
    fecha: '2026-06-12T17:00:00Z',
    estado: 'Cerrado',
    empleadoResponsable: 'Salvador Bacci',
  },
  {
    fecha: '2026-06-13T08:00:00Z',
    estado: 'Enviado',
    empleadoResponsable: 'Salvador Bacci',
  },
]

const CAMBIOS_BOLSIN_3: CambioEstado[] = [
  {
    fecha: '2026-06-13T11:00:00Z',
    estado: 'Creado',
    empleadoResponsable: 'Salvador Bacci',
  },
  {
    fecha: '2026-06-13T17:30:00Z',
    estado: 'Cerrado',
    empleadoResponsable: 'Salvador Bacci',
  },
  {
    fecha: '2026-06-14T08:00:00Z',
    estado: 'Enviado',
    empleadoResponsable: 'Salvador Bacci',
  },
]

// ─── Bolsines ───
// Los 3 bolsines que usamos para probar. Todos están en estado "Enviado"
// y tienen como destino CM Córdoba (que es donde están nuestros usuarios mock).
// Esto asegura que aparezcan en la búsqueda sin filtros adicionales.

export const BOLSIN_1: BolsinDetalle = {
  id: 1,
  nroPrecinto: 'PREC-001-2026',
  fechaEnvio: '2026-06-11',
  peso: 350.5,
  cmOrigen: CM_VILLA_MARIA,
  cmDestino: CM_CORDOBA,
  estadoActual: 'Enviado',
  remitos: REMITOS_BOLSIN_1,
  cambiosEstado: CAMBIOS_BOLSIN_1,
}

export const BOLSIN_2: BolsinDetalle = {
  id: 2,
  nroPrecinto: 'PREC-002-2026',
  fechaEnvio: '2026-06-13',
  peso: 180.0,
  cmOrigen: CM_MENDOZA,
  cmDestino: CM_CORDOBA,
  estadoActual: 'Enviado',
  remitos: REMITOS_BOLSIN_2,
  cambiosEstado: CAMBIOS_BOLSIN_2,
}

export const BOLSIN_3: BolsinDetalle = {
  id: 3,
  nroPrecinto: 'PREC-003-2026',
  fechaEnvio: '2026-06-14',
  peso: 520.75,
  cmOrigen: CM_ROSARIO,
  cmDestino: CM_CORDOBA,
  estadoActual: 'Enviado',
  remitos: REMITOS_BOLSIN_3,
  cambiosEstado: CAMBIOS_BOLSIN_3,
}

// Lista plana de todos los bolsines, para recorrerla en el mock service
export const BOLSINES: BolsinDetalle[] = [BOLSIN_1, BOLSIN_2, BOLSIN_3]
