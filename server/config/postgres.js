import dotenv from "dotenv";
dotenv.config();
import pkg from "pg";
const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool
  .connect()
  .then(() => console.log("✅ Neon PostgreSQL connected"))
  .catch((err) =>
    console.error("❌ PostgreSQL connection error:", err.message),
  );

export default pool;
