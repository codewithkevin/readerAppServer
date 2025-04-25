import rateLimit from 'express-rate-limit';

const baseRateLimiter = ({ message }: { message?: string }) =>
    rateLimit({
        windowMs: 5 * 60 * 1000, // 5 minutes
        max: 15, // Limit each IP to 5 requests per `window` (10 minutes)
        message: message || 'Too many requests from this IP, please try again after 10 minutes.',
    });

export const standardRateLimiter = baseRateLimiter({});

export const otpRateLimiter = baseRateLimiter({
    message: 'Too many OTP requests from this IP, please try again after 10 minutes.',
});

export const verificationRateLimiter = baseRateLimiter({
    message: 'Too many verification requests from this IP, please try again after 10 minutes.',
});

export const loginRateLimiter = baseRateLimiter({
    message: 'Too many login attempts. Please try again after 10 minutes.',
});

export const signupRateLimiter = baseRateLimiter({
    message: 'Too many sign up attempts. Please try again after 10 minutes.',
});
