import bcrypt from 'bcrypt'
import AppError from "../utils/appError.js"
import catchAsync from "../utils/catchAsync.js"
import { authModel } from "../models/auth.model.js"
import jwt from 'jsonwebtoken'
import sendEmail from '../utils/sendEmail.js'
import { verificationEmail, passwordResetEmail } from '../utils/emailTemplates.js'
import crypto from 'crypto'
import ms from 'ms'
import { generateTokens, setTokenCookies, clearTokenCookies } from '../utils/generateToken.js'

export const authController = {

    signUp: catchAsync(async (req, res, next) => {
        const { name, surname, email, password } = req.body

        const existingUser = await authModel.findByEmail(email)
        if (existingUser) {
            return next(new AppError("user with this email already exist", 409))
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const otpCode = crypto.randomInt(100000, 999999).toString()
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000)

        const userId = await authModel.signUpWithVerification(
            { name, surname, email, password: hashedPassword },
            { code: otpCode, expires: otpExpires }
        )

        const emailContent = verificationEmail({ name, code: otpCode })

        try {
            await sendEmail({
                email,
                ...emailContent
            })
            res.status(201).json({
                status: "success",
                message: "registration completed successfully! verification code has been sent to your email",
                data: {
                    userId,
                    name,
                    surname,
                    email
                }
            })
        } catch (error) {
            await authModel.deleteUserById(userId)
            return next(new AppError("error occurred while sending the email", 500))
        }
    }),

    verifyEmail: catchAsync(async (req, res, next) => {
        const { email, code } = req.body

        const validCodeRow = await authModel.findValidCode(email, code)

        if (!validCodeRow) {
            return next(new AppError("verification code is wrong", 400))
        }

        await authModel.verifyUserAndClearCode(validCodeRow.user_id)

        res.status(200).json({
            status: "success",
            message: "success verification"
        })
    }),

    resendVerificationCode: catchAsync(async (req, res, next) => {
        const { email } = req.body

        const user = await authModel.findByEmail(email)

        if (!user || user.is_verified) {
            return res.status(200).json({
                status: "success",
                message: "if this email is registered and not verified, a new code has been sent"
            })
        }

        const otpCode = crypto.randomInt(100000, 999999).toString()
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000)

        await authModel.replaceVerificationCode(user.id, { code: otpCode, expires: otpExpires })

        const emailContent = verificationEmail({ name: user.name, code: otpCode })

        try {
            await sendEmail({
                email: user.email,
                ...emailContent
            })
            res.status(200).json({
                status: "success",
                message: "a new verification code has been sent to your email"
            })
        } catch (error) {
            return next(new AppError("error occurred while sending the email", 500))
        }
    }),

    signIn: catchAsync(async (req, res, next) => {
        const { email, password } = req.body

        const user = await authModel.findByEmail(email)

        if (!user) {
            return next(new AppError("email or password is incorrect", 401))
        }

        if (user.is_verified === 0) {
            return next(new AppError("please verify your email first", 403))
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            return next(new AppError("email or password is incorrect", 401))
        }

        const { accessToken, refreshToken } = generateTokens(user.id);

        const refreshTokenMaxAge = ms(process.env.JWT_REFRESH_EXPIRES)

        const expiresAt = new Date(Date.now() + refreshTokenMaxAge)

        await authModel.saveRefreshToken(user.id, refreshToken, expiresAt)

        setTokenCookies(res, accessToken, refreshToken);


        res.status(200).json({
            status: "success",
            message: "sign in is successfully",
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    surname: user.surname,
                    email: user.email,
                    role: user.role,
                    is_verified: user.is_verified,
                },
            },
        })

    }),

    refresh: catchAsync(async (req, res, next) => {

        const { refreshToken } = req.cookies

        if (!refreshToken) {
            return next(new AppError("refresh token missing, please sign in again", 401))
        }

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (err) {
            clearTokenCookies(res);
            return next(new AppError("your session has expired sign in again", 401));
        }

        const tokenInDb = await authModel.findRefreshToken(refreshToken)

        if (!tokenInDb) {
            clearTokenCookies(res)
            return next(new AppError("invalid or expired refresh token", 401))
        }

        await authModel.deleteRefreshToken(refreshToken)

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);

        const refreshTokenAge = ms(process.env.JWT_REFRESH_EXPIRES)
        const expiresAt = new Date(Date.now() + refreshTokenAge)
        await authModel.saveRefreshToken(decoded.userId, newRefreshToken, expiresAt)

        setTokenCookies(res, newAccessToken, newRefreshToken);


        res.status(200).json({
            status: "success",
            message: "token refreshed successfully"
        })

    }),

    logOut: catchAsync(async (req, res, next) => {

        const { refreshToken } = req.cookies

        if (refreshToken) {
            await authModel.deleteRefreshToken(refreshToken)
        }

        clearTokenCookies(res);

        res.status(200).json({
            status: "success",
            message: "logout is successfully"
        })

    }),

    forgotPassword: catchAsync(async (req, res, next) => {
        const { email } = req.body;
        const user = await authModel.findByEmail(email);

        const genericMessage = {
            status: "success",
            message: "if this email exists in our system, a password reset code has been sent"
        };

        if (!user) {
            return res.status(200).json(genericMessage);
        }

        const otpCode = crypto.randomInt(100000, 999999).toString();

        const hashedCode = crypto.createHash('sha256').update(otpCode).digest('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); 

        await authModel.savePasswordResetCode(user.id, hashedCode, expiresAt);

        const emailContent = passwordResetEmail({ name: user.name, code: otpCode })

        try {
            await sendEmail({
                email: user.email,
                ...emailContent
            });
            res.status(200).json(genericMessage);
        } catch (error) {
            return next(new AppError("error occurred while sending the email", 500));
        }
    }),

    resetPassword: catchAsync(async (req, res, next) => {
        const { code, newPassword } = req.body;        

        const hashedCode = crypto.createHash('sha256').update(code).digest('hex');
        const resetRow = await authModel.findValidResetCode(hashedCode);

        if (!resetRow) {
            return next(new AppError("invalid code or it has expired", 400));
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await authModel.updateUserPassword(resetRow.user_id, hashedPassword);

        await authModel.markResetCodeUsed(resetRow.id);
        await authModel.deleteAllRefreshTokensForUser(resetRow.user_id);

        res.status(200).json({
            status: "success",
            message: "password has been reset successfully, please sign in again"
        });
    }),

    updateProfile: catchAsync(async (req, res, next) => {
        const { name, surname } = req.body

        await authModel.updateProfile(req.user.id, { name, surname })

        const user = await authModel.findById(req.user.id)

        res.status(200).json({
            status: 'success',
            message: 'profile updated successfully',
            data: { user },
        })
    }),

    changePassword: catchAsync(async (req, res, next) => {
        const { currentPassword, newPassword, code } = req.body

        const hashedCode = crypto.createHash('sha256').update(code).digest('hex')
        const resetRow = await authModel.findValidResetCodeForUser(hashedCode, req.user.id)

        if (!resetRow) {
            return next(new AppError('invalid or expired verification code', 400))
        }

        const storedHash = await authModel.findPasswordById(req.user.id)
        const isCorrect = await bcrypt.compare(currentPassword, storedHash)

        if (!isCorrect) {
            return next(new AppError('current password is incorrect', 401))
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await authModel.updateUserPassword(req.user.id, hashedPassword)
        await authModel.markResetCodeUsed(resetRow.id)
        await authModel.deleteAllRefreshTokensForUser(req.user.id)
        clearTokenCookies(res)

        res.status(200).json({
            status: 'success',
            message: 'password changed successfully, please sign in again',
        })
    }),

    requestChangePasswordCode: catchAsync(async (req, res, next) => {
        const user = await authModel.findById(req.user.id)

        if (!user) {
            return next(new AppError('user not found', 404))
        }

        const otpCode = crypto.randomInt(100000, 999999).toString()
        const hashedCode = crypto.createHash('sha256').update(otpCode).digest('hex')
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

        await authModel.deleteUnusedResetCodesForUser(req.user.id)
        await authModel.savePasswordResetCode(req.user.id, hashedCode, expiresAt)

        const emailContent = passwordResetEmail({ name: user.name, code: otpCode })

        try {
            await sendEmail({
                email: user.email,
                ...emailContent,
            })
            res.status(200).json({
                status: 'success',
                message: 'verification code sent to your email',
            })
        } catch (error) {
            return next(new AppError('error occurred while sending the email', 500))
        }
    }),
}