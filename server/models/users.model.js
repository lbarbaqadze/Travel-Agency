
import dbconnect from '../config/db.connect.js'

export const usersModel = {

    getAllUsers: async () => {
        const [rows] = await dbconnect.execute(
            `SELECT id, name, surname, email, role, is_verified, created_at 
             FROM users 
             ORDER BY created_at DESC`
        )
        return rows
    },

    getUserById: async (id) => {
        const [rows] = await dbconnect.execute(
            `SELECT id, name, surname, email, role, is_verified, created_at 
             FROM users WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    updateUserRole: async (id, role) => {
        const [result] = await dbconnect.execute(
            "UPDATE users SET role = ? WHERE id = ?",
            [role, id]
        )
        return result
    },

    deleteUser: async (id) => {
        const [result] = await dbconnect.execute(
            "DELETE FROM users WHERE id = ?", [id]
        )
        return result
    },
}