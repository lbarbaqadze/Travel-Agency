import dbconnect from '../config/db.connect.js';

export const paymentsModel = {

    createPayment: async (paymentData) => {
        const { bookingId, stripeSessionId, amount } = paymentData;

        const [result] = await dbconnect.execute(
            `INSERT INTO payments (booking_id, stripe_session_id, amount) 
             VALUES (?, ?, ?)`,
            [bookingId, stripeSessionId, amount]
        );
        return result.insertId;
    },

    updatePaymentStatusBySessionId: async (sessionId, status, stripePaymentId) => {
        const connection = await dbconnect.getConnection();
        try {
            await connection.beginTransaction();

            await connection.execute(
                `UPDATE payments 
                 SET status = ?, stripe_payment_id = ? 
                 WHERE stripe_session_id = ?`,
                [status, stripePaymentId, sessionId]
            );

            if (status === 'paid') {
                await connection.execute(
                    `UPDATE bookings b
                     JOIN payments p ON b.id = p.booking_id
                     SET b.status = 'confirmed'
                     WHERE p.stripe_session_id = ?`,
                    [sessionId]
                );
            }

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    updatePaymentStatus: async (bookingId, status) => {
        await dbconnect.execute(
            "UPDATE payments SET status = ? WHERE booking_id = ?",
            [status, bookingId]
        );
        await dbconnect.execute(
            "UPDATE bookings SET status = ? WHERE id = ?",
            [status === 'failed' ? 'cancelled' : 'confirmed', bookingId]
        );
    },
    
    findByBookingId: async (bookingId) => {
        const [rows] = await dbconnect.execute(
            "SELECT * FROM payments WHERE booking_id = ?",
            [bookingId]
        );
        return rows[0] || null;
    },

    getBookingBySessionId: async (sessionId) => {
        const [rows] = await dbconnect.execute(
            `SELECT b.id, b.user_id, b.guests, b.total_price, b.status, t.title AS tour_title, t.destination
             FROM payments p
             JOIN bookings b ON b.id = p.booking_id
             JOIN tours t ON t.id = b.tour_id
             WHERE p.stripe_session_id = ?`,
            [sessionId]
        );
        return rows[0] || null;
    },
    
    updateSessionId: async (bookingId, newSessionId) => {
        await dbconnect.execute(
            "UPDATE payments SET stripe_session_id = ? WHERE booking_id = ?",
            [newSessionId, bookingId]
        );
    },
}