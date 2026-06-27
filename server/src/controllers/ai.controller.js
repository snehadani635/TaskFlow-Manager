import { suggestEstimate } from "../utils/llm.js";

export const getSuggestion = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Task title is required" });
    }
    const result = await suggestEstimate({ title, description });
    res.json(result);
  } catch (err) {
    next(err);
  }
};