import Stripe from 'stripe'
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import { bookingModel } from "../models/booking.model.js";
import { paymentsModel } from '../models/payments.model.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const bookingController = {

    createBooking: catchAsync(async (req, res, next) => {
        const { tourId, guests } = req.body
        const userId = req.user.id

        const result = await bookingModel.createBookingWithCapacityCheck({ userId, tourId, guests })

        if (result.error === 'TOUR_NOT_FOUND') {
            return next(new AppError("Tour not found", 404))
        }

        if (result.error === 'NOT_ENOUGH_SPOTS') {
            return next(new AppError(`Sorry, there are only ${result.availableSpots} spots available!`, 400))
        }

        if (result.error === 'ALREADY_BOOKED') {
            return next(new AppError('You already have an active booking for this tour', 409))
        }

        res.status(201).json({
            status: "success",
            message: "Booking created successfully",
            data: {
                bookingId: result.bookingId,
                tourTitle: result.tourTitle,
                guests,
                totalPrice: result.totalPrice,
                status: 'pending'
            }
        })

    }),

    getBookings: catchAsync(async (req, res, next) => {
        const userId = req.user.id

        const bookings = await bookingModel.getBookingByUser(userId)

        res.status(200).json({
            status: 'success',
            results: bookings.length,
            data: { bookings }
        });
    }),

    getAllBookingsAdmin: catchAsync(async (req, res, next) => {
        const bookings = await bookingModel.getAllBookings()

        res.status(200).json({
            status: 'success',
            results: bookings.length,
            data: { bookings }
        });
    }),

    getCheckoutSession: catchAsync(async (req, res, next) => {
        const { bookingId } = req.params;
        const userId = req.user.id;

        const bookingData = await bookingModel.getBookingWithTourDetails(bookingId);

        if (!bookingData) {
            return next(new AppError('Booking not found with this ID', 404));
        }

        if (bookingData.user_id !== userId) {
            return next(new AppError('You are not authorized to pay for this booking', 403));
        }

        if (bookingData.status !== 'pending') {
            return next(new AppError('This booking is not available for payment', 400));
        }

        const existingPayment = await paymentsModel.findByBookingId(bookingId);
        if (existingPayment) {
            const session = await stripe.checkout.sessions.retrieve(existingPayment.stripe_session_id);
            if (session.status === 'open') {
                return res.status(200).json({ status: 'success', session_url: session.url });
            }
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: process.env.SUCCESS_URL,
            cancel_url: process.env.CANCEL_URL,
            customer_email: req.user.email,
            client_reference_id: bookingId,
            line_items: [{
                price_data: {
                    currency: 'usd',
                    unit_amount: Math.round(parseFloat(bookingData.total_price) * 100),
                    product_data: {
                        name: bookingData.title,
                        description: 'Secure tour booking payment',
                    },
                },
                quantity: 1,
            }],
        });

        if (existingPayment) {
            await paymentsModel.updateSessionId(bookingId, session.id);
        } else {
            await paymentsModel.createPayment({
                bookingId,
                stripeSessionId: session.id,
                amount: bookingData.total_price,
            });
        }

        res.status(200).json({
            status: 'success',
            session_url: session.url,
        });
    }),

    paymentSuccess: catchAsync(async (req, res, next) => {
        const { session_id } = req.query;

        if (!session_id) {
            return next(new AppError('Missing session ID', 400));
        }

        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status !== 'paid') {
            return next(new AppError('Payment not completed', 400));
        }

        const existingBooking = await paymentsModel.getBookingBySessionId(session_id);
        if (!existingBooking) {
            return next(new AppError('Booking not found for this payment session', 404));
        }

        if (existingBooking.user_id !== req.user.id) {
            return next(new AppError('You are not authorized to view this booking', 403));
        }

        if (existingBooking.status !== 'confirmed') {
            await paymentsModel.updatePaymentStatusBySessionId(session_id, 'paid', session.payment_intent);
        }

        res.status(200).json({
            status: 'success',
            data: {
                bookingId: existingBooking.id,
                tourTitle: existingBooking.tour_title,
                destination: existingBooking.destination,
                guests: existingBooking.guests,
                totalPrice: existingBooking.total_price,
            },
        });
    }),

    cancelBooking: catchAsync(async (req, res, next) => {
        const { bookingId } = req.params;

        const booking = await bookingModel.getBookingById(bookingId);
        if (!booking || booking.user_id !== req.user.id) {
            return next(new AppError('Booking not found', 404));
        }

        if (booking.status !== 'pending') {
            return next(new AppError('Only pending bookings can be cancelled', 400));
        }

        await bookingModel.updateBookingStatus(bookingId, 'cancelled');

        res.status(200).json({ status: 'success', message: 'Booking cancelled' });
    }),

    deleteBooking: catchAsync(async (req, res, next) => {
        const { bookingId } = req.params;

        const booking = await bookingModel.getBookingById(bookingId);
        if (!booking || booking.user_id !== req.user.id) {
            return next(new AppError('Booking not found', 404));
        }

        await bookingModel.deleteBooking(bookingId);

        res.status(200).json({ status: 'success', message: 'Booking removed' });
    }),

    handleWebHooks: catchAsync(async (req, res, next) => {
        const sig = req.headers['stripe-signature'];
        let event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;

            await paymentsModel.updatePaymentStatusBySessionId(
                session.id,
                'paid',
                session.payment_intent
            );
        }

        res.status(200).json({ received: true });
    })
}