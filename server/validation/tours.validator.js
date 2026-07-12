import Joi from 'joi';

const imageSchema = Joi.object({
    url: Joi.string().uri().required(),
    public_id: Joi.string().required(),
    image_type: Joi.string().valid('destination', 'hotel').default('destination'),
    is_cover: Joi.boolean().default(false),
});

export const createTourSchema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    slug: Joi.string().pattern(/^[a-z0-9-]+$/).required()
        .messages({ 'string.pattern.base': 'slug must contain only lowercase letters, numbers and hyphens' }),
    description: Joi.string().min(10).required(),
    destination: Joi.string().min(2).max(150).required(),
    price: Joi.number().positive().precision(2).required(),
    durationDays: Joi.number().integer().positive().required(),
    maxGuests: Joi.number().integer().positive().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().greater(Joi.ref('startDate')).required()
        .messages({ 'date.greater': 'endDate must be after startDate' }),
    category: Joi.string().min(2).max(100).required(),
    isActive: Joi.boolean().default(true),
    images: Joi.array().items(imageSchema).min(1).optional(),
});

export const updateTourSchema = Joi.object({
    title: Joi.string().min(3).max(255),
    slug: Joi.string().pattern(/^[a-z0-9-]+$/)
        .messages({ 'string.pattern.base': 'slug must contain only lowercase letters, numbers and hyphens' }),
    description: Joi.string().min(10),
    destination: Joi.string().min(2).max(150),
    price: Joi.number().positive().precision(2),
    durationDays: Joi.number().integer().positive(),
    maxGuests: Joi.number().integer().positive(),
    startDate: Joi.date(),
    endDate: Joi.date().greater(Joi.ref('startDate')),
    category: Joi.string().min(2).max(100),
    isActive: Joi.boolean(),
    images: Joi.array().items(imageSchema).min(1).optional(),
}).min(1); 