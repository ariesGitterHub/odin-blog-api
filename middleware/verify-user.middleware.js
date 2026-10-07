//  Reminder - any controller that needs it already has the authenticated user's JWT payload available as req.user!!! And req.user.userId, is that is used...

// This middleware helps out everywhere else so that nothing else needs to know anything about cookies, JWT verification, or JWT_SECRET.

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
