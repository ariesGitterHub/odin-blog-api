function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "ADMIN") {

    return res.sendStatus(403);
  }
  next();
}

module.exports = { requireAdmin };
