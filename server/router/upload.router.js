import express from 'express'
import multer from 'multer'
import { protect, restrictTo } from '../middlewares/auth.middleware.js'
import { uploadController } from '../controllers/upload.controller.js'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only image files are allowed'))
  },
})

const uploadRouter = express.Router()

uploadRouter.post(
  '/image',
  protect,
  restrictTo('admin'),
  upload.single('file'),
  uploadController.uploadTourImage
)

export default uploadRouter
