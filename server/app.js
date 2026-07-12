import express from "express"
import cookieParser from "cookie-parser"
import passport from "passport"
import bodyParser from "body-parser"
import cors from "cors"
import helmet from "helmet"

import "./config/passport.config.js"
import errorHandler from "./middlewares/errorHandler.js"
import authRouter from "./router/auth.router.js"
import tourRouter from "./router/tours.router.js"
import bookingRouter from "./router/booking.router.js"
import googleAuthRouter from "./router/google.auth.router.js"
import reviewsRouter from "./router/reviews.router.js"
import usersRouter from "./router/users.router.js"
import uploadRouter from "./router/upload.router.js"
import { bookingController } from "./controllers/booking.controller.js"

const app = express()

app.set("trust proxy", 1)

app.use(helmet())

app.post(
    "/api/bookings/webhook",
    bodyParser.raw({ type: "application/json" }),
    bookingController.handleWebHooks
)

app.use(express.json())
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
)
app.use(cookieParser())
app.use(passport.initialize())

app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok" })
})

app.use("/api/auth/google", googleAuthRouter)
app.use("/api/auth", authRouter)
app.use("/api/tours", tourRouter)
app.use("/api/upload", uploadRouter)
app.use("/api/bookings", bookingRouter)
app.use("/api/reviews", reviewsRouter)
app.use("/api/users", usersRouter)

app.use(errorHandler)

export default app
