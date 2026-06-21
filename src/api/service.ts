/**
 * Punto de entrada único para las llamadas a la API.
 *
 * Hoy usa mock data para poder desarrollar sin backend. Mañana, cuando
 * el grupo de backend tenga los endpoints funcionando, cambiamos las
 * implementaciones acá adentro por axios y listo. La interfaz es la misma.
 *
 * Esto es básicamente un adapter que nos permite conmutar entre mock y real
 * sin tocar ni una línea de las pantallas.
 */

import { mockLogin, mockGetUsuario, mockGetComisiones, mockGetBolsines, mockGetBolsinDetalle, mockRegistrarRecepcion } from './mock/mockService'
import type { Bolsin, BolsinDetalle, BolsinFilterParams, LoginRequest, LoginResponse, RecepcionResponse, RegistrarRecepcionRequest, Comision, Usuario } from '@/types'

export async function login(data: LoginRequest): Promise<LoginResponse> {
  return mockLogin(data)
}

export async function getUsuario(id: number): Promise<Usuario> {
  return mockGetUsuario(id)
}

export async function getComisiones(): Promise<Comision[]> {
  return mockGetComisiones()
}

export async function getBolsines(params: BolsinFilterParams): Promise<Bolsin[]> {
  return mockGetBolsines(params)
}

export async function getBolsinDetalle(id: number): Promise<BolsinDetalle> {
  return mockGetBolsinDetalle(id)
}

export async function registrarRecepcion(
  bolsinId: number,
  data: RegistrarRecepcionRequest
): Promise<RecepcionResponse> {
  return mockRegistrarRecepcion(bolsinId, data)
}
