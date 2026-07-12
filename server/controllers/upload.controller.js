import AppError from '../utils/appError.js'
import catchAsync from '../utils/catchAsync.js'
import { uploadImage } from '../utils/cloudinary.js'

export const uploadController = {
  uploadTourImage: catchAsync(async (req, res, next) => {
    if (!req.file) {
      return next(new AppError('No image file provided', 400))
    }

    const { slug, publicId } = req.body
    if (!slug) {
      return next(new AppError('Tour slug is required for upload', 400))
    }

    const result = await uploadImage(req.file.buffer, { slug, publicId: publicId || undefined })

    res.status(200).json({
      status: 'success',
      data: result,
    })
  }),
}
