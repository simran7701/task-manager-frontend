
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";

import Tasks from "./pages/Tasks";
import TaskDetails from "./pages/TaskDetails";
import TaskForm from "./pages/TaskForm";
import Login from "./pages/Login";
import "./index.css";

function AppContent() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    navigate("/login");
  }

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo">Task Manager</Link>

        {token ? (
          <>
            <Link to="/">All Tasks</Link>
            <Link to="/create">+ Add Task</Link>
            <button type="button" onClick={logout}>Log Out</button>
          </>
        ) : (
          <Link to="/login">Login / Signup</Link>
        )}
      </nav>

      <main className="container">
        <Routes>
          <Route
            path="/login"
            element={
              token ? <Navigate to="/" replace /> : <Login />
            }
          />

          <Route
            path="/"
            element={token ? <Tasks /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/tasks/:id"
            element={token ? <TaskDetails /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/create"
            element={token ? <TaskForm /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/edit/:id"
            element={token ? <TaskForm /> : <Navigate to="/login" replace />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
