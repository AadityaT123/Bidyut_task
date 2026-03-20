import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../Pages/Login.jsx";
import Register from "../Pages/Register.jsx";
import Dashboard from "../Pages/Dashboard.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      
      {/* ✅ Toast should be here (GLOBAL) */}
      <ToastContainer position="top-right" autoClose={2000} />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;