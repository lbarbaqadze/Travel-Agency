import Link from 'next/link'
import { Compass } from 'lucide-react'

const exploreLinks = [
  { href: '/', label: 'Home' },
  { href: '/tours', label: 'Tours' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

const accountLinks = [
  { href: '/login', label: 'Sign in' },
  { href: '/register', label: 'Create account' },
  { href: '/my-bookings', label: 'My bookings' },
  { href: '/profile', label: 'Profile' },
]

const legalLinks = [
  { href: '/contact', label: 'Help & support' },
  { href: '/about', label: 'About Voyager' },
]

const socialLinks = [
  { href: 'https://instagram.com', label: 'Instagram', external: true },
  { href: 'https://linkedin.com', label: 'LinkedIn', external: true },
  { href: 'https://facebook.com', label: 'Facebook', external: true },
]

function FooterLink({
  href,
  label,
  external,
}: {
  href: string
  label: string
  external?: boolean
}) {
  const className =
    'text-[13px] text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  )
}

export default function Footer() {
  return (
    <footer className="border-t border-neutral-100 bg-white pt-10 sm:pt-15 pb-12 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16 xl:gap-24">
          <div className="max-w-sm shrink-0">
            <Link href="/" className="mb-6 inline-flex items-center gap-2 group">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 shadow-sm transition-transform group-hover:scale-105 dark:bg-white">
                <Compass className="h-4 w-4 text-white dark:text-neutral-900" strokeWidth={2.2} />
              </span>
              <span className="text-xl font-light tracking-tight text-neutral-900 dark:text-white">
                Vo<span className="font-bold">yager</span>
              </span>
            </Link>
            <p className="mb-8 text-[13px] font-light leading-relaxed text-neutral-500 dark:text-neutral-400">
              Curated tours, transparent pricing, and seamless booking — discover hand-picked
              destinations and plan your next adventure in minutes.
            </p>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                Get in touch
              </span>
              <a
                href="mailto:infovoyager2021@gmail.com"
                className="break-all text-sm font-medium text-neutral-900 transition-colors hover:text-neutral-500 dark:text-white dark:hover:text-neutral-300"
              >
                infovoyager2021@gmail.com
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:flex lg:flex-1 lg:justify-end lg:gap-x-16 xl:gap-x-24">
            <div className="flex min-w-[120px] flex-col gap-5 sm:min-w-[140px]">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-900 dark:text-white">
                Explore
              </h4>
              <ul className="flex flex-col gap-3">
                {exploreLinks.map((item) => (
                  <li key={item.href}>
                    <FooterLink href={item.href} label={item.label} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex min-w-[120px] flex-col gap-5 sm:min-w-[140px]">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-900 dark:text-white">
                Account
              </h4>
              <ul className="flex flex-col gap-3">
                {accountLinks.map((item) => (
                  <li key={item.href}>
                    <FooterLink href={item.href} label={item.label} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 flex min-w-[120px] flex-col gap-5 sm:col-span-1 sm:min-w-[140px]">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-900 dark:text-white">
                Connect
              </h4>
              <ul className="flex flex-col gap-3">
                {legalLinks.map((item) => (
                  <li key={item.label}>
                    <FooterLink href={item.href} label={item.label} />
                  </li>
                ))}
                {socialLinks.map((item) => (
                  <li key={item.label}>
                    <FooterLink href={item.href} label={item.label} external />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-6 border-t border-neutral-100 pt-5 md:flex-row dark:border-neutral-800">
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-10">
            <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
              © {new Date().getFullYear()} Voyager
            </p>
            <div className="flex gap-6">
              <Link
                href="/contact#privacy"
                className="text-[11px] uppercase tracking-wider text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-white"
              >
                Privacy
              </Link>
              <Link
                href="/contact#terms"
                className="text-[11px] uppercase tracking-wider text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-white"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
