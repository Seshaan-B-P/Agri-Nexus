const Task = require("../models/Task");

// @desc    Create Task Reminder
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { crop, title, taskType, dueDate, notes } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Task title and due date are required",
      });
    }

    const task = await Task.create({
      farmer: req.user._id,
      crop: crop || null,
      title,
      taskType: taskType || "General",
      dueDate,
      notes: notes || "",
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get My Tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ farmer: req.user._id })
      .populate("crop", "cropName variety")
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Update Task Status
// @route   PUT /api/tasks/:id
// @access  Private
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, farmer: req.user._id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.status = req.body.status || (task.status === "Pending" ? "Completed" : "Pending");
    await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated",
      task,
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Delete Task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, farmer: req.user._id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
};
