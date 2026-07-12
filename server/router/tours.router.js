import express from 'express'
import { protect, restrictTo } from '../middlewares/auth.middleware.js'
import { toursController } from '../controllers/tours.controller.js'
import { validate } from '../middlewares/validate.js'
import { createTourSchema, updateTourSchema } from '../validation/tours.validator.js'

const tourRouter = express.Router()

tourRouter.get("/admin/all", protect, restrictTo('admin'), toursController.getAllToursAdmin)
tourRouter.get("/admin/:id", protect, restrictTo('admin'), toursController.getTourById)

tourRouter.get("/", toursController.getAllTours)
tourRouter.get("/:slug", toursController.getTourBySlug)

tourRouter.post("/", protect, restrictTo('admin'), validate(createTourSchema), toursController.createTour)
tourRouter.put("/:id", protect, restrictTo('admin'), validate(updateTourSchema), toursController.updateTour)
tourRouter.delete("/:id", protect, restrictTo('admin'), toursController.deleteTour)

export default tourRouter

