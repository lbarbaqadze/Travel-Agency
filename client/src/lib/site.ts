export const siteConfig = {
  name: 'Voyager',
  title: 'Voyager — Curated Tours Across Europe',
  description:
    'Discover hand-picked tours across Europe. Transparent pricing, secure booking, and real support from search to return.',
  locale: 'en_US',
  email: 'infovoyager2021@gmail.com',
  twitterHandle: '@voyager',
  defaultOgImage:
    'https://res.cloudinary.com/dcuhfeoor/image/upload/f_auto,q_auto:good,w_1200,h_630,c_fill/hero-jet_v3hjgh',
} as const

export function getSiteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL
  if (url) return url.replace(/\/$/, '')
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}
