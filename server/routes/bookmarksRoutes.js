import express from "express";
import pool from "../config/postgres.js";

const router = express.Router();

/* ========= GET BOOKMARKS ========= */
router.get("/:userId", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.id, b.note_id, n.title, n.file_url
       FROM bookmarks b
       JOIN notes n ON b.note_id = n.id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [req.params.userId],
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ========= COUNT ========= */
router.get("/count/:userId", async (req, res) => {
  const result = await pool.query(
    "SELECT COUNT(*)::int AS count FROM bookmarks WHERE user_id=$1",
    [req.params.userId],
  );
  res.json({ count: result.rows[0].count });
});

/* ========= TOGGLE ========= */
router.post("/toggle", async (req, res) => {
  const { userId, noteId } = req.body;

  const check = await pool.query(
    "SELECT id FROM bookmarks WHERE user_id=$1 AND note_id=$2",
    [userId, noteId],
  );

  if (check.rows.length) {
    await pool.query("DELETE FROM bookmarks WHERE user_id=$1 AND note_id=$2", [
      userId,
      noteId,
    ]);
    return res.json({ message: "Bookmark removed" });
  }

  await pool.query("INSERT INTO bookmarks (user_id, note_id) VALUES ($1,$2)", [
    userId,
    noteId,
  ]);
  res.json({ message: "Bookmark added" });
});

export default router;
