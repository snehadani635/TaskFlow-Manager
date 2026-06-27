import Task from "../models/Task.js";
import Board from "../models/Board.js";

const assertBoardOwner = async (boardId, userId) =>
  Board.findOne({ _id: boardId, owner: userId });

export const getTasks = async (req, res, next) => {
  try {
    const { board, status, priority, sort, search } = req.query;
    const filter = { owner: req.user._id };
    if (board) filter.board = board;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let query = Task.find(filter);
    if (sort === "dueDate") query = query.sort("dueDate");
    else if (sort === "priority") {
      const priorityOrder = { high: 1, med: 2, low: 3 };
      const tasks = await query.exec();
      return res.json(tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]));
    } else query = query.sort("-createdAt");

    res.json(await query.exec());
  } catch (err) {
    next(err);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { board } = req.body;
    if (!(await assertBoardOwner(board, req.user._id))) {
      return res.status(404).json({ message: "Board not found" });
    }
    const task = await Task.create({
      ...req.body,
      owner: req.user._id,
      activityLog: [{ action: "created", timestamp: new Date() }],
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Log activity
    if (req.body.status && req.body.status !== task.status) {
      task.activityLog.push({
        action: req.body.status === "done" ? "completed" : "moved",
        from: task.status,
        to: req.body.status,
        timestamp: new Date(),
      });
    } else {
      task.activityLog.push({
        action: "updated",
        timestamp: new Date(),
      });
    }

    Object.assign(task, req.body);
    await task.save();
    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};

// NEW: Analytics endpoint
export const getAnalytics = async (req, res, next) => {
  try {
    const { board } = req.query;
    const filter = { owner: req.user._id };
    if (board) filter.board = board;

    const tasks = await Task.find(filter);

    const statusCount = { todo: 0, "in-progress": 0, done: 0 };
    const priorityCount = { low: 0, med: 0, high: 0 };
    let overdue = 0;

    tasks.forEach((t) => {
      statusCount[t.status]++;
      priorityCount[t.priority]++;
      if (t.dueDate && t.status !== "done" && new Date(t.dueDate) < new Date()) {
        overdue++;
      }
    });

    res.json({
      total: tasks.length,
      byStatus: statusCount,
      byPriority: priorityCount,
      overdue,
    });
  } catch (err) {
    next(err);
  }
};