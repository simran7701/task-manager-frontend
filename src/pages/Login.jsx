
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../Api";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (isSignup && name.trim().length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      if (isSignup) {
        await apiRequest("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
          }),
        });
      }

      const data = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.location.href = "/";
    } catch (err) {
      setError(err.message || "Login or signup failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <h1>{isSignup ? "Create Account" : "Welcome Back"}</h1>

      <p>
        {isSignup
          ? "Create an account to manage your tasks."
          : "Log in to view and manage your tasks."}
      </p>

      {error && <p className="error">{error}</p>}

      <form className="task-form" onSubmit={handleSubmit}>
        {isSignup && (
          <>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              minLength={2}
              maxLength={60}
              required
              placeholder="Enter your name"
            />
          </>
        )}

        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          maxLength={72}
          required
          placeholder="At least 8 characters"
        />

        <button type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : isSignup
              ? "Create Account"
              : "Log In"}
        </button>
      </form>

      <p>
        {isSignup ? "Already have an account?" : "New user?"}{" "}
        <button
          type="button"
          className="text-button"
          onClick={() => {
            setIsSignup(!isSignup);
            setError("");
          }}
        >
          {isSignup ? "Log In" : "Sign Up"}
        </button>
      </p>

      <Link to="/">Back to Tasks</Link>
    </section>
  );
}
