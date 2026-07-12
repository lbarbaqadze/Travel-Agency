import AppError from "../utils/appError.js";

export const validate = (schema) => { 
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if(error){
            const errorMessage = error.details.map(el => el.message).join(', ')
            return next(new AppError(errorMessage, 400))
        }

        next()
    }
}