import jwt from 'jsonwebtoken'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import { authModel } from '../models/auth.model.js'

export const protect = catchAsync(async (req, res, next) => {

    const { accessToken } = req.cookies

    if(!accessToken){
        return next(new AppError("you are not authorized", 401))
    } 

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)

    const currentUser = await authModel.findById(decoded.userId)

    if(!currentUser){
        return next(new AppError("the user who owned this token does not exist", 401))
    } 

    if(!currentUser.is_verified){
        return next(new AppError("please, get verify", 403))
    }

    req.user = currentUser

    next()
})

export const restrictTo = (...allowedRoles) => {
    return (req, res, next) => {

        if (!allowedRoles.includes(req.user.role)) {
            return next(new AppError("You do not have permission to perform this action", 403));
        }
        
        next();
    };
};