'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu } from 'lucide-react'
import { AdminSidebar } from '@/components/admin'
import { useAuthStore } from '@/store/authStore'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const isLoading = useAuthStore((s) => s.isLoading)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.replace('/')
    }
  }, [isLoading, isAdmin, router])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  if (isLoading || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 text-sm text-neutral-400 dark:bg-neutral-950 dark:text-neutral-500">
        Loading admin panel...
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <AdminSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-neutral-100 bg-white px-4 py-3 lg:hidden dark:border-neutral-800 dark:bg-neutral-950">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <p className="text-sm font-bold text-neutral-900 dark:text-white">Voyager Admin</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Control panel</p>
          </div>
        </header>

        {children}
      </div>
    </div>
  )
}
