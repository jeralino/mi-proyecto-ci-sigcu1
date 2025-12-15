import { useState } from "react";
// 1. IMPORTAR LINK: Esto es clave para que no te dé error 404
import { useNavigate, Link } from "react-router-dom"; 

export default function Login({ onLogin }) {
  const navigate = useNavigate(); 

  // --- ESTADOS ORIGINALES ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // --- NUEVOS ESTADOS (Para el Switch y datos de Admin) ---
  const [activeTab, setActiveTab] = useState("client"); // 'client' o 'admin'
  const [adminId, setAdminId] = useState("");
  const [adminName, setAdminName] = useState("");

  // --- FUNCIÓN ORIGINAL (Cliente) ---
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  // --- NUEVA FUNCIÓN (Admin) ---
  const handleAdminLogin = async (e) => {
    e.preventDefault();

    // 1. Validación visual básica
    if (adminId.trim() === "" || adminName.trim() === "") {
      alert("Por favor ingrese ID y Nombre del Administrador");
      return;
    }

    try {
      // 2. Petición al Backend (Asegúrate que el puerto 4000 sea el correcto)
      const response = await fetch("http://localhost:4000/api/auth/admin-login-view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminId: adminId, 
          adminName: adminName 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("adminName", data.user.nombre);
        localStorage.setItem("adminRole", data.user.rol);
        localStorage.setItem("userId", data.user.id);
        
        // --- IMPORTANTE: Guardamos el Token ---
        localStorage.setItem("token", data.token); 
        
        console.log("Acceso concedido:", data.message);
        navigate("/admin-dashboard");
      } else {
        alert(data.message || data.error || "Error al ingresar.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg border-0" style={{ width: "420px" }}>
        <div className="card-body p-5">
          <h3 className="text-center mb-4 fw-bold">
            <i className="bi bi-mortarboard-fill me-2 text-primary"></i>
            UTM – Comedor Inteligente
          </h3>

          {/* --- INICIO DE PESTAÑAS (SWITCH) --- */}
          <div className="d-flex justify-content-center mb-4 gap-2">
            <button
              type="button"
              className={`btn ${activeTab === "client" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setActiveTab("client")}
            >
              Cliente
            </button>
            <button
              type="button"
              className={`btn ${activeTab === "admin" ? "btn-danger" : "btn-outline-danger"}`}
              onClick={() => setActiveTab("admin")}
            >
              Admin View
            </button>
          </div>

          {/* FORMULARIOS */}
          {activeTab === "client" ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Correo institucional
                </label>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  placeholder="ejemplo@utm.edu.ec"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Contraseña</label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  placeholder="•••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button className="btn btn-primary w-100 btn-lg">
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Iniciar sesión
              </button>

              <p className="text-center mt-4">
                ¿No tienes cuenta?{" "}
                {/* 2. SOLUCIÓN: Usamos Link en lugar de <a> */}
                {/* Esto evita que la página se recargue y pierda la ruta */}
                <Link to="/register" className="text-primary fw-semibold">
                  Crear cuenta
                </Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleAdminLogin}>
              <div className="mb-3">
                <label className="form-label fw-semibold text-danger">
                  ID Único de Administrador
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Ej: 3 (ID numérico)"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold text-danger">
                  Nombre del Administrador
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Ej: Jorge Admin"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                />
              </div>

              <button className="btn btn-danger w-100 btn-lg">
                <i className="bi bi-shield-lock-fill me-2"></i>
                Ingresar Admin
              </button>
              
              <p className="text-center mt-4" style={{ visibility: "hidden" }}>
                 Espacio reservado
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}