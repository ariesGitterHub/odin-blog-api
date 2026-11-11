// *** Environment variable safety checks

// dotenv is loaded in bootstrap.js before app.js is required.

const requiredEnvVars = [
  "DATABASE_URL",
  // "SESSION_SECRET", // using JWT not server-side sessions
  "JWT_SECRET",
  "NODE_ENV",
];

for (const variable of requiredEnvVars) {
  if (!process.env[variable]) {
    throw new Error(`${variable} is required`);
  }
}

// *** Imports

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");

// *** Create Express app

const app = express();

const {
  csrfProtection,
  csrfErrorHandler,
} = require("./middleware/csrf.middleware.js");

// *** Proxy configuration

// Required when deployed behind Render's proxy.
// This also becomes relevant to secure cookies in production.
app.set("trust proxy", 1);

// *** Body parsing

// Parse incoming JSON request bodies.
// Example:
// {
//   "title": "My Blog Post",
//   "content": "Hello world"
// }

// Enable parsing cookies and JSON body
app.use(cookieParser());
app.use(express.json());

// Configure CORS to allow credentials
const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = isProduction
  ? [process.env.BLOG_READER_URL, process.env.BLOG_WRITER_URL]
  : ["http://localhost:5183", "http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"], // Must allow your CSRF header
  }),
);

// *** Security headers
app.use(helmet());

// *** CSRF protection
app.use(csrfProtection);

// *** Routes
// Authentication routes
const authRoutes = require("./routes/auth.routes.js");

// Blog post routes
const postRoutes = require("./routes/post.routes.js");

// Comment routes
const commentRoutes = require("./routes/comment.routes.js");

// User routes
const userRoutes = require("./routes/user.routes.js");

// Admin routes
const adminRoutes = require("./routes/admin.routes.js");

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/post", commentRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// *** API root / health check (API root endpoint)

app.get("/", (req, res) => {
  res.json({
    message: "Bloggie API",
  });
});

// *** CSRF error handler
app.use(csrfErrorHandler);

// *** 404 handler

// If no route matched the request, create a 404 error
// and pass it to the central error handler.
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// *** Central error handler

app.use(require("./middleware/error.middleware.js"));

// *** Export app

// bootstrap.js is responsible for starting the server.
// app.js is responsible for configuring and exporting the app.
module.exports = app;
