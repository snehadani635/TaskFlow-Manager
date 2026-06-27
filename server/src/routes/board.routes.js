import { Router } from "express";
import { body } from "express-validator";
import {
  getBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
} from "../controllers/board.controller.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();
router.use(protect);

router.get("/", getBoards);
router.get("/:id", getBoard);
router.post(
  "/",
  [body("title").trim().notEmpty().withMessage("Title is required")],
  validate,
  createBoard
);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);

export default router;