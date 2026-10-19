
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../Api";

export default function TaskForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return;

    async function loadTask() {
      try {
        const data = await apiRequest(`/api/tasks/${id}`);
        setTitle(data.task.title || "");
        setDescription(data.task.description || "");
        setStatus(data.task.status || "pending");
      } catch (err) {
        setError(err.message || "Could not load task.");
      } finally {
        setLoading(false);
      }
    }

    loadTask();
  }, [id, isEditing]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    if (title.trim().length > 120) {
      setError("Title must be 120 characters or less.");
      return;
    }

    if (description.length > 1000) {
      setError("Description must be 1000 characters or less.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        status,
      };

      await apiRequest(
        isEditing ? `/api/tasks/${id}` : "/api/tasks",
        {
          method: isEditing ? "PUT" : "POST",
          body: JSON.stringify(payload),
        }
      );

      navigate("/");
    } catch (err) {
      setError(err.message || "Could not save task.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading task...</p>;

  return (
    <section className="form-page">
      <Link to="/">← Back to tasks</Link>
      <h1>{isEditing ? "Edit Task" : "Create a Task"}</h1>
      <p>Add details and keep your work organized.</p>

      {error && <p className="error">{error}</p>}

      <form className="task-form" onSubmit={handleSubmit}>
        <label htmlFor="title">Task title *</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          required
          placeholder="e.g. Complete React assignment"
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={1000}
          rows={5}
          placeholder="Add some details..."
        />

        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : isEditing ? "Update Task" : "Create Task"}
        </button>
      </form>
    </section>
  );
}
