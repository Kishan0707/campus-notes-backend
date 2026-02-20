import express from "express";
import pool from "../config/postgres.js";
import bcrypt from "bcrypt";
import { verifyToken } from "../models/middlewares/authMiddleware.js";

const router = express.Router();

router.get("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ message: "Server error", err });
  }
});

router.put("/profile/:id", verifyToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    const { id } = req.params;
    await pool.query("UPDATE users SET name=$1, email=$2 WHERE id=$3", [
      name,
      email,
      id,
    ]);
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", err });
  }
});
router.put("/profile/change-password/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;
    const result = await pool.query(
      "SELECT password FROM users WHERE id = $1",
      [id],
    );
    const isMatch = await bcrypt.compare(oldPassword, result.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password=$1 WHERE id=$2", [
      hashedPassword,
      id,
    ]);
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", err });
  }
});

export default router;
