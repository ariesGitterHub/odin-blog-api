// TODO - CORS omitted for now, will be needed

// *** Environment variable safety checks

// dotenv is loaded in bootstrap.js before app.js is required.

const requiredEnvVars = [
  "DATABASE_URL",
  // "SESSION_SECRET", // using JWT not server-side sessions
  "JWT_SECRET",
  "MMM_EMAIL",
  "MMM_PASSWORD",
  // "INVITE_CODE",
  // "STORAGE_PROVIDER",
  // "MAX_FILE_DOWNLOAD_KB",
  // "MAX_USER_STORAGE_MB",
  // "SUPABASE_URL",
  // "SUPABASE_SECRET_KEY",
  // "SUPABASE_STORAGE_BUCKET",
  "NODE_ENV",
];

for (const variable of requiredEnvVars) {
  if (!process.env[variable]) {
    throw new Error(`${variable} is required`);
  }
}

// *** Imports

const express = require("express");
const helmet = require("helmet");

// *** Create Express app

const app = express();

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
app.use(express.json());

// *** Security headers

app.use(helmet());

// *** Routes

// Authentication routes
const authRoutes = require("./routes/auth.routes.js");

// Blog post routes
const postRoutes = require("./routes/post.routes.js");

// Comment routes
const commentRoutes = require("./routes/comment.routes.js");

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// *** API root / health check (API root endpoint)

app.get("/", (req, res) => {
  res.json({
    message: "Bloggy API",
  });
});

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