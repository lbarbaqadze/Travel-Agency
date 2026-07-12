import dbconnect from '../config/db.connect.js'

export const bookingModel = {

    createBooking: async (bookingData) => {
        const [result] = await dbconnect.execute(
            `INSERT INTO bookings (user_id, tour_id, guests, total_price)
            VALUES (?, ?, ?, ?)`,
            [bookingData.userId, bookingData.tourId, bookingData.guests, bookingData.totalPrice]
        )
        return result.insertId
    },

    createBookingWithCapacityCheck: async ({ userId, tourId, guests }) => {
        const connection = await dbconnect.getConnection()
        try {
            await connection.beginTransaction()

            const [tourRows] = await connection.execute(
                "SELECT * FROM tours WHERE id = ? FOR UPDATE", [tourId]
            )
            const tour = tourRows[0]
            if (!tour) {
                await connection.rollback()
                return { error: 'TOUR_NOT_FOUND' }
            }

            const [countRows] = await connection.execute(
                `SELECT COALESCE(SUM(guests), 0) AS total_booked
                 FROM bookings
                 WHERE tour_id = ? AND status IN ('confirmed', 'pending')`,
                [tourId]
            )
            const bookedGuests = Number(countRows[0].total_booked)

            if (bookedGuests + guests > tour.max_guests) {
                await connection.rollback()
                return {
                    error: 'NOT_ENOUGH_SPOTS',
                    availableSpots: Math.max(0, tour.max_guests - bookedGuests)
                }
            }

            const [existingRows] = await connection.execute(
                `SELECT id FROM bookings
                 WHERE user_id = ? AND tour_id = ? AND status IN ('pending', 'confirmed')
                 LIMIT 1`,
                [userId, tourId]
            )
            if (existingRows.length > 0) {
                await connection.rollback()
                return { error: 'ALREADY_BOOKED' }
            }

            const totalPrice = tour.price * guests
            const [result] = await connection.execute(
                `INSERT INTO bookings (user_id, tour_id, guests, total_price)
                 VALUES (?, ?, ?, ?)`,
                [userId, tourId, guests, totalPrice]
            )

            await connection.commit()
            return { bookingId: result.insertId, totalPrice, tourTitle: tour.title }
        } catch (error) {
            await connection.rollback()
            throw error
        } finally {
            connection.release()
        }
    },

    getBookingById: async (id) => {
        const [rows] = await dbconnect.execute(
            "SELECT * FROM bookings WHERE id = ?",
            [id]
        )
        return rows[0] || null
    },

    getBookingByUser: async (userId) => {
        const [rows] = await dbconnect.execute(
            `SELECT b.*, t.title as tour_title, t.destination 
             FROM bookings b
             JOIN tours t ON b.tour_id = t.id
             WHERE b.user_id = ?
             ORDER BY b.created_at DESC`,
            [userId]
        )
        return rows
    },

    getAllBookings: async () => {
        const [rows] = await dbconnect.execute(
            `SELECT b.*, t.title AS tour_title, t.destination,
                    u.name, u.surname, u.email
             FROM bookings b
             JOIN tours t ON b.tour_id = t.id
             JOIN users u ON b.user_id = u.id
             ORDER BY b.created_at DESC`
        )
        return rows
    },

    updateBookingStatus: async (bookingId, status) => {
        const [result] = await dbconnect.execute(
            "UPDATE bookings SET status = ? WHERE id = ?",
            [status, bookingId]
        )
        return result
    },

    getBookedGuestsCountForTour: async (tourId) => {
        const [rows] = await dbconnect.execute(
            `SELECT SUM(guests) as total_booked 
             FROM bookings 
             WHERE tour_id = ? AND status IN ('confirmed', 'pending')`,
            [tourId]
        );
        return rows[0].total_booked ? parseInt(rows[0].total_booked) : 0;
    },

    deleteBooking: async (id) => {
        const connection = await dbconnect.getConnection()
        try {
            await connection.beginTransaction()
            await connection.execute("DELETE FROM payments WHERE booking_id = ?", [id])
            const [result] = await connection.execute("DELETE FROM bookings WHERE id = ?", [id])
            await connection.commit()
            return result
        } catch (error) {
            await connection.rollback()
            throw error
        } finally {
            connection.release()
        }
    },

    getBookingWithTourDetails: async (bookingId) => {
        const [rows] = await dbconnect.execute(
            `SELECT b.id, b.user_id, b.total_price, b.status, t.title 
             FROM bookings b
             JOIN tours t ON b.tour_id = t.id
             WHERE b.id = ?`,
            [bookingId]
        );
        return rows[0];
    }
}