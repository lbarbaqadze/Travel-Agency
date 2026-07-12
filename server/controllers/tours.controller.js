import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import { toursModel } from "../models/tours.model.js";
import { deleteTourCloudinaryAssets } from "../utils/cloudinary.js";

export const toursController = {

    getAllTours: catchAsync(async (req, res, next) => {
        const { category, destination, minPrice, maxPrice, page, limit } = req.query

        const result = await toursModel.findAllTours({
            category,
            destination,
            minPrice,
            maxPrice,
            page,
            limit,
        })

        res.status(200).json({
            status: "success",
            results: result.tours.length,
            pagination: result.pagination,
            data: { tours: result.tours }
        })
    }),

    getAllToursAdmin: catchAsync(async (req, res, next) => {
        const { page, limit } = req.query
        const result = await toursModel.findAllToursAdmin({ page, limit })

        res.status(200).json({
            status: "success",
            results: result.tours.length,
            pagination: result.pagination,
            data: { tours: result.tours }
        })
    }),

    getTourById: catchAsync(async (req, res, next) => {
        const { id } = req.params
        if (!id || isNaN(id)) {
            return next(new AppError("Wrong id format", 400))
        }

        const tour = await toursModel.findTourByIdWithImages(id)
        if (!tour) {
            return next(new AppError("Tour with this id does not exist", 404))
        }

        res.status(200).json({
            status: "success",
            data: { tour }
        })
    }),

    getTourBySlug: catchAsync(async (req, res, next) => {
        const { slug } = req.params
        const tour = await toursModel.findTourBySlug(slug)
        if (!tour) {
            return next(new AppError("Tour with this slug does not exist", 404))
        }
        res.status(200).json({
            status: "success",
            data: { tour }
        })
    }),

    createTour: catchAsync(async (req, res, next) => {
        const { title, images } = req.body
        const existingTour = await toursModel.findTourByTitle(title)
        if (existingTour) {
            return next(new AppError("Tour already exist", 409))
        }
        const result = await toursModel.addTour(req.body)
        const newTourId = result.insertId
        if (images && Array.isArray(images) && images.length > 0) {
            await toursModel.addTourImages(newTourId, images);
        }
        res.status(201).json({
            status: "success",
            message: "Tour created successfully",
            data: { tourId: result.insertId }
        })
    }),

    updateTour: catchAsync(async (req, res, next) => {
        const { id } = req.params
        if (!id || isNaN(id)) {
            return next(new AppError("Wrong id format", 400))
        }

        const existing = await toursModel.getTourById(id)
        if (!existing) {
            return next(new AppError("Tour with this id does not exist", 404))
        }

        const { images, isActive, ...fields } = req.body
        const merged = {
            title: fields.title ?? existing.title,
            slug: fields.slug ?? existing.slug,
            description: fields.description ?? existing.description,
            destination: fields.destination ?? existing.destination,
            price: fields.price ?? existing.price,
            durationDays: fields.durationDays ?? existing.duration_days,
            maxGuests: fields.maxGuests ?? existing.max_guests,
            startDate: fields.startDate ?? existing.start_date,
            endDate: fields.endDate ?? existing.end_date,
            category: fields.category ?? existing.category,
            isActive: isActive !== undefined ? isActive : Boolean(existing.is_active),
        }

        const result = await toursModel.updateTourById(id, merged)
        if (result.affectedRows === 0) {
            return next(new AppError("Tour with this id does not exist", 404))
        }

        if (images && Array.isArray(images)) {
            await toursModel.replaceTourImages(id, images)
        }

        res.status(200).json({
            status: "success",
            message: "Tour updated successfully"
        })
    }),

    deleteTour: catchAsync(async (req, res, next) => {
        const { id } = req.params
        if (!id || isNaN(id)) {
            return next(new AppError("Wrong id format", 400))
        }

        const tour = await toursModel.findTourByIdWithImages(id)
        if (!tour) {
            return next(new AppError("Tour with this id does not exist", 404))
        }

        const publicIds = tour.images.map((img) => img.public_id).filter(Boolean)
        await deleteTourCloudinaryAssets(tour.slug, publicIds)

        const result = await toursModel.deleteTour(id)
        if (result.affectedRows === 0) {
            return next(new AppError("Tour with this id does not exist", 404))
        }
        res.status(200).json({
            status: "success",
            message: "Tour deleted successfully"
        })
    }),
}