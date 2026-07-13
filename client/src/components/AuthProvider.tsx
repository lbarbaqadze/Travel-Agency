'use client'

import { useEffect, useLayoutEffect } from 'react'
import { useAuthStore, hydrateFromSession } from '@/store/authStore'

let authCheckStarted = false

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((s) => s.checkAuth)

  useLayoutEffect(() => {
    hydrateFromSession()
  }, [])

  useEffect(() => {
    if (authCheckStarted) return
    authCheckStarted = true
    checkAuth()
  }, [checkAuth])

  return <>{children}</>
}
