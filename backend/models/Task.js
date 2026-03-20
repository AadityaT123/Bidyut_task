const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  completed: {   
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);