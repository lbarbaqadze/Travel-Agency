import dbconnect from '../config/db.connect.js';

export const toursModel = {

    findAllTours: async (filters = {}) => {
        const { category, destination, minPrice, maxPrice } = filters;

        const page = Math.max(1, parseInt(filters.page, 10) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(filters.limit, 10) || 9));

        const conditions = ['t.is_active = TRUE'];
        const params = [];

        if (category) {
            conditions.push('t.category = ?');
            params.push(category);
        }

        if (destination) {
            conditions.push('t.destination LIKE ?');
            params.push(`%${destination}%`);
        }

        if (minPrice !== undefined && !isNaN(Number(minPrice))) {
            conditions.push('t.price >= ?');
            params.push(Number(minPrice));
        }

        if (maxPrice !== undefined && !isNaN(Number(maxPrice))) {
            conditions.push('t.price <= ?');
            params.push(Number(maxPrice));
        }

        const whereClause = conditions.join(' AND ');
        const offset = (page - 1) * limit;

        const [rows] = await dbconnect.query(`
            SELECT t.*, ti.url AS cover_image 
            FROM tours t
            LEFT JOIN tour_images ti ON t.id = ti.tour_id AND ti.is_cover = TRUE
            WHERE ${whereClause}
            ORDER BY t.created_at DESC
            LIMIT ? OFFSET ?
        `, [...params, limit, offset]);

        const [countResult] = await dbconnect.query(`
            SELECT COUNT(*) as total 
            FROM tours t
            WHERE ${whereClause}
        `, params);

        const total = countResult[0].total;

        return {
            tours: rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    },

    findAllToursAdmin: async (filters = {}) => {
        const page = Math.max(1, parseInt(filters.page, 10) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(filters.limit, 10) || 20));
        const offset = (page - 1) * limit;

        const [rows] = await dbconnect.query(`
            SELECT t.*, ti.url AS cover_image,
                   (SELECT COUNT(*) FROM tour_images WHERE tour_id = t.id) AS image_count
            FROM tours t
            LEFT JOIN tour_images ti ON t.id = ti.tour_id AND ti.is_cover = TRUE
            ORDER BY t.created_at DESC
            LIMIT ? OFFSET ?
        `, [limit, offset]);

        const [countResult] = await dbconnect.query(`SELECT COUNT(*) as total FROM tours`);
        const total = countResult[0].total;

        return {
            tours: rows,
            pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    },

    findTourBySlug: async (slug) => {
        const [rows] = await dbconnect.execute(`
            SELECT t.*, 
                   ti.id AS image_id, ti.url AS image_url, ti.public_id, ti.image_type, ti.is_cover
            FROM tours t
            LEFT JOIN tour_images ti ON t.id = ti.tour_id
            WHERE t.slug = ?
        `, [slug]);

        if (rows.length === 0) return null;

        const tour = {
            id: rows[0].id,
            title: rows[0].title,
            slug: rows[0].slug,
            description: rows[0].description,
            destination: rows[0].destination,
            price: rows[0].price,
            duration_days: rows[0].duration_days,
            max_guests: rows[0].max_guests,
            start_date: rows[0].start_date,
            end_date: rows[0].end_date,
            category: rows[0].category,
            is_active: rows[0].is_active,
            created_at: rows[0].created_at,
            images: []
        };

        rows.forEach(row => {
            if (row.image_id) {
                tour.images.push({
                    id: row.image_id,
                    url: row.image_url,
                    public_id: row.public_id,
                    image_type: row.image_type,
                    is_cover: row.is_cover
                });
            }
        });

        return tour;
    },

    findTourByIdWithImages: async (id) => {
        const [rows] = await dbconnect.execute(`
            SELECT t.*, 
                   ti.id AS image_id, ti.url AS image_url, ti.public_id, ti.image_type, ti.is_cover
            FROM tours t
            LEFT JOIN tour_images ti ON t.id = ti.tour_id
            WHERE t.id = ?
        `, [id]);

        if (rows.length === 0) return null;

        const tour = {
            id: rows[0].id,
            title: rows[0].title,
            slug: rows[0].slug,
            description: rows[0].description,
            destination: rows[0].destination,
            price: rows[0].price,
            duration_days: rows[0].duration_days,
            max_guests: rows[0].max_guests,
            start_date: rows[0].start_date,
            end_date: rows[0].end_date,
            category: rows[0].category,
            is_active: rows[0].is_active,
            created_at: rows[0].created_at,
            images: []
        };

        rows.forEach(row => {
            if (row.image_id) {
                tour.images.push({
                    id: row.image_id,
                    url: row.image_url,
                    public_id: row.public_id,
                    image_type: row.image_type,
                    is_cover: row.is_cover
                });
            }
        });

        return tour;
    },

    findTourByTitle: async (title) => {
        const [rows] = await dbconnect.execute(
            "SELECT * FROM tours WHERE title = ?", [title]
        );
        return rows[0] || null;
    },

    getTourById: async (id) => {
        const [rows] = await dbconnect.execute(
            "SELECT * FROM tours WHERE id = ?", [id]
        );
        return rows[0] || null;
    },

    addTour: async (tourData) => {
        const { title, slug, description, destination, price, durationDays, maxGuests, startDate, endDate, category, isActive } = tourData;
        const [result] = await dbconnect.execute(
            `INSERT INTO tours 
              (title, slug, description, destination, price, duration_days, max_guests, start_date, end_date, category, is_active) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, slug, description, destination, price, durationDays, maxGuests, startDate, endDate, category, isActive !== false ? 1 : 0]
        );
        return result;
    },

    deleteTour: async (id) => {
        const connection = await dbconnect.getConnection()
        try {
            await connection.beginTransaction()
            await connection.execute("DELETE FROM tour_images WHERE tour_id = ?", [id])
            const [result] = await connection.execute("DELETE FROM tours WHERE id = ?", [id])
            await connection.commit()
            return result
        } catch (error) {
            await connection.rollback()
            throw error
        } finally {
            connection.release()
        }
    },

    updateTourById: async (id, updateData) => {
        const { title, slug, description, destination, price, durationDays, maxGuests, startDate, endDate, category, isActive } = updateData;
        const [result] = await dbconnect.execute(
            `UPDATE tours SET 
                title = ?, slug = ?, description = ?, destination = ?, price = ?, 
                duration_days = ?, max_guests = ?, start_date = ?, end_date = ?, category = ?,
                is_active = ?
             WHERE id = ?`,
            [title, slug, description, destination, price, durationDays, maxGuests, startDate, endDate, category, isActive ?? true, id]
        );
        return result;
    },

    replaceTourImages: async (tourId, images) => {
        await dbconnect.execute("DELETE FROM tour_images WHERE tour_id = ?", [tourId]);
        if (images && images.length > 0) {
            await toursModel.addTourImages(tourId, images);
        }
    },

    addTourImages: async (tourId, images) => {
        const values = images.map(img => [
            tourId,
            img.url,
            img.public_id,
            img.image_type || 'destination',
            img.is_cover ? 1 : 0
        ])
        const [result] = await dbconnect.query(
            "INSERT INTO tour_images (tour_id, url, public_id, image_type, is_cover) VALUES ?",
            [values]
        );
        return result;
    }
};