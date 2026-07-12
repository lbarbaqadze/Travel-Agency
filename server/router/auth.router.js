import express from 'express'
import { authController } from '../controllers/auth.controller.js'
import { validate } from '../middlewares/validate.js'
import { signInSchema, signUpSchema,
    forgotPasswordSchema, resetPasswordSchema, verifyEmailSchema,
    resendVerificationSchema, updateProfileSchema, changePasswordSchema
 } from '../validation/auth.validator.js'
import { otpLimiter, signInLimiter, signUpLimiter,
    forgotPasswordLimiter, resetPasswordLimiter
 } from '../middlewares/rateLimiter.middleware.js'
import { protect } from '../middlewares/auth.middleware.js'

const authRouter = express.Router()

authRouter.post('/sign-up', signUpLimiter, validate(signUpSchema), authController.signUp)
authRouter.post('/sign-in', signInLimiter, validate(signInSchema), authController.signIn)
authRouter.post('/refresh-token', authController.refresh)
authRouter.post('/log-out', authController.logOut)
authRouter.post('/verify-email', otpLimiter, validate(verifyEmailSchema), authController.verifyEmail)
authRouter.post('/resend-verification', otpLimiter, validate(resendVerificationSchema), authController.resendVerificationCode)
authRouter.post('/forgot-password', forgotPasswordLimiter, validate(forgotPasswordSchema), authController.forgotPassword)
authRouter.post('/reset-password', resetPasswordLimiter, validate(resetPasswordSchema), authController.resetPassword)

authRouter.get('/me', protect, (req, res) => {
    res.status(200).json({
        status: "success",
        data: { user: req.user }
    })
})

authRouter.patch('/me', protect, validate(updateProfileSchema), authController.updateProfile)
authRouter.post('/change-password/code', protect, otpLimiter, authController.requestChangePasswordCode)
authRouter.patch('/change-password', protect, validate(changePasswordSchema), authController.changePassword)

export default authRouter;