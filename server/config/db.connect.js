import mysql2 from 'mysql2/promise'

const dbconnect = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 3,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: true,
        minVersion: 'TLSv1.2',
    },
})

export default dbconnect