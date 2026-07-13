import { create } from 'zustand'
import { api, ApiError } from '@/lib/api'
import { ENDPOINTS } from '@/lib/endpoints'

export interface User {
  id: number
  name: string
  surname: string
  email: string
  role: 'user' | 'admin'
  is_verified: boolean
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticating: boolean

  signIn: (email: string, password: string) => Promise<void>
  signUp: (data: {
    name: string
    surname: string
    email: string
    password: string
  }) => Promise<{ userId: number; email: string }>
  verifyEmail: (email: string, code: string) => Promise<void>
  resendVerification: (email: string) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (code: string, newPassword: string) => Promise<void>
  logOut: () => Promise<void>
  checkAuth: () => Promise<void>
  updateProfile: (data: { name: string; surname: string }) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string, code: string) => Promise<void>
  requestChangePasswordCode: () => Promise<void>
}

function normalizeUser(raw: Record<string, unknown>): User {
  return {
    id: raw.id as number,
    name: raw.name as string,
    surname: raw.surname as string,
    email: raw.email as string,
    role: raw.role as User['role'],
    is_verified: Boolean(raw.is_verified),
  }
}

const AUTH_CACHE_KEY = 'voyager-auth-user'

function readCachedUser(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(AUTH_CACHE_KEY)
    if (!raw) return null
    return normalizeUser(JSON.parse(raw) as Record<string, unknown>)
  } catch {
    return null
  }
}

function cacheUser(user: User | null) {
  if (typeof window === 'undefined') return
  if (user) sessionStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(user))
  else sessionStorage.removeItem(AUTH_CACHE_KEY)
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticating: false,

  signIn: async (email, password) => {
    set({ isAuthenticating: true })
    try {
      const res = await api<{ data: { user: Record<string, unknown> } }>(ENDPOINTS.signIn, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        skipAuth: true,
      })

      const user = normalizeUser(res.data.user)
      cacheUser(user)
      set({ user, isAuthenticating: false })
    } catch (err) {
      set({ isAuthenticating: false })
      throw err
    }
  },

  signUp: async (data) => {
    set({ isAuthenticating: true })
    try {
      const res = await api<{ data: { userId: number; email: string } }>(ENDPOINTS.signUp, {
        method: 'POST',
        body: JSON.stringify(data),
        skipAuth: true,
      })
      set({ isAuthenticating: false })
      return res.data
    } catch (err) {
      set({ isAuthenticating: false })
      throw err
    }
  },

  verifyEmail: async (email, code) => {
    await api(ENDPOINTS.verifyEmail, {
      method: 'POST',
      body: JSON.stringify({ email, code }),
      skipAuth: true,
    })
  },

  resendVerification: async (email) => {
    await api(ENDPOINTS.resendVerification, {
      method: 'POST',
      body: JSON.stringify({ email }),
      skipAuth: true,
    })
  },

  forgotPassword: async (email) => {
    await api(ENDPOINTS.forgotPassword, {
      method: 'POST',
      body: JSON.stringify({ email }),
      skipAuth: true,
    })
  },

  resetPassword: async (code, newPassword) => {
    await api(ENDPOINTS.resetPassword, {
      method: 'POST',
      body: JSON.stringify({ code, newPassword }),
      skipAuth: true,
    })
  },

  logOut: async () => {
    try {
      await api(ENDPOINTS.logOut, { method: 'POST' })
    } finally {
      cacheUser(null)
      set({ user: null })
    }
  },

  checkAuth: async () => {
    const hasCachedUser = Boolean(useAuthStore.getState().user)

    if (!hasCachedUser) {
      set({ isLoading: false })
      try {
        const res = await api<{ data: { user: Record<string, unknown> } }>(ENDPOINTS.me, {
          skipRefresh: true,
          skipSessionCleanup: true,
        })
        const user = normalizeUser(res.data.user)
        cacheUser(user)
        set({ user })
      } catch {
        // not logged in — no refresh/log-out cycle
      }
      return
    }

    set({ isLoading: true })
    try {
      const res = await api<{ data: { user: Record<string, unknown> } }>(ENDPOINTS.me)
      const user = normalizeUser(res.data.user)
      cacheUser(user)
      set({ user, isLoading: false })
    } catch {
      cacheUser(null)
      set({ user: null, isLoading: false })
    }
  },

  updateProfile: async (data) => {
    const res = await api<{ data: { user: Record<string, unknown> } }>(ENDPOINTS.updateProfile, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
    const user = normalizeUser(res.data.user)
    cacheUser(user)
    set({ user })
  },

  changePassword: async (currentPassword, newPassword, code) => {
    await api(ENDPOINTS.changePassword, {
      method: 'PATCH',
      body: JSON.stringify({ currentPassword, newPassword, code }),
    })
    cacheUser(null)
    set({ user: null })
  },

  requestChangePasswordCode: async () => {
    await api(ENDPOINTS.changePasswordCode, { method: 'POST' })
  },
}))

export function hydrateFromSession() {
  const cached = readCachedUser()
  if (cached) {
    useAuthStore.setState({ user: cached, isLoading: false })
  }
}

export { ApiError }
