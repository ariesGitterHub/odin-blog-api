// function requireAdmin(req, res, next) {
//   if (!req.user || req.user.role !== "ADMIN") {

//     return res.sendStatus(403);
//   }
//   next();
// }

function requireAdmin(req, res, next) {
  const adminRoleOnly = ["ADMIN"];

  if (!req.user || !adminRoleOnly.includes(req.user.role)) {
    // return res.sendStatus(403);
    return (
      res
        .status(403)
        // .json({ error: "Forbidden: Insufficient permissions" });
        .json({ message: "Forbidden: Insufficient permissions" })
    );
  }
  next();
}

// TODO - test below by making a WRITER role profile
// function requireWriter(req, res, next) {
//   // if (!req.user || req.user.role !== "ADMIN" || req.user.role !== "WRITER") {
//   if (!req.user || (req.user.role !== "ADMIN" && req.user.role !== "WRITER")) {
//     return res.sendStatus(403);
//   }
//   next();
// }

function requireWriter(req, res, next) {
  const allowedRoles = ["ADMIN", "WRITER"];

  if (!req.user || !allowedRoles.includes(req.user.role)) {
    // return res.sendStatus(403);
    return res
      .status(403)
      // .json({ error: "Forbidden: Insufficient permissions" });
      .json({ message: "Forbidden: Insufficient permissions" });
  }
  next();
}

module.exports = { requireAdmin, requireWriter };
