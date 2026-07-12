import 'dotenv/config'
import dbconnect from '../config/db.connect.js'

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const API_KEY = process.env.CLOUDINARY_API_KEY
const API_SECRET = process.env.CLOUDINARY_API_SECRET

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.error('Missing Cloudinary credentials in .env')
  process.exit(1)
}

const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64')

async function searchAll(expression) {
  let all = []
  let cursor
  do {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/search`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expression, max_results: 500, next_cursor: cursor }),
    })
    if (!res.ok) throw new Error(`Cloudinary API error ${res.status}: ${await res.text()}`)
    const data = await res.json()
    all = all.concat(data.resources || [])
    cursor = data.next_cursor
  } while (cursor)
  return all
}

async function main() {
  console.log('🔎 Fetching all Cloudinary resources...')
  const resources = await searchAll('resource_type:image')
  console.log(`Found ${resources.length} resources on Cloudinary.\n`)

  const [tours] = await dbconnect.query('SELECT id, slug FROM tours')
  console.log(`Found ${tours.length} tours in the database.\n`)

  let totalFixed = 0
  let totalSkipped = 0

  for (const tour of tours) {
    const countryPart = tour.slug.replace('-getaway', '')
    const prefix = `${countryPart}-`

    const matches = resources.filter((r) => r.public_id.startsWith(prefix))

    if (matches.length === 0) {
      console.log(`⚠️  ${tour.slug} — no matching Cloudinary images found (prefix "${prefix}")`)
      totalSkipped++
      continue
    }

    matches.sort((a, b) => a.public_id.localeCompare(b.public_id))

    const images = matches.map((r) => {
      const isHotel = r.public_id.includes('-hotel')
      const isCover = r.public_id.startsWith(`${countryPart}-destination1_`)
      return {
        url: r.secure_url,
        public_id: r.public_id,
        image_type: isHotel ? 'hotel' : 'destination',
        is_cover: isCover,
      }
    })

    if (!images.some((img) => img.is_cover)) {
      images[0].is_cover = true
    }

    await dbconnect.query('DELETE FROM tour_images WHERE tour_id = ?', [tour.id])

    const values = images.map((img) => [
      tour.id,
      img.url,
      img.public_id,
      img.image_type,
      img.is_cover ? 1 : 0,
    ])
    await dbconnect.query(
      'INSERT INTO tour_images (tour_id, url, public_id, image_type, is_cover) VALUES ?',
      [values]
    )

    console.log(`✅ ${tour.slug} — fixed with ${images.length} image(s)`)
    totalFixed++
  }

  console.log(`\n🎉 Done. Fixed: ${totalFixed}, Skipped: ${totalSkipped}`)
  await dbconnect.end()
}

main().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
})
