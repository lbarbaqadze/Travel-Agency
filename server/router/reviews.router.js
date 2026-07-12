import express from 'express'
import { reviewsController } from '../controllers/reviews.controller.js'
import { validate } from '../middlewares/validate.js'
import { createReviewSchema } from '../validation/reviews.validator.js'
import { protect, restrictTo } from '../middlewares/auth.middleware.js'

const reviewsRouter = express.Router()

reviewsRouter.get("/tour/:tourId", reviewsController.getReviewsForTour)

reviewsRouter.get("/admin/all", protect, restrictTo('admin'), reviewsController.getAllReviewsAdmin)

reviewsRouter.use(protect)

reviewsRouter.post("/", validate(createReviewSchema), reviewsController.createOrUpdateReview)
reviewsRouter.delete("/:id", reviewsController.deleteReview)

export default reviewsRouter