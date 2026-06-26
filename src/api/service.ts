/**
 * Punto de entrada único para las llamadas a la API.
 *
 * Conectado al backend real vía axios. El proxy de vite.config.ts redirige
 * /api a http://localhost:8080, así que acá alcanza con pedir rutas relativas.
 *
 * El interceptor de errores re-lanza el body de la respuesta
 * (ErrorResponse: { exito, mensaje, codigo }) para que las pantallas muestren
 * err?.mensaje en caso de falla.
 */

import axios from 'axios'
import type { Bolsin, BolsinDetalle, BolsinFilterParams, LoginRequest, LoginResponse, RecepcionResponse, RegistrarRecepcionRequest, Comision, Usuario } from '@/types'

const api = axios.create({ baseURL: '/api' })

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data) {
      return Promise.reject(error.response.data)
    }
    return Promise.reject({ exito: false, mensaje: 'Error de conexión con el servidor' })
  }
)

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const { data: response } = await api.post<LoginResponse>('/usuarios/login', data)
  return response
}

export async function getUsuario(id: number): Promise<Usuario> {
  const { data } = await api.get<Usuario>(`/usuarios/${id}`)
  return data
}

export async function getComisiones(): Promise<Comision[]> {
  const { data } = await api.get<Comision[]>('/comisiones')
  return data
}

export async function getBolsines(params: BolsinFilterParams): Promise<Bolsin[]> {
  const { data } = await api.get<Bolsin[]>('/bolsines', { params })
  return data
}

export async function getBolsinDetalle(id: number): Promise<BolsinDetalle> {
  const { data } = await api.get<BolsinDetalle>(`/bolsines/${id}`)
  return data
}

export async function registrarRecepcion(
  bolsinId: number,
  data: RegistrarRecepcionRequest
): Promise<RecepcionResponse> {
  const { data: response } = await api.put<RecepcionResponse>(`/bolsines/${bolsinId}/recepcion`, data)
  return response
}
