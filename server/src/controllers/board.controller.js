import Board from "../models/Board.js";
import Task from "../models/Task.js";

export const getBoards = async (req, res, next) => {
  try {
    const boards = await Board.find({ owner: req.user._id }).sort("-createdAt");
    res.json(boards);
  } catch (err) {
    next(err);
  }
};

export const getBoard = async (req, res, next) => {
  try {
    const board = await Board.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!board) return res.status(404).json({ message: "Board not found" });
    res.json(board);
  } catch (err) {
    next(err);
  }
};

export const createBoard = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const board = await Board.create({
      title,
      description,
      owner: req.user._id,
    });
    res.status(201).json(board);
  } catch (err) {
    next(err);
  }
};

export const updateBoard = async (req, res, next) => {
  try {
    const board = await Board.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!board) return res.status(404).json({ message: "Board not found" });
    res.json(board);
  } catch (err) {
    next(err);
  }
};

export const deleteBoard = async (req, res, next) => {
  try {
    const board = await Board.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!board) return res.status(404).json({ message: "Board not found" });
    await Task.deleteMany({ board: board._id });
    res.json({ message: "Board deleted" });
  } catch (err) {
    next(err);
  }
};