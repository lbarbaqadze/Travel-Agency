import Joi from 'joi'

export const createReviewSchema = Joi.object({
    tourId: Joi.number().integer().positive().required()
        .messages({
            'number.base': 'tourId must be a number',
            'number.integer': 'tourId must be an integer',
            'number.positive': 'tourId must be a positive number',
            'any.required': 'tourId is required'
        }),
    rating: Joi.number().integer().min(1).max(5).required()
        .messages({
            'number.base': 'rating must be a number',
            'number.integer': 'rating must be an integer',
            'number.min': 'rating must be at least 1',
            'number.max': 'rating must be at most 5',
            'any.required': 'rating is required'
        }),
    comment: Joi.string().max(1000).allow('', null).optional()
})