/**
 * Middleware to check if user has an active GitHub session token
 */
exports.requireAuth = (req, res, next) => {
  if (!req.session || !req.session.githubToken) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Please login with GitHub.',
    });
  }
  next();
};
