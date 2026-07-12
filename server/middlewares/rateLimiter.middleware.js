import rateLimit from 'express-rate-limit';

export const signUpLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: 'too many accounts created from this IP, try again later'
});

export const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: 'too many attempts, try again later' 
});

export const signInLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 10, 
    message: 'too many login attempts, try again later'
});

export const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'too many password reset requests, try again later'
});

export const resetPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'too many password reset attempts, try again later'
});