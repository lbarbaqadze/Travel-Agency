import AppError from "../utils/appError.js"
import catchAsync from "../utils/catchAsync.js"
import { reviewsModel } from "../models/reviews.model.js"
import { toursModel } from "../models/tours.model.js"

export const reviewsController = {

    createOrUpdateReview: catchAsync(async (req, res, next) => {
        const { tourId, rating, comment } = req.body
        const userId = req.user.id

        const tour = await toursModel.getTourById(tourId)
        if (!tour) {
            return next(new AppError("Tour not found", 404))
        }

        await reviewsModel.createOrUpdateReview(userId, tourId, rating, comment)

        res.status(200).json({
            status: "success",
            message: "Review submitted successfully"
        })
    }),

    getReviewsForTour: catchAsync(async (req, res, next) => {
        const { tourId } = req.params

        const tour = await toursModel.getTourById(tourId)
        if (!tour) {
            return next(new AppError("Tour not found", 404))
        }

        const reviews = await reviewsModel.getReviewsByTour(tourId)
        const ratingStats = await reviewsModel.getTourAverageRating(tourId)

        res.status(200).json({
            status: "success",
            results: reviews.length,
            data: {
                averageRating: ratingStats.average_rating || 0,
                totalReviews: ratingStats.total_reviews,
                reviews
            }
        })
    }),

    deleteReview: catchAsync(async (req, res, next) => {
        const { id } = req.params
        const userId = req.user.id

        const review = await reviewsModel.getReviewById(id)
        if (!review) {
            return next(new AppError("Review not found", 404))
        }

        if (review.user_id !== userId && req.user.role !== 'admin') {
            return next(new AppError("You are not authorized to delete this review", 403))
        }

        await reviewsModel.deleteReview(id)

        res.status(200).json({
            status: "success",
            message: "Review deleted successfully"
        })
    }),

    getAllReviewsAdmin: catchAsync(async (req, res, next) => {
        const reviews = await reviewsModel.getAllReviewsAdmin()

        res.status(200).json({
            status: "success",
            results: reviews.length,
            data: { reviews }
        })
    }),
}