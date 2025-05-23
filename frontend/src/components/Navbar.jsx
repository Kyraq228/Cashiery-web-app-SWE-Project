import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <nav>
        <Link to="/login">Login</Link>
      </nav>
    );
  }

  return (
    <nav>
      <span>Welcome, {user.role}!</span>
      {user.role === "cashier" && <Link to="/pos">POS</Link>}
      {user.role === "admin" && <Link to="/admin">Admin Dashboard</Link>}
      <button onClick={logout}>Logout</button>
    </nav>
  );
}

export default Navbar;