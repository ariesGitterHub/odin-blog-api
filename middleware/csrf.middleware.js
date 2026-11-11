const csurf = require("@dr.pogodin/csurf").default; // I was getting an error that csurf is not a function, using default to fix

const isProduction = process.env.NODE_ENV === "production";

const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: isProduction,
    // sameSite: "strict", // REMINDER - dev mode; prevents the browser from sending the cookie in cross-site requests
    // sameSite: "none", // REMINDER - allows cross-site requests, provided the cookie also has Secure, which requires HTTPS
    sameSite: isProduction ? "none" : "lax",
    maxAge: 60 * 60, // 1 hour, in seconds // NOTE - @dr.pogodin/csurf cookie maxAge is expressed in seconds
  },
});

// Custom error handler for CSRF errors
const csrfErrorHandler = (err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({
      message: "CSRF token invalid or missing",
    });
  }

  next(err);
};

module.exports = {
  csrfProtection,
  csrfErrorHandler,
};
