import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [dbid, setDbid] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ dbid: dbid.trim().toUpperCase(), password });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Sign in</h2>
      <p className="muted">Use your DBID + password.</p>

      <form onSubmit={onSubmit} className="stack">
        <label className="stack">
          <span>DBID</span>
          <input value={dbid} onChange={(e) => setDbid(e.target.value)} placeholder="8-char DBID" />
        </label>

        <label className="stack">
          <span>Password</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
        </label>

        {error ? <div className="error">{error}</div> : null}

        <button className="btn" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

