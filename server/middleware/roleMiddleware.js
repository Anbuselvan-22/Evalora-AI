const authMiddleware = require('../middleware/authMiddleware.js')

const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(401).json({ message: 'Access denied. User role not found.' })
    }

    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' })
    }

    next()
  }
}

module.exports = roleMiddleware
