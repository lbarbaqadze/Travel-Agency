'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, Compass, LayoutDashboard, Map, MessageSquare, Users, X } from 'lucide-react'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/tours', label: 'Tours', icon: Map },
  { href: '/admin/bookings', label: 'Bookings', icon: CalendarDays },
  { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
  { href: '/admin/users', label: 'Users', icon: Users },
]

interface AdminSidebarProps {
  mobileOpen: boolean
  onMobileClose: () => void
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <>
      <div className="flex items-center justify-between gap-2 border-b border-neutral-100 px-5 py-5 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 dark:bg-white">
            <Compass className="h-4 w-4 text-white dark:text-neutral-900" strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-900 dark:text-white">Voyager</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Admin</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onNavigate}
          aria-label="Close menu"
          className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 lg:hidden dark:hover:bg-neutral-800"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-neutral-100 p-3 dark:border-neutral-800">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center justify-center rounded-xl border border-neutral-200 px-3 py-2.5 text-xs font-bold uppercase tracking-widest text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
        >
          Back to site
        </Link>
      </div>
    </>
  )
}

export default function AdminSidebar({ mobileOpen, onMobileClose }: AdminSidebarProps) {
  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-neutral-100 bg-white transition-transform duration-300 dark:border-neutral-800 dark:bg-neutral-950 lg:static lg:z-auto lg:w-56 lg:shrink-0 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent onNavigate={onMobileClose} />
      </aside>
    </>
  )
}
