import express from "express";
import authMiddleware from "../models/middlewares/authMiddleware.js";
import roleMiddleware from "../models/middlewares/roleMiddleware.js";
import uploadNotes from "../models/middlewares/uploads.js";
import pool from "../config/postgres.js";

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  roleMiddleware("admin", "teacher"),
  uploadNotes,
  async (req, res) => {
    const { title, subject_id, semester_id } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;

    await pool.query(
      `INSERT INTO notes (title,file_url,subject_id,semester_id,uploaded_by)
       VALUES ($1,$2,$3,$4,$5)`,
      [title, fileUrl, subject_id, semester_id, req.user.id],
    );

    res.json({ message: "Note uploaded" });
  },
);

router.get("/", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM notes ORDER BY created_at DESC",
  );
  res.json(result.rows);
});

export default router;
