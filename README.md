# ZenPath

ZenPath is a lightweight productivity tool designed to help users manage their tasks efficiently. It follows the philosophy that big challenges can be broken down into smaller, more manageable pieces. The UI/UX is designed for simplicity, making it easy for users to organize their workload and stay on track.

## Features

- 📝 **Task Management** – Add, edit, and delete tasks seamlessly.
- 🔄 **Persistent Data** – Tasks are stored on the backend and persist even after a page refresh.
- 🎨 **Minimalist UI** – Clean and simple design for a distraction-free experience.
- 🚀 **Fast & Responsive** – Built using modern web technologies for smooth performance.

## Tech Stack

- **Frontend:** React (Vite) + Axios
- **Backend:** Node.js (Express)
- **Database:** In-memory (can be extended to MongoDB, PostgreSQL, etc.)

## Installation & Setup

1. **Clone the Repository**

   ```sh
   git clone https://github.com/your-username/ZenPath.git
   cd ZenPath
   ```

2. **Install Dependencies**

   ```sh
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Run the Development Servers**

   ```sh
   # Start the backend server (Node.js + Express)
   cd backend
   npm start

   # Start the frontend server (Vite + React)
   cd ../frontend
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser to use ZenPath!

## API Endpoints

### Fetch All Tasks

```http
GET /api/tasks
```

- Returns a list of tasks.

### Add a New Task

```http
POST /api/tasks
```

**Body:** `{ "task": "New Task" }`

### Edit a Task

```http
PUT /api/tasks/:index
```

**Body:** `{ "task": "Updated Task Name" }`

### Delete a Task

```http
DELETE /api/tasks/:index
```

## Note

This project is a work in progress, with more features planned for future development. Feedback and contributions are always welcome!

---
