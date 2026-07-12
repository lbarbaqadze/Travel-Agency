import Joi from 'joi'

export const updateUserRoleSchema = Joi.object({
    role: Joi.string().valid('user', 'admin').required()
        .messages({
            'any.only': 'role must be either "user" or "admin"',
            'any.required': 'role is required'
        })
})