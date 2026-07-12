import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/login',
        '/register',
        '/profile',
        '/my-bookings',
        '/change-password',
        '/forgot-password',
        '/verify-email',
        '/api/',
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
