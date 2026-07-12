const API_URL = process.env.NEXT_PUBLIC_API_URL as string

interface UploadResponse {
  status: string
  data: { url: string; public_id: string }
}

export async function uploadTourImage(
  file: File,
  slug: string,
  publicId?: string
): Promise<{ url: string; public_id: string }> {
  const form = new FormData()
  form.append('file', file)
  form.append('slug', slug)
  if (publicId) form.append('publicId', publicId)

  const res = await fetch(`${API_URL}${'/upload/image'}`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  })

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(data?.message || 'Upload failed')
  }

  return (data as UploadResponse).data
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function toDateInputValue(iso: string | Date | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}
