import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"; // ✅ MISSING IMPORT FIX
import notesRoutes from "./routes/notesRoutes.js";
import bookmarksRoutes from "./routes/bookmarksRoutes.js";

const app = express();

// 🔹 Middlewares
app.use(cors());
app.use(express.json());

// 🔹 Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/bookmarks", bookmarksRoutes);

// 🔹 Static files
app.use("/uploads", express.static("uploads"));

// 🔹 Health check
app.get("/", (req, res) => {
  res.send("Campus Notes API is running");
});

export default app;
