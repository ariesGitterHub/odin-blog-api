if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = require("./app");

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`👂 Listening on port ${PORT}`);
});

// Graceful shutdown (important for Render restarts)
// NoTE - The SIGTERM handling isn't specifically a Render hack. It's a generally useful pattern for a Node server running under a process manager/container platform, so it's worth including into this project.
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => process.exit(0));
});

server.on("error", (err) => {
  console.error("Server error:", err);
});
