import pool from "../config/postgres.js";

export const getAllUsers = async (req, res) => {
  const result = await pool.query(
    "SELECT id,name,email,role FROM users ORDER BY id DESC",
  );
  res.json(result.rows);
};

export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const result = await pool.query(
    "UPDATE users SET role=$1 WHERE id=$2 RETURNING id,name,email,role",
    [role, id],
  );

  res.json(result.rows[0]);
};
