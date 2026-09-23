const jwt = require("jsonwebtoken");

function verifyUser(req, res, next) {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.sendStatus(401);
  }

  // NOTE - this verifies the existing accessToken
  jwt.verify(token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = authData;
    next();
  });
}

module.exports = {
  verifyUser,
};
