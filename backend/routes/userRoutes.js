// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { verifyToken } = require("../middleware/authMiddleware");
const { checkRole } = require("../middleware/roleMiddleware");


// ✅ Register
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // 🔥 check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    res.json({ msg: "User registered", user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


// ✅ Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ msg: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


// 🔥 Get All Users (Admin Only)
router.get(
  "/all",
  verifyToken,
  checkRole(["admin"]),
  async (req, res) => {
    try {
      const users = await User.find().select("-password"); // 🔥 hide password
      res.json(users);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
);


// 🔥 Delete User (Admin Only)
router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);

      if (!user)
        return res.status(404).json({ msg: "User not found" });

      res.json({ msg: "User deleted successfully" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
);

module.exports = router;