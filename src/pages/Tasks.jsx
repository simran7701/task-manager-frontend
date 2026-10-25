
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../Api.js";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTasks() {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/api/tasks");
      setTasks(data.tasks || []);
    } catch (err) {
      setError(err.message || "Could not load tasks.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteTask(id) {
    if (!window.confirm("Delete this task?")) return;

    try {
      await apiRequest(`/api/tasks/${id}`, { method: "DELETE" });
      setTasks((previous) => previous.filter((task) => task._id !== id));
    } catch (err) {
      setError(err.message || "Could not delete task.");
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  if (loading) return <p>Loading tasks...</p>;

  return (
    <section>
      <div className="page-heading">
        <div>
          <h1>My Tasks</h1>
          <p>Organize your work, one task at a time.</p>
        </div>
        <Link className="button" to="/create">+ Add Task</Link>
      </div>

      {error && <p className="error">{error}</p>}

      {tasks.length === 0 && !error ? (
        <p className="empty">No tasks yet. Create your first task!</p>
      ) : (
        <div className="task-grid">
          {tasks.map((task) => (
            <article className="task-card" key={task._id}>
              <span className={`status ${task.status}`}>
                {task.status}
              </span>
              <h2>{task.title}</h2>
              <p>{task.description || "No description provided."}</p>
              <div className="task-actions">
                <Link to={`/tasks/${task._id}`}>View details</Link>
                <Link to={`/edit/${task._id}`}>Edit</Link>
                <button
                  className="delete-button"
                  onClick={() => deleteTask(task._id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
