const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;

const corsOptions = {
  origin: ["http://localhost:5173"],
};

// Middleware
app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Task Schema and Model
const taskSchema = new mongoose.Schema({
  text: String,
  pinned: { type: Boolean, default: false },
  category: { type: String, default: "Uncategorized" },
});


const Task = mongoose.model("Task", taskSchema);

// Routes

// Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
});

// Add a new task
app.post("/api/tasks", async (req, res) => {
  try {
    const { task, category } = req.body;
    const newTask = new Task({ text: task, category: category || "Uncategorized" });
    await newTask.save();
    res.status(201).json({ message: "Task added", task: newTask });
  } catch (err) {
    res.status(500).json({ error: "Error adding task" });
  }
});

// Delete a task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting task" });
  }
});

// Rename a task
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { task } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(id, { text: task }, { new: true });
    res.json({ message: "Task updated", task: updatedTask });
  } catch (err) {
    res.status(500).json({ error: "Error updating task" });
  }
});

// Toggle pin status
app.put("/api/tasks/:id/pin", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    task.pinned = !task.pinned;
    await task.save();
    res.json({ message: "Pin status toggled", task });
  } catch (err) {
    res.status(500).json({ error: "Error toggling pin status" });
  }
});

app.put("/api/tasks/:id/category", async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(id, { category }, { new: true });
    res.json({ message: "Task category updated", task: updatedTask });
  } catch (err) {
    res.status(500).json({ error: "Error updating task category" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});