import { Router } from "express";
import { getSuggestion } from "../controllers/ai.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.post("/suggest", protect, getSuggestion);

export default router;