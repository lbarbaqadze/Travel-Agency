import crypto from 'crypto'

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const API_KEY = process.env.CLOUDINARY_API_KEY
const API_SECRET = process.env.CLOUDINARY_API_SECRET

function signParams(params) {
  const sorted = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&')
  return crypto.createHash('sha1').update(sorted + API_SECRET).digest('hex')
}

export async function uploadImage(buffer, { slug, publicId }) {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    throw new Error('Cloudinary credentials are not configured')
  }

  const timestamp = Math.round(Date.now() / 1000)
  const folder = `travel-agency/tours/${slug}`

  const params = { folder, timestamp }
  if (publicId) params.public_id = publicId

  const signature = signParams(params)

  const form = new FormData()
  form.append('file', new Blob([buffer]), 'upload.jpg')
  form.append('api_key', API_KEY)
  form.append('timestamp', String(timestamp))
  form.append('signature', signature)
  form.append('folder', folder)
  if (publicId) form.append('public_id', publicId)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: form,
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error?.message || 'Cloudinary upload failed')
  }

  return {
    url: data.secure_url,
    public_id: data.public_id,
  }
}

export async function deleteImage(publicId) {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) return

  const timestamp = Math.round(Date.now() / 1000)
  const params = { public_id: publicId, timestamp }
  const signature = signParams(params)

  const form = new FormData()
  form.append('public_id', publicId)
  form.append('api_key', API_KEY)
  form.append('timestamp', String(timestamp))
  form.append('signature', signature)

  await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`, {
    method: 'POST',
    body: form,
  })
}

export async function deleteResourcesByPrefix(prefix) {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) return

  const timestamp = Math.round(Date.now() / 1000)
  const params = { prefix, timestamp }
  const signature = signParams(params)

  const url = new URL(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/delete_by_prefix`)
  url.searchParams.set('prefix', prefix)
  url.searchParams.set('api_key', API_KEY)
  url.searchParams.set('timestamp', String(timestamp))
  url.searchParams.set('signature', signature)

  await fetch(url.toString(), { method: 'POST' })
}

export function tourFolderPrefix(slug) {
  return `travel-agency/tours/${slug}`
}

export async function deleteTourCloudinaryAssets(slug, publicIds = []) {
  await Promise.all(publicIds.map((id) => deleteImage(id)))
  await deleteResourcesByPrefix(tourFolderPrefix(slug))
}
