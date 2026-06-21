/**
 * Store de autenticación con Zustand.
 *
 * Mantiene el estado de sesión del usuario logueado: token, datos del usuario
 * y un flag de autenticación. Es lo más básico posible — no persistimos nada
 * todavía (en el futuro podríamos meter el token en localStorage).
 *
 * El login() y logout() actualizan el estado y las pantallas reaccionan
 * automáticamente gracias a Zustand.
 */

import { create } from 'zustand'
import type { Usuario } from '@/types'

interface AuthState {
  token: string | null
  usuario: Usuario | null
  isAuthenticated: boolean
  login: (token: string, usuario: Usuario) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  usuario: null,
  isAuthenticated: false,

  login: (token: string, usuario: Usuario) => {
    set({ token, usuario, isAuthenticated: true })
  },

  logout: () => {
    set({ token: null, usuario: null, isAuthenticated: false })
  },
}))
