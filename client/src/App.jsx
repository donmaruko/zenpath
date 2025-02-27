import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";

function App() {
  const [count, setCount] = useState(0);
  const [array, setArray] = useState([]);

  const [tasks, setTasks] = useState([]);  // array to store tasks
  const [newTask, setNewTask] = useState("");  // state for new task input

  const [editingIndex, setEditingIndex] = useState(null); // track which task is being edited, null if none
  const [editTaskName, setEditTaskName] = useState(""); // hold the new task name for editing

  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api");
    setArray(response.data.fruits);
    console.log(response.data.fruits);
  };

  // fetch tasks from backend
  const fetchTasks = async () => {
    const response = await axios.get("http://localhost:8080/api/tasks");
    setTasks(response.data.tasks);
  };

  // add a new task
  const addTask = async () => {
    const response = await axios.post("http://localhost:8080/api/tasks", {
      task: newTask,
    });
    setTasks(response.data.tasks);
    setNewTask("");  // clear input field
  };

  // delete a task
  const deleteTask = async (index) => {
    const response = await axios.delete(`http://localhost:8080/api/tasks/${index}`);
    setTasks(response.data.tasks);
  };

  // helper function to reset editing state
  const resetEditingState = () => {
    setEditingIndex(null);
    setEditTaskName("");
  } // we do this to avoid having to write the same code in multiple places

  // rename and edit a task
  const renameTask = async (index, newName) => {
    if (newName.trim() === "") {
        alert("Task name cannot be empty.");
        return;
    }
    const response = await axios.put(`http://localhost:8080/api/tasks/${index}`, {
        task: newName,
    });
    setTasks(response.data.tasks);
    resetEditingState();
  };

  // fetch tasks when the component mounts (on page load/refresh)
  useEffect(() => {
      fetchTasks();
  }, []); // empty arr ensures this effect runs only once

  return (
    <div>
      <h1>ZenPath</h1>

      {/* the input for adding new tasks */}
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="New task"
      />
      <button onClick={addTask}>Add Task</button>

      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  value={editTaskName}
                  onChange={(e) => setEditTaskName(e.target.value)}
                />
                <button onClick={() => renameTask(index, editTaskName)}>Save</button>
                <button onClick={() => setEditingIndex(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{task}</span>
                <button onClick={() => {
                  setEditingIndex(index);
                  setEditTaskName(task);
                }}>Edit</button>
                <button onClick={() => deleteTask(index)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;