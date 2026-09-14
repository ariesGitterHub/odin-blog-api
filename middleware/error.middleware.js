module.exports = (err, req, res, next) => {
  // Log the full error on the server.
  console.error(err);

  // Use the error's status if it is a valid HTTP error status.
  // Otherwise, default to 500.
  const status =
    Number.isInteger(err.status) && err.status >= 400 && err.status < 600
      ? err.status
      : 500;

  // Don't expose internal error details in production.
  const message =
    status === 500 && process.env.NODE_ENV === "production"
      ? "Something went wrong."
      : err.message || "An unexpected error occurred.";

  res.status(status).json({
    error: {
      status,
      message,
    },
  });
};
