import dbconnect from '../config/db.connect.js'

export const authModel = {

    signUpWithVerification: async (userData, otpData) => {
        const connection = await dbconnect.getConnection()

        try {
            await connection.beginTransaction()

            const [userResult] = await connection.execute(
                "INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)",
                [userData.name, userData.surname, userData.email, userData.password]
            )

            const userId = userResult.insertId

            await connection.execute(
                "INSERT INTO verification_codes (user_id, code, expires_at) VALUES (?, ?, ?)",
                [userId, otpData.code, otpData.expires]
            );

            await connection.commit();

            return userId

        } catch (error) {
            await connection.rollback()
            throw error
        } finally {
            connection.release();
        }
    },

    findByEmail: async (email) => {
        const [rows] = await dbconnect.execute(
            "SELECT * FROM users WHERE email = ?", [email]
        )
        return rows[0]
    },

    deleteUserById: async (id) => {
        await dbconnect.execute("DELETE FROM users WHERE id = ?", [id])
    },

    saveRefreshToken: async (userId, token, expiresAt) => {
        const [result] = await dbconnect.execute(
            "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)", [userId, token, expiresAt]
        )
        return result
    },

    findRefreshToken: async (token) => {
        const [rows] = await dbconnect.execute(
            "SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > NOW()", [token]
        )
        return rows[0]
    },

    deleteRefreshToken: async (token) => {
        const [result] = await dbconnect.execute(
            "DELETE FROM refresh_tokens WHERE token = ?", [token]
        )
        return result
    },

    findById: async (id) => {
        const [rows] = await dbconnect.execute(
            "SELECT id, name, surname, email, role, is_verified FROM users WHERE id = ?", [id]
        )
        return rows[0]
    },

    findValidCode: async (email, code) => {
        const [rows] = await dbconnect.execute(
            `SELECT vc.user_id
            FROM verification_codes vc
            JOIN users u ON vc.user_id = u.id
            WHERE u.email = ? AND vc.code = ? AND vc.expires_at > NOW()`, [email, code]
        )
        return rows[0]
    },

    replaceVerificationCode: async (userId, otpData) => {
        await dbconnect.execute("DELETE FROM verification_codes WHERE user_id = ?", [userId])
        await dbconnect.execute(
            "INSERT INTO verification_codes (user_id, code, expires_at) VALUES (?, ?, ?)",
            [userId, otpData.code, otpData.expires]
        )
    },

    verifyUserAndClearCode: async (userId) => {

        await dbconnect.execute("UPDATE users SET is_verified = 1 WHERE id = ?", [userId])

        await dbconnect.execute("DELETE FROM verification_codes WHERE user_id = ?", [userId])
    },

    savePasswordResetCode: async (userId, hashedCode, expiresAt) => {
        const [result] = await dbconnect.execute(
            "INSERT INTO password_reset_codes (user_id, code, expires_at) VALUES (?, ?, ?)",
            [userId, hashedCode, expiresAt]
        )
        return result
    },

    findValidResetCode: async (hashedCode) => {
        const [rows] = await dbconnect.execute(
            `SELECT * FROM password_reset_codes 
             WHERE code = ? AND used = FALSE AND expires_at > NOW() 
             LIMIT 1`,
            [hashedCode]
        );
        return rows[0];
    },

    findValidResetCodeForUser: async (hashedCode, userId) => {
        const [rows] = await dbconnect.execute(
            `SELECT * FROM password_reset_codes
             WHERE user_id = ? AND code = ? AND used = FALSE AND expires_at > NOW()
             LIMIT 1`,
            [userId, hashedCode]
        )
        return rows[0]
    },

    deleteUnusedResetCodesForUser: async (userId) => {
        await dbconnect.execute(
            `DELETE FROM password_reset_codes WHERE user_id = ? AND used = FALSE`,
            [userId]
        )
    },

    markResetCodeUsed: async (codeId) => {
        await dbconnect.execute(
            `UPDATE password_reset_codes SET used = TRUE WHERE id = ?`,
            [codeId]
        );
    },

    updateUserPassword: async (userId, hashedPassword) => {
        await dbconnect.execute(
            `UPDATE users SET password = ? WHERE id = ?`,
            [hashedPassword, userId]
        );
    },

    updateProfile: async (userId, { name, surname }) => {
        await dbconnect.execute(
            `UPDATE users SET name = ?, surname = ? WHERE id = ?`,
            [name, surname, userId]
        )
    },

    findPasswordById: async (id) => {
        const [rows] = await dbconnect.execute(
            "SELECT password FROM users WHERE id = ?",
            [id]
        )
        return rows[0]?.password
    },

    deleteAllRefreshTokensForUser: async (userId) => {
        await dbconnect.execute(
            `DELETE FROM refresh_tokens WHERE user_id = ?`,
            [userId]
        );
    }
}