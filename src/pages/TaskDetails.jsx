
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../Api";

export default function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTask() {
      try {
        const data = await apiRequest(`/api/tasks/${id}`);
        setTask(data.task);
      } catch (err) {
        setError(err.message || "Could not load task.");
      } finally {
        setLoading(false);
      }
    }

    loadTask();
  }, [id]);

  if (loading) return <p>Loading task details...</p>;

  if (error) {
    return (
      <section>
        <p className="error">{error}</p>
        <Link to="/">Back to tasks</Link>
      </section>
    );
  }

  if (!task) return <p>Task not found.</p>;

  return (
    <section className="task-details">
      <Link to="/">← Back to tasks</Link>
      <h1>{task.title}</h1>
      <p>{task.description || "No description provided."}</p>
      <p>
        <strong>Status:</strong> {task.status}
      </p>
      <Link className="button" to={`/edit/${task._id}`}>
        Edit Task
      </Link>
    </section>
  );
}
