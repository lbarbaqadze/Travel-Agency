import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site'
import { fetchAllTourSlugs } from '@/lib/server-api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()
  const slugs = await fetchAllTourSlugs()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/tours`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  const tourRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${base}/tours/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...tourRoutes]
}
