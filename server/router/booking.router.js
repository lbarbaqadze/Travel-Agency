import express from 'express'
import { bookingController } from '../controllers/booking.controller.js'
import { validate } from '../middlewares/validate.js'
import { createBookingSchema } from '../validation/booking.validator.js'
import { protect, restrictTo } from '../middlewares/auth.middleware.js'

const bookingRouter = express.Router()

bookingRouter.get("/admin/all", protect, restrictTo('admin'), bookingController.getAllBookingsAdmin)

bookingRouter.use(protect)

bookingRouter.post("/", validate(createBookingSchema), bookingController.createBooking)

bookingRouter.get("/", bookingController.getBookings)
bookingRouter.post("/checkout-session/:bookingId", bookingController.getCheckoutSession)
bookingRouter.get("/success", bookingController.paymentSuccess);

bookingRouter.patch("/:bookingId/cancel", bookingController.cancelBooking)
bookingRouter.delete("/:bookingId", bookingController.deleteBooking)

export default bookingRouter;