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
  index: { type: Number, unique: false } // 0-based index
});

const Task = mongoose.model("Task", taskSchema);

// Routes

// Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ index: 1 }); // Ensure tasks are sorted by index
    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
});

// Add a new task
app.post("/api/tasks", async (req, res) => {
  try {
    const { task, category } = req.body;
    const taskCount = await Task.countDocuments(); // Get the current number of tasks
    const newTask = new Task({ 
      text: task, 
      category: category || "Uncategorized", 
      index: taskCount  // Assign the next available index
    });
    await newTask.save();
    res.status(201).json({ message: "Task added", task: newTask });
  } catch (err) {
    res.status(500).json({ error: "Error adding task" });
  }
});

const reindexTasks = async () => {
  const tasks = await Task.find().sort({ index: 1 }); // Get all tasks sorted
  for (let i = 0; i < tasks.length; i++) {
    tasks[i].index = i;  // Assign new index values
    await tasks[i].save();
  }
};

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    await reindexTasks(); // Reorder indices after deletion
    res.json({ message: "Task deleted and reindexed" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting task" });
  }
});

const updateExistingTasks = async () => {
  const tasks = await Task.find().sort({ _id: 1 });
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].index === undefined) {
      tasks[i].index = i;
      await tasks[i].save();
    }
  }
  console.log("Existing tasks updated with index values.");
};
// Call this function once when the server starts
updateExistingTasks();

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