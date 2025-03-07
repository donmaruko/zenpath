# ZenPath - Productivity Tool

ZenPath is a **productivity tool** that helps users **track skills, manage tasks, organize projects, and set goals** within a **unified dashboard**. Built with **React (Vite) for the frontend** and **Node.js with Express and MongoDB for the backend**, ZenPath offers task management features such as **drag-and-drop task reordering, pinned tasks, task categories, recurring tasks, and real-time task updates via WebSockets**. More features are to come!

---

## 🚀 Features

- **Task Management:** Add, edit, delete, and pin tasks.
- **Pinned Tasks:** Keep high-priority tasks at the top.
- **Task Categories & Tags:** Categorize tasks by priority, project, or custom labels.
- **MongoDB Integration:** Persistent storage for tasks.
- **Real-Time Task Updates:** WebSockets ensure instant sync across multiple clients.
- **REST API Backend:** Node.js and Express.js for seamless API communication.
- **Vite + React Frontend:** Fast and responsive UI with Axios for API requests.

---

## 🛠️ Installation & Setup

### **1. Clone the Repository**
```bash
  git clone https://github.com/donmaruko/zenpath.git
  cd zenpath
```

### **2. Set Up the Backend (Server)**
```bash
cd server
npm install
```

- **Create a `.env` file** in the `server` directory and add:
  ```env
  MONGO_URI=mongodb://localhost:27017/zenpath
  PORT=8080
  ```

- **Run the server**:
  ```bash
  npm run dev
  ```
  The backend will start at `http://localhost:8080/`

### **3. Set Up the Frontend (Client)**
```bash
cd ../client
npm install
npm run dev
```

- The frontend will start at `http://localhost:5173/`

---

## 🔥 Real-Time WebSockets Integration
ZenPath supports **real-time task updates** using **WebSockets**. Tasks now sync across multiple clients when any task is added, edited, or deleted.

### **WebSocket Setup**
- The backend uses **Socket.io** to broadcast updates to all connected clients.
- The frontend listens for `tasksUpdated` events and updates the UI dynamically.

#### **WebSocket Events**
| Event Name   | Description |
|-------------|------------|
| `tasksUpdated` | Broadcasts the latest tasks when any modification occurs |

---

## 🖥️ API Endpoints
### **Tasks API** (`/api/tasks`)
| Method | Endpoint                  | Description            |
|--------|---------------------------|------------------------|
| `GET`  | `/api/tasks`               | Fetch all tasks       |
| `POST` | `/api/tasks`               | Add a new task        |
| `PUT`  | `/api/tasks/:id`           | Update task text      |
| `DELETE` | `/api/tasks/:id`        | Delete a task         |
| `PUT`  | `/api/tasks/:id/pin`       | Toggle pin status     |

---

## 🖥️ Technologies Used

### **Frontend:**
- React (Vite)
- Axios
- Socket.io-client (for WebSockets)
- Tailwind CSS (Planned UI Enhancement)

### **Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- Socket.io (for real-time communication)
- CORS & dotenv

---

## 🛠️ Project Structure
```bash
zenpath/
│── client/      # Frontend React App (Vite)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
│── server/      # Backend Express API
│   ├── server.js
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── package.json
│
│── README.md   # Project Documentation
```

---

## 🔥 Usage Guide
1. **Start the backend (`npm run dev` in `server/`)**
2. **Start the frontend (`npm run dev` in `client/`)**
3. **Open `http://localhost:5173/` in your browser**
4. **Manage tasks: Add, Edit, Delete, Pin, and Reorder!**
5. **Open multiple tabs or devices and see changes in real time!**

---

## 🎯 Future Plans
- **Drag-and-Drop Task Reordering**
- **Recurring Tasks:** Support for daily, weekly, or custom recurrence options.
- **Google Calendar & Notion Integration**
- **Advanced Progress Tracking & Analytics**

---