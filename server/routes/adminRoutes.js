import express from "express";
import authMiddleware from "../models/middlewares/authMiddleware.js";
import roleMiddleware from "../models/middlewares/roleMiddleware.js";
import { getAllUsers, updateUserRole } from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", authMiddleware, roleMiddleware("admin"), getAllUsers);
router.put(
  "/users/:id/role",
  authMiddleware,
  roleMiddleware("admin"),
  updateUserRole,
);

export default router;
