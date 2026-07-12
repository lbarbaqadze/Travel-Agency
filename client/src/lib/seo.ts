import type { Metadata } from 'next'
import { optimizeImageUrl } from './cloudinary'
import { getSiteUrl, siteConfig } from './site'

type PageMetaInput = {
  title: string
  description?: string
  path?: string
  image?: string
  noIndex?: boolean
}

export function buildPageMetadata({
  title,
  description = siteConfig.description,
  path = '',
  image = siteConfig.defaultOgImage,
  noIndex = false,
}: PageMetaInput): Metadata {
  const siteUrl = getSiteUrl()
  const url = `${siteUrl}${path}`
  const fullTitle = path === '' || path === '/' ? siteConfig.title : `${title} | ${siteConfig.name}`

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: siteConfig.locale,
      url,
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  }
}

export function buildTourMetadata(tour: {
  title: string
  description: string
  slug: string
  destination: string
  cover_image?: string | null
  images?: { url: string; is_cover?: boolean | number }[]
}): Metadata {
  const cover =
    tour.cover_image ??
    tour.images?.find((img) => img.is_cover)?.url ??
    tour.images?.[0]?.url ??
    siteConfig.defaultOgImage

  const description =
    tour.description.length > 155 ? `${tour.description.slice(0, 152)}...` : tour.description

  return buildPageMetadata({
    title: `${tour.title} — ${tour.destination}`,
    description,
    path: `/tours/${tour.slug}`,
    image: optimizeImageUrl(cover, { width: 1200, height: 630, crop: 'fill' }),
  })
}

export const noIndexMetadata: Metadata = {
  robots: { index: false, follow: false },
}
