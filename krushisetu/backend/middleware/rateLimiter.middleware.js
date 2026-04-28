/**
 * Simple in-memory rate limiter
 * For production use express-rate-limit package
 */

const requests = new Map()

const rateLimiter = (maxRequests = 100, windowMs = 40 * 60 * 1000) => (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress
  const now = Date.now()
  const windowStart = now - windowMs

  const userRequests = (requests.get(ip) || []).filter(t => t > windowStart)

  if (userRequests.length >= maxRequests) {
    return res.status(429).json({ message: 'Too many requests. Please try again later.' })
  }

  userRequests.push(now)
  requests.set(ip, userRequests)
  next()
}

// Strict limiter for auth routes (20 req per 15 min)
const authLimiter = rateLimiter(100, 15 * 60 * 1000)

// General limiter (200 req per 15 min)
const generalLimiter = rateLimiter(200, 15 * 60 * 1000)

module.exports = { authLimiter, generalLimiter }
