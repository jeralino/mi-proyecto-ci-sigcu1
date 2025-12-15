import { HashRouter, Routes, Route, useNavigate } from "react-router-dom"; 
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Comedores from "./pages/Comedores";
import Comedor from "./pages/Comedor";
import AdminDashboard from './pages/AdminDashboard';

// NOTA: Cuando tengas tu backend en Render, cambiarás esta URL.
// Por ahora, para pruebas locales usa localhost.
const API_BASE_URL = "http://localhost:4000/api/auth"; 

// Creamos un componente interno para poder usar el hook 'useNavigate' dentro del Router
function AppContent() {
  const navigate = useNavigate(); 

  // Función para registrar usuario
  const handleRegister = async (form) => {
    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        alert("Cuenta creada correctamente. Ahora inicia sesión.");
        navigate("/login"); // Navegación segura con HashRouter
      } else {
        alert(data.error || "Error creando la cuenta");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error conectando al servidor");
    }
  };

  // Función para iniciar sesión
  const handleLogin = async (form) => {
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        alert("Bienvenido!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard"); // Navegación segura con HashRouter
      } else {
        alert(data.error || "Credenciales incorrectas");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error conectando al servidor");
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      {/* Pasamos las funciones como props para que los formularios funcionen */}
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/register" element={<Register onRegister={handleRegister} />} />
      
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/comedores/:facultadId" element={<Comedores />} />
      <Route path="/comedor/:comedorId" element={<Comedor />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

function App() {
  return (
    // Aquí envolvemos todo con HashRouter para compatibilidad con GitHub Pages
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;