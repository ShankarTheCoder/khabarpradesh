const express = require("express");
const cors = require("cors");

const newsRoutes = require("./routes/news");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// Hosting platforms (Render, Railway, Docker, etc.) generally need an
// explicit host — set HOST=0.0.0.0 in their environment variables if ever
// required. Locally we deliberately do NOT force 0.0.0.0: on macOS/Windows,
// browsers often resolve "localhost" to the IPv6 loopback (::1) first, and
// binding strictly to the IPv4 0.0.0.0 address makes that connection fail.
// Leaving HOST unset lets Node bind dual-stack so "localhost" works either way.
const HOST = process.env.HOST || undefined;

// CORS_ORIGIN can be a comma-separated list of allowed origins in production,
// e.g. "https://khabarpradesh.com,https://www.khabarpradesh.com".
// Left unset (default) it allows any origin, which is fine since auth uses
// bearer tokens (not cookies), not credentialed CORS.
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : null;

app.use(
  cors(
    allowedOrigins
      ? {
          origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
              callback(null, true);
            } else {
              callback(new Error("CORS नीतिद्वारा अस्वीकृत origin."));
            }
          },
        }
      : {}
  )
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "khabarpradesh-backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "मार्ग फेला परेन (Route not found)." });
});

app.listen(PORT, HOST, () => {
  console.log(
    `खबर प्रदेश ब्याकइन्ड सर्भर चलिरहेको छ: http://${HOST || "localhost"}:${PORT}`
  );
});
