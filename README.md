# ZenPath - Productivity Tool

ZenPath is a **productivity tool** that helps users **track skills, manage tasks, organize projects, and set goals** within a **unified dashboard**. Built with **React (Vite) for the frontend** and **Node.js with Express and MongoDB for the backend**, ZenPath offerstask management features such as **drag-and-drop task reordering, pinned tasks, task categories, recurring tasks, and future third-party integrations**. More features are to come!

---

## 🚀 Features

- **Task Management:** Add, edit, delete, and pin tasks.
- **Reordering:** Easily organize tasks dynamically.
- **Pinned Tasks:** Keep high-priority tasks at the top.
- **Task Categories & Tags:** Categorize tasks by priority, project, or custom labels.
- **Recurring Tasks:** Support for daily, weekly, or custom recurrence options.
- **MongoDB Integration:** Persistent storage for tasks.
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

## 🔥 API Endpoints
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
- @hello-pangea/dnd (Drag & Drop)
- Tailwind CSS (Planned UI Enhancement)

### **Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- CORS & dotenv

---

## 🛠️ Project Structure
```bash
zenpath/
│── client/      # Frontend React App (Vite)
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│
│── server/      # Backend Express API
│   ├── server.js
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│
│── README.md   # Project Documentation
```

---

## 🔥 Usage Guide
1. **Start the backend (`npm run dev` in `server/`)**
2. **Start the frontend (`npm run dev` in `client/`)**
3. **Open `http://localhost:5173/` in your browser**
4. **Manage tasks: Add, Edit, Delete, Pin, and Reorder!**

---

## 🎯 Future Plans
- **Google Calendar & Notion Integration**
- **Advanced Progress Tracking & Analytics**

---