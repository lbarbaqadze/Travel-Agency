import Joi from 'joi'

export const signUpSchema = Joi.object({
    name: Joi.string().trim().min(2).max(12).required().messages({
        'string.empty': 'the name field must not be empty',
        'any.required': 'the name field is required',
        'string.min': 'the name field must contain at least 2 characters',
        'string.max': 'the name must contain a maximum of 12 characters'
    }),

    surname: Joi.string().trim().min(2).max(30).required().messages({
        'string.empty': 'the surname field must not be empty',
        'any.required': 'the surname field is required',
        'string.min': 'the surname field must contain at least 2 characters',
        'string.max': 'the surname must contain a maximum of 30 characters'
    }),
    email: Joi.string().trim().email().required().messages({
        'string.empty': 'the email field must not be empty',
        'any.required': 'the email field is required',
    }),
    password: Joi.string().trim().min(8).max(64).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/).required().messages({
        'string.empty': 'the password field must not be empty',
        'any.required': 'the password field is required',
        'string.min': 'the password must contain at least 8 characters',
        'string.max': 'the password must contain a maximum of 64 characters',
        'string.pattern.base': 'password must contain uppercase, lowercase, number and special character'
    })
})

export const signInSchema = Joi.object({
    email: Joi.string().trim().email().required().messages({
        'string.empty': 'the email field must not be empty',
        'any.required': 'the email field is required',
        'string.email': 'please enter a valid email address'
    }),

    password: Joi.string().trim().required().messages({
        'string.empty': 'the password field must not be empty',
        'any.required': 'the password field is required'
    })
});

export const verifyEmailSchema = Joi.object({
    email: Joi.string().trim().email().required().messages({
        'string.empty': 'the email field must not be empty',
        'any.required': 'the email field is required',
        'string.email': 'please enter a valid email address'
    }),

    code: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
        'string.empty': 'the code field must not be empty',
        'string.length': 'the verification code must be exactly 6 digits',
        'string.pattern.base': 'the verification code must contain only numbers',
        'any.required': 'the code field is required'
    })
});

export const resendVerificationSchema = Joi.object({
    email: Joi.string().trim().email().required().messages({
        'string.empty': 'the email field must not be empty',
        'any.required': 'the email field is required',
        'string.email': 'please enter a valid email address'
    }),
});

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().trim().email().required().messages({
        'string.empty': 'the email field must not be empty',
        'any.required': 'the email field is required',
        'string.email': 'please enter a valid email address'
    }),
});

export const resetPasswordSchema = Joi.object({    
    code: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
        'string.empty': 'the code field must not be empty',
        'string.length': 'the verification code must be exactly 6 digits',
        'string.pattern.base': 'the verification code must contain only numbers',
        'any.required': 'the code field is required'
    }),

    newPassword: Joi.string().trim().min(8).max(64).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/).required().messages({
        'string.empty': 'the password field must not be empty',
        'any.required': 'the password field is required',
        'string.min': 'the password must contain at least 8 characters',
        'string.max': 'the password must contain a maximum of 64 characters',
        'string.pattern.base': 'password must contain uppercase, lowercase, number and special character'
    })
});

export const updateProfileSchema = Joi.object({
    name: Joi.string().trim().min(2).max(12).required().messages({
        'string.empty': 'the name field must not be empty',
        'any.required': 'the name field is required',
        'string.min': 'the name field must contain at least 2 characters',
        'string.max': 'the name must contain a maximum of 12 characters'
    }),
    surname: Joi.string().trim().min(2).max(30).required().messages({
        'string.empty': 'the surname field must not be empty',
        'any.required': 'the surname field is required',
        'string.min': 'the surname field must contain at least 2 characters',
        'string.max': 'the surname must contain a maximum of 30 characters'
    }),
})

const passwordField = Joi.string().trim().min(8).max(64).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/).required().messages({
    'string.empty': 'the password field must not be empty',
    'any.required': 'the password field is required',
    'string.min': 'the password must contain at least 8 characters',
    'string.max': 'the password must contain a maximum of 64 characters',
    'string.pattern.base': 'password must contain uppercase, lowercase, number and special character'
})

export const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().trim().required().messages({
        'string.empty': 'the current password field must not be empty',
        'any.required': 'the current password field is required',
    }),
    newPassword: passwordField,
    code: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
        'string.empty': 'the verification code field must not be empty',
        'string.length': 'the verification code must be exactly 6 digits',
        'string.pattern.base': 'the verification code must contain only numbers',
        'any.required': 'the verification code field is required',
    }),
})