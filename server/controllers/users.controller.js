import AppError from "../utils/appError.js"
import catchAsync from "../utils/catchAsync.js"
import { usersModel } from "../models/users.model.js"

export const usersController = {

    getAllUsers: catchAsync(async (req, res, next) => {
        const users = await usersModel.getAllUsers()

        res.status(200).json({
            status: "success",
            results: users.length,
            data: { users }
        })
    }),

    getUserById: catchAsync(async (req, res, next) => {
        const { id } = req.params

        const user = await usersModel.getUserById(id)
        if (!user) {
            return next(new AppError("User not found", 404))
        }

        res.status(200).json({
            status: "success",
            data: { user }
        })
    }),

    updateUserRole: catchAsync(async (req, res, next) => {
        const { id } = req.params
        const { role } = req.body

        if (Number(id) === req.user.id && role !== 'admin') {
            return next(new AppError("You cannot remove your own admin role", 400))
        }

        const user = await usersModel.getUserById(id)
        if (!user) {
            return next(new AppError("User not found", 404))
        }

        await usersModel.updateUserRole(id, role)

        res.status(200).json({
            status: "success",
            message: `User role updated to ${role}`
        })
    }),

    deleteUser: catchAsync(async (req, res, next) => {
        const { id } = req.params

        if (Number(id) === req.user.id) {
            return next(new AppError("You cannot delete your own account", 400))
        }

        const user = await usersModel.getUserById(id)
        if (!user) {
            return next(new AppError("User not found", 404))
        }

        await usersModel.deleteUser(id)

        res.status(200).json({
            status: "success",
            message: "User deleted successfully"
        })
    }),
}