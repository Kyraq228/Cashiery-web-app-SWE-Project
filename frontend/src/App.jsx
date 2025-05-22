import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import POS from "./pages/POS";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./components/Login";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;