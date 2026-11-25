import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be set in backend/.env and contain at least 32 characters.");
}

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://127.0.0.1:5500"
}));
app.use(express.json({ limit: "20kb" }));
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, limit: 200 }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "BlogSpace API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

app.use((_req, res) => res.status(404).json({ message: "Route not found." }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error." });
});

app.listen(port, () => {
  console.log(`BlogSpace API running at http://localhost:${port}`);
});
