const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

const { verifyToken } = require("../middleware/authMiddleware");
const { checkRole } = require("../middleware/roleMiddleware");


// ✅ Create Task (user or admin)
// ✅ Create Task (Admin assign / User self)
router.post("/", verifyToken, async (req, res) => {
  try {
    let assignedUser;

    if (req.user.role === "admin") {
      // 👑 Admin → assign to selected user
      assignedUser = req.body.user;

      if (!assignedUser) {
        return res.status(400).json({ msg: "User ID required" });
      }
    } else {
      // 👤 User → only for himself
      assignedUser = req.user.id;
    }

    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      user: assignedUser,
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


// ✅ Get All Tasks
router.get("/", verifyToken, async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "admin") {
      // Admin sees all
      tasks = await Task.find().populate("user", "name email");
    } else {
      // User sees only own tasks
      tasks = await Task.find({ user: req.user.id });
    }

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


// 🔥 Delete Task (ADMIN ONLY)
router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  async (req, res) => {
    try {
      await Task.findByIdAndDelete(req.params.id);
      res.json({ msg: "Task deleted by admin" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
);

// 🔥 Toggle Task Complete (User)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    // Only owner OR admin
    if (
      task.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    task.completed = !task.completed;
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;  