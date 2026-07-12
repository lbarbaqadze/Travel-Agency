'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import { useAuthStore, hydrateFromSession } from '@/store/authStore'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((s) => s.checkAuth)
  const hasChecked = useRef(false)

  useLayoutEffect(() => {
    hydrateFromSession()
  }, [])

  useEffect(() => {
    if (hasChecked.current) return
    hasChecked.current = true
    checkAuth()
  }, [checkAuth])

  return <>{children}</>
}
