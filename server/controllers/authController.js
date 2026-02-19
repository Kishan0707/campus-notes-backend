import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/postgres.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const allowedRoles = ["student", "teacher", "admin"];
    const userRole = allowedRoles.includes(role) ? role : "student";

    const existing = await pool.query("SELECT id FROM users WHERE email=$1", [
      email,
    ]);
    if (existing.rows.length) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name,email,password,role)
       VALUES ($1,$2,$3,$4)
       RETURNING id,name,email,role`,
      [name, email, hashedPassword, userRole],
    );

    res.status(201).json({
      message: "User registered",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Register failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE lower(email)=lower($1) LIMIT 1",
      [email],
    );
    const hashed = await bcrypt.hash("12345", 10);
    console.log("====================================");
    console.log(hashed);
    console.log("====================================");
    if (!result.rows.length) {
      console.warn(`Login failed — user not found for email=${email}`);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];
    console.log(`Login attempt for email=${email}, role=${user.role}`);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.warn(`Login failed — password mismatch for email=${email}`);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set");
      return res
        .status(500)
        .json({ error: "Server misconfiguration: JWT_SECRET not set" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};
