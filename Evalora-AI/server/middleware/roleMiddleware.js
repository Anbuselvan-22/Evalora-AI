const requireRole = (role) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated',
      code: 'NOT_AUTHENTICATED',
    });
  }

  if (req.user.role !== role) {
    return res.status(403).json({
      success: false,
      message: `This resource requires ${role} role`,
      code: 'FORBIDDEN',
    });
  }

  next();
};

export default requireRole;
