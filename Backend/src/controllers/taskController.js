import Joi from "joi";
import Task from "../models/Task.js";
import User from "../models/User.js";

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

// Create a new task
export const createTask = async (req, res, next) => {
  const createTaskSchema = Joi.object({
    title: Joi.string().max(200).required().messages({
      "string.empty": "Title is required",
    }),
    description: Joi.string().required().messages({
      "string.empty": "Description is required",
    }),
    status: Joi.string()
      .valid("todo", "in_progress", "done", "blocked")
      .default("todo"),
    priority: Joi.string()
      .valid("low", "medium", "high", "critical")
      .default("medium"),
    dueDate: Joi.date().allow(null),
  });

  const { error } = createTaskSchema.validate(req.body);

  if (error) {
    return next(error);
  }
  try {
    const task = await Task.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Task created", task });
  } catch (error) {
    next(error);
  }
};

// Get tasks with pagination, filtering, sorting
export const getTasks = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      sortBy,
      sortOrder = "asc",
      q,
    } = req.query;

    const filters = {};

    // 🔥 If NOT admin → show only createdBy user
    if (req.user.role !== "admin") {
      filters.createdBy = req.user._id;
    }

    // Filtering
    if (status) filters.status = status;
    if (priority) filters.priority = priority;

    // 🔍 Search (title or description)
    if (q && q.trim() !== "") {
      filters.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    // ⭐ Default sorting → Newest first
    let sorting = { createdAt: -1 };

    // Override sorting only if user passes sortBy params
    if (sortBy) {
      sorting = {};
      sorting[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    const tasks = await Task.find(filters)
      .sort(sorting)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Task.countDocuments(filters);

    res.json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// Get single task
export const getTaskById = async (req, res, next) => {
  const getTaskByIdSchema = Joi.object({
    id: Joi.string().pattern(mongodbIdPattern).required().messages({
      "string.pattern.base": "Invalid task ID format",
      "any.required": "Task ID is required",
    }),
  });

  const { error } = getTaskByIdSchema.validate(req.params);

  if (error) {
    return next(error);
  }
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return next({ status: 404, message: "Task not found" });

    res.json(task);
  } catch (error) {
    next(error);
  }
};

// Update task
export const updateTask = async (req, res, next) => {
  const updateTaskSchema = Joi.object({
    id: Joi.string().pattern(mongodbIdPattern).required(),
    title: Joi.string().trim().max(200),
    description: Joi.string().trim(),
    status: Joi.string().valid("todo", "in_progress", "done", "blocked"),
    priority: Joi.string().valid("low", "medium", "high", "critical"),
    dueDate: Joi.date().allow(null),
  });

  const { error } = updateTaskSchema.validate(req.params);

  if (error) {
    return next(error);
  }
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!task) return next({ status: 404, message: "Task not found" });

    res.json({ message: "Task updated", task });
  } catch (error) {
    next(error);
  }
};

// Delete task
export const deleteTask = async (req, res, next) => {
  const getTaskByIdSchema = Joi.object({
    id: Joi.string().pattern(mongodbIdPattern).required().messages({
      "string.pattern.base": "Invalid task ID format",
      "any.required": "Task ID is required",
    }),
  });

  const { error } = getTaskByIdSchema.validate(req.params);

  if (error) {
    return next(error);
  }
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) return next({ status: 404, message: "Task not found" });

    res.json({ message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};

