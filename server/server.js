import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import notesRoutes from "./routes/notesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bookmarksRoutes from "./routes/bookmarksRoutes.js";
import pool from "./config/postgres.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/notes", notesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookmarks", bookmarksRoutes);
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Campus Notes API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
