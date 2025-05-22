import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <nav>
      <Link to="/">Home</Link>
      {role === "cashier" && <Link to="/pos">POS</Link>}
      {role === "admin" && <Link to="/admin">Admin Dashboard</Link>}
      {role && <button onClick={handleLogout}>Logout</button>}
    </nav>
  );
}

export default Navbar;