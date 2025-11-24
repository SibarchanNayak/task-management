import express from "express";
import auth from "../middleware/auth.js";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

// Create Task (Protected)
router.post("/", auth, createTask);

// Get Tasks (pagination, sorting, filtering)
router.get("/", auth, getTasks);

// Get Single Task
router.get("/:id", auth, getTaskById);

// Update Task
router.put("/:id", auth, updateTask);

// Delete Task
router.delete("/:id", auth, deleteTask);

export default router;
