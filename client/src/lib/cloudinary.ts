export function optimizeImageUrl(
  url: string,
  options: { width: number; height?: number; crop?: 'fill' | 'limit' }
): string {
  if (!url?.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url
  }

  const crop = options.crop ?? (options.height ? 'fill' : 'limit')
  const heightPart = options.height ? `,h_${options.height}` : ''
  const transform = `f_auto,q_auto:good,w_${options.width}${heightPart},c_${crop}`

  const [prefix, rest] = url.split('/upload/')
  if (!rest) return url

  let path = rest
  while (path.includes('/')) {
    const segment = path.split('/')[0]
    if (/^v\d+$/.test(segment)) break
    if (/[,]/.test(segment) && /[fwhqc]_/.test(segment)) {
      path = path.slice(segment.length + 1)
      continue
    }
    break
  }

  return `${prefix}/upload/${transform}/${path}`
}

export function cld(publicId: string, width = 2400) {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto:good,w_${width}/${publicId}`
}
