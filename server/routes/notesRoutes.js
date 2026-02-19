import express from "express";
import multer from "multer";
import path from "path";
import pool from "../config/postgres.js";
import { checkRole } from "../models/middlewares/authMiddleware.js";

const router = express.Router();

/* ========= MULTER ========= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) =>
    file.mimetype === "application/pdf"
      ? cb(null, true)
      : cb(new Error("Only PDF files allowed")),
});

/* ========= UPLOAD NOTE ========= */
router.post(
  "/upload",
  upload.single("pdf"),
  checkRole(["admin", "teacher"]),
  async (req, res) => {
    try {
      const { title, subject_id, semester_id, uploaded_by } = req.body;

      const fileUrl = `/uploads/${req.file.filename}`;

      await pool.query(
        `INSERT INTO notes
       (title, file_url, subject_id, semester_id, uploaded_by)
       VALUES ($1,$2,$3,$4,$5)`,
        [title, fileUrl, subject_id, semester_id, uploaded_by],
      );

      res.status(201).json({ message: "PDF uploaded successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

/* ========= GET NOTES ========= */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT n.id, n.title, n.file_url,
             s.name AS subject,
             sem.name AS semester,
             u.name AS uploaded_by,
             n.created_at
      FROM notes n
      LEFT JOIN subjects s ON n.subject_id = s.id
      LEFT JOIN semesters sem ON n.semester_id = sem.id
      LEFT JOIN users u ON n.uploaded_by = u.id
      ORDER BY n.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
