const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const corsOptions = {
  origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));
app.use(express.json());  // parse JSON data

const tasksFilePath = path.join(__dirname, "tasks.json");

app.get("/api", (req, res) => {
  res.json({ fruits: ["apple", "yoyoyo", "pineapple"] });
});

// read tasks from the file
const readTasks = () => {
  try {
    const data = fs.readFileSync(tasksFilePath, "utf8");
    return JSON.parse(data).tasks;
  } catch (err) {
    return [];  // if no file exists, return an empty array
  }
};

// write tasks to the file
const writeTasks = (tasks) => {
  const data = JSON.stringify({ tasks });
  fs.writeFileSync(tasksFilePath, data, "utf8");
};

// get all tasks
app.get("/api/tasks", (req, res) => {
  const tasks = readTasks();
  res.json({ tasks });
});

// aDd a new task
app.post("/api/tasks", (req, res) => {
  const { task } = req.body;
  const tasks = readTasks();
  tasks.push(task);
  writeTasks(tasks);
  res.status(201).json({ tasks });
});

// delete a task
app.delete("/api/tasks/:index", (req, res) => {
  const { index } = req.params;
  const tasks = readTasks();
  tasks.splice(index, 1);
  writeTasks(tasks);
  res.json({ tasks });
});

// rename a task
app.put("/api/tasks/:index", (req, res) => {
  const { index } = req.params;
  const { task } = req.body;
  const tasks = readTasks();
  tasks[index] = task;
  writeTasks(tasks);
  res.json({ tasks });
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});