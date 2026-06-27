import { Router } from "express";
import { body } from "express-validator";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getAnalytics, // NEW
} from "../controllers/task.controller.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();
router.use(protect);

router.get("/", getTasks);
router.get("/analytics", getAnalytics); // NEW
router.post(
  "/",
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("board").notEmpty().withMessage("Board is required"),
    body("status").optional().isIn(["todo", "in-progress", "done"]),
    body("priority").optional().isIn(["low", "med", "high"]),
  ],
  validate,
  createTask
);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;