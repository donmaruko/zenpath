import { useState, useEffect, ChangeEvent, FC } from "react";
import "./App.css";
import io from "socket.io-client";
import axios from "axios";

interface Task {
  _id: string;
  text: string;
  pinned: boolean;
  category: string;
}

const socket = io("http://localhost:8080");

const App: FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<string | null>(null);
  const [editTaskName, setEditTaskName] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [customCategory, setCustomCategory] = useState<string>("");

  const categories: string[] = ["Work", "Personal", "Study", "Custom"];

  // Fetch tasks from backend
  const fetchTasks = async (): Promise<void> => {
    try {
      const response = await axios.get<{ tasks: Task[] }>("http://localhost:8080/api/tasks");
      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  // Add a new task
  const addTask = async (): Promise<void> => {
    const categoryToUse = selectedCategory === "Custom" ? customCategory : selectedCategory;
    if (!newTask.trim()) return alert("Task cannot be empty!");

    try {
      await axios.post("http://localhost:8080/api/tasks", {
        task: newTask,
        category: categoryToUse,
      });
      setNewTask("");
      setSelectedCategory("");
      setCustomCategory("");
    } catch (error) {
      console.error("Error adding task", error);
    }
  };

  // Delete a task
  const deleteTask = async (id: string): Promise<void> => {
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  // Rename a task
  const renameTask = async (id: string, newName: string): Promise<void> => {
    if (!newName.trim()) {
      alert("Task name cannot be empty.");
      return;
    }

    try {
      setEditingIndex(null);
      const response = await axios.put<{ task: Task }>(`http://localhost:8080/api/tasks/${id}`, { task: newName });
      setTasks((prev) => prev.map((task) => (task._id === id ? response.data.task : task)));
      setEditTaskName("");
    } catch (error) {
      console.error("Error renaming task", error);
    }
  };

  // Toggle pin/unpin task
  const togglePinTask = async (id: string): Promise<void> => {
    try {
      const response = await axios.put<{ task: Task }>(`http://localhost:8080/api/tasks/${id}/pin`);
      setTasks((prev) => prev.map((task) => (task._id === id ? response.data.task : task)));
    } catch (error) {
      console.error("Error toggling pin status", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    socket.on("tasksUpdated", (updatedTasks: Task[]) => {
      setTasks(updatedTasks);
    });
    return () => {
      socket.off("tasksUpdated");
    };
  }, []);

  return (
    <div>
      <h1>ZenPath</h1>
      <input
        type="text"
        value={newTask}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
        placeholder="New task"
      />

      {/* Category Dropdown */}
      <select
        value={selectedCategory}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Custom Category Input */}
      {selectedCategory === "Custom" && (
        <input
          type="text"
          value={customCategory}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomCategory(e.target.value)}
          placeholder="Enter custom category"
        />
      )}

      <button onClick={addTask}>Add Task</button>

      {/* Pinned Tasks Section */}
      {tasks.some((task) => task.pinned) && (
        <>
          <h2>Pinned Tasks</h2>
          <ul>
            {tasks.filter((task) => task.pinned).map((task) => (
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
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEditTaskName(e.target.value)}
                />
                <button onClick={() => renameTask(task._id, editTaskName)}>Save</button>
                <button onClick={() => setEditingIndex(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>
                  {task.text} - <strong>{task.category}</strong>
                </span>
                <button onClick={() => togglePinTask(task._id)}>
                  {task.pinned ? "Unpin" : "Pin"}
                </button>
                <button
                  onClick={() => {
                    setEditingIndex(task._id);
                    setEditTaskName(task.text);
                  }}
                >
                  Edit
                </button>
                <button onClick={() => deleteTask(task._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
