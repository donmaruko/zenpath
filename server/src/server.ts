import express, { Request, Response, RequestHandler } from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in the environment variables");
}

// Middleware
app.use(cors({ origin: ["http://localhost:5173", "http://127.0.0.1:5173"] }));
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Task Schema and Model
interface ITask extends mongoose.Document {
  text: string;
  pinned: boolean;
  category: string;
  index: number;
}

const taskSchema = new mongoose.Schema({
  text: String,
  pinned: { type: Boolean, default: false },
  category: { type: String, default: "Uncategorized" },
  index: { type: Number, unique: false }, // 0-based index
});

const Task = mongoose.model<ITask>("Task", taskSchema);

// WebSocket Connection Handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Broadcast tasks when changes happen
const broadcastTasks = async () => {
  const tasks = await Task.find().sort({ index: 1 });
  io.emit("tasksUpdated", tasks);
};

// Routes

// Get all tasks
app.get("/api/tasks", async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find().sort({ index: 1 });
    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
});

// Add a new task
app.post("/api/tasks", async (req: Request, res: Response) => {
  try {
    const { task, category } = req.body;
    const taskCount = await Task.countDocuments();
    const newTask = new Task({
      text: task,
      category: category || "Uncategorized",
      index: taskCount,
    });
    await newTask.save();
    await broadcastTasks();
    res.status(201).json({ message: "Task added", task: newTask });
  } catch (err) {
    res.status(500).json({ error: "Error adding task" });
  }
});

const reindexTasks = async () => {
  const tasks = await Task.find().sort({ index: 1 }); // Get all tasks sorted
  for (let i = 0; i < tasks.length; i++) {
    tasks[i].index = i; // Assign new index values
    await tasks[i].save();
  }
};

app.delete("/api/tasks/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    await reindexTasks(); // Reorder indices after deletion
    await broadcastTasks();
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
app.put("/api/tasks/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { task } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(id, { text: task }, { new: true });
    await broadcastTasks();
    res.json({ message: "Task updated", task: updatedTask });
  } catch (err) {
    res.status(500).json({ error: "Error updating task" });
  }
});

// Toggle pin status
const togglePin: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    task.pinned = !task.pinned;
    await task.save();
    res.json({ message: "Pin status toggled", task });
  } catch (err) {
    res.status(500).json({ error: "Error toggling pin status" });
  }
};
app.put("/api/tasks/:id/pin", togglePin);


app.put("/api/tasks/:id/category", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { category } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(id, { category }, { new: true });
    res.json({ message: "Task category updated", task: updatedTask });
  } catch (err) {
    res.status(500).json({ error: "Error updating task category" });
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});