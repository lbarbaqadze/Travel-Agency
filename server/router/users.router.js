import express from 'express'
import { usersController } from '../controllers/users.controller.js'
import { validate } from '../middlewares/validate.js'
import { updateUserRoleSchema } from '../validation/users.validator.js'
import { protect, restrictTo } from '../middlewares/auth.middleware.js'

const usersRouter = express.Router()

usersRouter.use(protect, restrictTo('admin'))

usersRouter.get("/", usersController.getAllUsers)
usersRouter.get("/:id", usersController.getUserById)
usersRouter.patch("/:id/role", validate(updateUserRoleSchema), usersController.updateUserRole)
usersRouter.delete("/:id", usersController.deleteUser)

export default usersRouter