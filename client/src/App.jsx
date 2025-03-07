import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:8080"); // websocket connection

function App() {
  const [count, setCount] = useState(0);
  const [array, setArray] = useState([]);

  const [tasks, setTasks] = useState([]);  // array to store tasks
  const [newTask, setNewTask] = useState("");  // state for new task input

  const [editingIndex, setEditingIndex] = useState(null); // track which task is being edited, null if none
  const [editTaskName, setEditTaskName] = useState(""); // hold the new task name for editing

  const [selectedCategory, setSelectedCategory] = useState(""); // Category selection
  const [customCategory, setCustomCategory] = useState(""); // User inputted category
  const categories = ["Work", "Personal", "Study", "Custom"]; // Default categories

  // fetch tasks from backend
  const fetchTasks = async () => {
    const response = await axios.get("http://localhost:8080/api/tasks");
    setTasks(response.data.tasks);
  };

  // add a new task
  const addTask = async () => {
    const categoryToUse = selectedCategory === "Custom" ? customCategory : selectedCategory;
    if (!newTask.trim()) return alert("Task cannot be empty!");

    await axios.post("http://localhost:8080/api/tasks", {
      task: newTask,
      category: categoryToUse,
    });

    setNewTask("");
    setSelectedCategory("");
    setCustomCategory("");
  };

  // delete a task
  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:8080/api/tasks/${id}`);
    setTasks(tasks.filter((task) => task._id !== id)); // Correct filtering
  };  
  
  // rename and edit a task
  const renameTask = async (id, newName) => {
    if (newName.trim() === "") {
      alert("Task name cannot be empty.");
      return;
    }
    
    // Reset editing state immediately before making the API call
    setEditingIndex(null);
  
    await axios.put(`http://localhost:8080/api/tasks/${id}`, { task: newName });
    setTasks(tasks.map((task) => (task._id === id ? response.data.task : task)));
    setEditTaskName("");  // Clear the input field
  };
  
  // toggle pin/unpin task
  const togglePinTask = async (id) => {
    const response = await axios.put(`http://localhost:8080/api/tasks/${id}/pin`);
    setTasks(tasks.map((task) => (task._id === id ? response.data.task : task)));
  };  
  
  // fetch tasks when the component mounts (on page load/refresh)
  // Listen for real-time updates
  useEffect(() => {
    fetchTasks();

    // Listen for task updates via WebSocket
    socket.on("tasksUpdated", (updatedTasks) => {
      setTasks(updatedTasks);
    });

    return () => {
      socket.off("tasksUpdated"); // Cleanup listener when component unmounts
    };
  }, []);

  return (
    <div>
      <h1>ZenPath</h1>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="New task"
      />

      {/* Category Dropdown */}
      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {/* Custom Category Input */}
      {selectedCategory === "Custom" && (
        <input
          type="text"
          value={customCategory}
          onChange={(e) => setCustomCategory(e.target.value)}
          placeholder="Enter custom category"
        />
      )}

      <button onClick={addTask}>Add Task</button>

      {/* Pinned Tasks Section */}
      {tasks.some((task) => task.pinned) && (
        <>
          <h2>Pinned Tasks</h2>
          <ul>
            {tasks
              .filter((task) => task.pinned)
              .map((task) => (
                <li key={task._id}>
                  <span>{task.text}</span>
                  <button onClick={() => togglePinTask(task._id)}>Unpin</button>
                </li>
              ))}
          </ul>
        </>
      )}

      <h2>All Tasks</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {editingIndex === task._id ? (
              <>
                <input
                  type="text"
                  value={editTaskName}
                  onChange={(e) => setEditTaskName(e.target.value)}
                />
                <button onClick={() => renameTask(task._id, editTaskName)}>Save</button>
                <button onClick={() => setEditingIndex(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{task.text} - <strong>{task.category}</strong></span>
                <button onClick={() => togglePinTask(task._id)}>
                  {task.pinned ? "Unpin" : "Pin"}
                </button>
                <button onClick={() => {
                  setEditingIndex(task._id);
                  setEditTaskName(task.text);
                }}>Edit</button>
                <button onClick={() => deleteTask(task._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;