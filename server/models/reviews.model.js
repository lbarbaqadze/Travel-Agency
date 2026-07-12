import dbconnect from '../config/db.connect.js'

export const reviewsModel = {

    createOrUpdateReview: async (userId, tourId, rating, comment) => {
        const [result] = await dbconnect.execute(
            `INSERT INTO reviews (user_id, tour_id, rating, comment)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment)`,
            [userId, tourId, rating, comment]
        )
        return result
    },

    getReviewsByTour: async (tourId) => {
        const [rows] = await dbconnect.execute(
            `SELECT r.id, r.rating, r.comment, r.created_at, u.name, u.surname
             FROM reviews r
             JOIN users u ON r.user_id = u.id
             WHERE r.tour_id = ?
             ORDER BY r.created_at DESC`,
            [tourId]
        )
        return rows
    },

    getReviewById: async (id) => {
        const [rows] = await dbconnect.execute(
            "SELECT * FROM reviews WHERE id = ?", [id]
        )
        return rows[0] || null
    },

    getReviewByUserAndTour: async (userId, tourId) => {
        const [rows] = await dbconnect.execute(
            "SELECT * FROM reviews WHERE user_id = ? AND tour_id = ?",
            [userId, tourId]
        )
        return rows[0] || null
    },

    deleteReview: async (id) => {
        const [result] = await dbconnect.execute(
            "DELETE FROM reviews WHERE id = ?", [id]
        )
        return result
    },

    getTourAverageRating: async (tourId) => {
        const [rows] = await dbconnect.execute(
            `SELECT ROUND(AVG(rating), 1) as average_rating, COUNT(*) as total_reviews
             FROM reviews WHERE tour_id = ?`,
            [tourId]
        )
        return rows[0]
    },

    getAllReviewsAdmin: async () => {
        const [rows] = await dbconnect.execute(
            `SELECT r.id, r.rating, r.comment, r.created_at,
                    u.name, u.surname, u.email,
                    t.title AS tour_title, t.destination, t.slug AS tour_slug
             FROM reviews r
             JOIN users u ON r.user_id = u.id
             JOIN tours t ON r.tour_id = t.id
             ORDER BY r.created_at DESC`
        )
        return rows
    },
}