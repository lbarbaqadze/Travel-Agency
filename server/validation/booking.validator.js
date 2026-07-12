import Joi from 'joi';

export const createBookingSchema = Joi.object({
    tourId: Joi.number().integer().positive().required()
        .messages({
            'number.base': 'tourId must be a number',
            'number.integer': 'tourId must be an integer',
            'number.positive': 'tourId must be a positive number',
            'any.required': 'tourId is required'
        }),

    guests: Joi.number().integer().positive().min(1).required()
        .messages({
            'number.base': 'guests must be a number',
            'number.integer': 'guests must be an integer',
            'number.positive': 'guests must be a positive number',
            'number.min': 'guests must be at least 1',
            'any.required': 'guests is required'
        })
});