import 'dotenv/config'
import dbconnect from '../config/db.connect.js'

const timeout = setTimeout(() => {
  console.error('DB query timed out after 15s')
  process.exit(1)
}, 15000)

try {
  const [rows] = await dbconnect.query('SELECT COUNT(*) as c FROM tours')
  console.log('tours count:', rows[0].c)

  const [active] = await dbconnect.query('SELECT COUNT(*) as c FROM tours WHERE is_active = TRUE')
  console.log('active tours:', active[0].c)

  const [sample] = await dbconnect.query(
    'SELECT id, title, is_active FROM tours LIMIT 3'
  )
  console.log('sample:', sample)

  clearTimeout(timeout)
  await dbconnect.end()
  process.exit(0)
} catch (e) {
  console.error('DB ERROR:', e.message)
  clearTimeout(timeout)
  process.exit(1)
}
