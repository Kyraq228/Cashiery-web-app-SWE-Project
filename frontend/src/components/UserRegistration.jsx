import React, { useState } from "react";
import { apiRequest } from "../api/api";

function UserRegistration() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("cashier");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await apiRequest("/auth/register", "POST", { username, password, role });
      setMessage("User registered successfully!");
      setUsername("");
      setPassword("");
      setRole("cashier");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div>
      <h3>Register New User</h3>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="cashier">Cashier</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Register</button>
      </form>
      {message && <div style={{ color: "green" }}>{message}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}

export default UserRegistration;