import rateLimit from 'express-rate-limit';

// Create a limiter for cart items - limit each user to 5 requests per minute
export const cartItemLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 8, // limit each IP to 5 requests per windowMs
    message: {
        status: false,
        message: "Too many requests, please try again after a minute"
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // Store should be based on user ID instead of IP if available
    keyGenerator: (req) => {
        // If user is authenticated, use their ID
        if (req.user && req.user.user_id) {
            return req.user.user_id.toString();
        }
        // Fallback to IP address
        return req.ip;
    }
}); 