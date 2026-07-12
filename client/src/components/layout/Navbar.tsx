'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { Menu, X, User, LogOut, Compass, ShieldCheck } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/tours', label: 'Tours' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0 },
}

const authFadeTransition = { duration: 0.18 }

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const user = useAuthStore((s) => s.user)
  const isLoading = useAuthStore((s) => s.isLoading)
  const logOut = useAuthStore((s) => s.logOut)

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 8)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  async function handleLogout() {
    await logOut()
    setIsOpen(false)
    router.push('/')
  }

  const primaryLinks =
    !isLoading && user ? [...NAV_LINKS, { href: '/my-bookings', label: 'My Bookings' }] : NAV_LINKS

  const isHeroPage =
    pathname === '/' || pathname === '/tours' || pathname === '/about' || pathname === '/contact'
  const transparent = isHeroPage && !isScrolled

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={`${isHeroPage ? 'fixed' : 'sticky'} top-0 left-0 right-0 z-40 transition-[background-color,border-color,box-shadow] duration-300 ${
          transparent
            ? 'bg-transparent border-transparent shadow-none'
            : `bg-white/80 backdrop-blur-md border-b dark:bg-neutral-950/80 ${isScrolled ? 'border-neutral-200 shadow-sm dark:border-neutral-800' : 'border-neutral-100 shadow-none dark:border-neutral-900'}`
        }`}
      >
        <nav className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          <Link
            href="/"
            className={`flex items-center gap-2 group shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${transparent ? 'focus-visible:ring-white' : 'focus-visible:ring-neutral-900 dark:focus-visible:ring-white'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform ${transparent ? 'bg-neutral-900' : 'bg-neutral-900 dark:bg-white'}`}>
              <Compass className={`w-4.5 h-4.5 ${transparent ? 'text-white' : 'text-white dark:text-neutral-900'}`} strokeWidth={2.2} />
            </div>
            <span className={`text-lg font-light tracking-tight whitespace-nowrap transition-colors ${transparent ? 'text-white' : 'text-neutral-900 dark:text-white'}`}>
              Vo<span className="font-bold">yager</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-7 flex-1 justify-center">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-xs font-bold uppercase tracking-widest transition-colors py-2 whitespace-nowrap rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  transparent
                    ? `focus-visible:ring-white ${pathname === link.href ? 'text-white' : 'text-white/60 hover:text-white'}`
                    : `focus-visible:ring-neutral-900 dark:focus-visible:ring-white ${pathname === link.href ? 'text-black dark:text-white' : 'text-neutral-400 hover:text-black dark:text-neutral-500 dark:hover:text-white'}`
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.span
                    layoutId="navbar-underline"
                    className={`absolute -bottom-px left-0 right-0 h-0.5 rounded-full ${transparent ? 'bg-white' : 'bg-neutral-900 dark:bg-white'}`}
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
              </Link>
            ))}

            {!isLoading && user?.role === 'admin' && (
              <Link
                href="/admin"
                className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  transparent
                    ? 'text-white/60 hover:text-white focus-visible:ring-white'
                    : 'text-neutral-400 hover:text-black focus-visible:ring-neutral-900 dark:text-neutral-500 dark:hover:text-white dark:focus-visible:ring-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-3 shrink-0 min-w-[120px] justify-end">
            <ThemeToggle transparent={transparent} />
            {isLoading && !user ? (
              <div
                className={`h-10 w-[148px] rounded-full animate-pulse ${
                  transparent ? 'bg-white/15' : 'bg-neutral-200 dark:bg-neutral-800'
                }`}
                aria-hidden
              />
            ) : (
            <AnimatePresence mode="wait" initial={false}>
              {user ? (
                <motion.div
                  key="user"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={authFadeTransition}
                  className="flex items-center gap-3"
                >
                  <Link
                    href="/profile"
                    className={`flex items-center gap-2 h-10 pl-1.5 pr-4 rounded-full border transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                      transparent
                        ? 'border-white/30 hover:border-white/50 focus-visible:ring-white'
                        : 'border-neutral-200 hover:border-neutral-300 focus-visible:ring-neutral-900 dark:border-neutral-700 dark:hover:border-neutral-600 dark:focus-visible:ring-white'
                    }`}
                  >
                    <span className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    <span className={`text-xs font-semibold whitespace-nowrap capitalize ${transparent ? 'text-white/90 group-hover:text-white' : 'text-neutral-700 group-hover:text-black dark:text-neutral-200 dark:group-hover:text-white'}`}>
                      {user.name}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`cursor-pointer w-10 h-10 flex items-center justify-center rounded-full border transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                      transparent
                        ? 'border-white/30 text-white/80 hover:text-white hover:border-white/50 focus-visible:ring-white'
                        : 'border-neutral-200 text-neutral-500 hover:text-black hover:border-neutral-300 focus-visible:ring-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-white dark:hover:border-neutral-600 dark:focus-visible:ring-white'
                    }`}
                    aria-label="Log out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="guest"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={authFadeTransition}
                  className="flex items-center gap-3"
                >
                  <Link
                    href="/login"
                    className={`text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                      transparent
                        ? 'text-white/80 hover:text-white focus-visible:ring-white'
                        : 'text-neutral-600 hover:text-black focus-visible:ring-neutral-900 dark:text-neutral-400 dark:hover:text-white dark:focus-visible:ring-white'
                    }`}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className={`h-10 px-5 flex items-center rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-sm whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                      transparent
                        ? 'bg-white text-neutral-900 hover:bg-neutral-100 focus-visible:ring-white'
                        : 'bg-neutral-900 text-white hover:bg-black focus-visible:ring-neutral-900 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 dark:focus-visible:ring-white'
                    }`}
                  >
                    Register
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden shrink-0">
            <ThemeToggle transparent={transparent} />
          <button
            onClick={() => setIsOpen((v) => !v)}
            className={`lg:hidden relative flex items-center justify-center w-10 h-10 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              transparent
                ? 'text-white hover:bg-white/10 focus-visible:ring-white'
                : 'text-neutral-900 hover:bg-neutral-100 focus-visible:ring-neutral-900 dark:text-white dark:hover:bg-neutral-800 dark:focus-visible:ring-white'
            }`}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="flex"
                >
                  <X className="w-6 h-6" strokeWidth={2} />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="flex"
                >
                  <Menu className="w-6 h-6" strokeWidth={2} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-50 bg-black/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              key="panel"
              id="mobile-menu"
              className="fixed right-0 top-0 z-50 h-full w-[80%] max-w-sm bg-white shadow-2xl flex flex-col lg:hidden dark:bg-neutral-950 dark:shadow-black/50"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              <div className="flex items-center justify-between px-7 py-6 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-neutral-900 flex items-center justify-center shrink-0 dark:bg-white">
                    <Compass className="w-3.5 h-3.5 text-white dark:text-neutral-900" strokeWidth={2.2} />
                  </div>
                  <span className="text-lg font-light tracking-tight dark:text-white">
                    Vo<span className="font-bold">yager</span>
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                  className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:hover:bg-neutral-800 dark:text-neutral-400 dark:focus-visible:ring-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!isLoading && user && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05, duration: 0.25 }}
                  className="flex items-center gap-3 px-7 py-5 border-b border-neutral-100 dark:border-neutral-800"
                >
                  <span className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-neutral-900 truncate capitalize dark:text-white">
                      {user.name} {user.surname}
                    </p>
                    <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                  </div>
                </motion.div>
              )}

              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="flex-1 overflow-y-auto flex flex-col gap-1 p-5"
              >
                {NAV_LINKS.map((link) => (
                  <motion.div key={link.href} variants={itemVariants}>
                    <Link
                      href={link.href}
                      className={`block px-3 py-3 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white ${
                        pathname === link.href
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                          : 'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {!isLoading && user && (
                  <motion.div variants={itemVariants}>
                    <Link
                      href="/my-bookings"
                      className={`block px-3 py-3 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white ${
                        pathname === '/my-bookings'
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                          : 'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900'
                      }`}
                    >
                      My Bookings
                    </Link>
                  </motion.div>
                )}

                {!isLoading && user?.role === 'admin' && (
                  <motion.div variants={itemVariants}>
                    <div className="h-px bg-neutral-100 my-2 dark:bg-neutral-800" />
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-bold uppercase tracking-widest text-neutral-700 hover:bg-neutral-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:focus-visible:ring-white"
                    >
                      <ShieldCheck className="w-4 h-4 text-neutral-400" />
                      Admin Panel
                    </Link>
                  </motion.div>
                )}
              </motion.div>

              <div className="p-5 border-t border-neutral-100 flex flex-col gap-3 dark:border-neutral-800">
                {isLoading && !user ? (
                  <div className="h-12 w-full rounded-full bg-neutral-100 animate-pulse dark:bg-neutral-800" />
                ) : user ? (
                  <>
                    <Link
                      href="/profile"
                      className="h-12 flex items-center justify-center gap-2 rounded-full border border-neutral-200 text-xs font-bold uppercase tracking-widest hover:bg-neutral-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-900 dark:focus-visible:ring-white"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="h-12 flex items-center justify-center gap-2 rounded-full bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 dark:focus-visible:ring-white"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="h-12 flex items-center justify-center rounded-full border border-neutral-200 text-xs font-bold uppercase tracking-widest hover:bg-neutral-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-900 dark:focus-visible:ring-white"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="h-12 flex items-center justify-center rounded-full bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 dark:focus-visible:ring-white"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
