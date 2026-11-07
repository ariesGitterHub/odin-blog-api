const csurf = require("@dr.pogodin/csurf").default; // I was getting an error that csurf is not a function, using default to fix

const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60, // 1 hour
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
