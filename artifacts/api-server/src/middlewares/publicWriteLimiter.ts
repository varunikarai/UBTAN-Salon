import rateLimit from "express-rate-limit";

export const publicWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "too many requests, try again later" },
});
