import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 text-white"
      style={{
        background: "linear-gradient(135deg, #004e92, #000428)",
      }}
    >
      <div className="text-center p-5">
        <h1 className="fw-bold display-4 mb-3">
          <i className="bi bi-mortarboard-fill text-warning me-3"></i>
          Sistema de Comida Universitaria
        </h1>

        <h3 className="fw-light mb-4">Universidad Técnica de Manabí</h3>

        <p className="lead mb-5 opacity-75">
          Consulta el menú del día, reserva tu comida y descubre el valor nutricional,
          todo desde una plataforma rápida y moderna.
        </p>

        <div className="d-flex justify-content-center gap-3">
          {!user ? (
            <>
              <a href="/login" className="btn btn-warning btn-lg px-4 fw-semibold rounded-pill">
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Iniciar sesión
              </a>

              <a href="/register" className="btn btn-outline-light btn-lg px-4 fw-semibold rounded-pill">
                <i className="bi bi-person-plus me-2"></i>
                Crear cuenta
              </a>
            </>
          ) : (
            <>
              <span className="btn btn-success btn-lg px-4 fw-semibold rounded-pill disabled">
                Bienvenido, {user.nombre}
              </span>
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  localStorage.removeItem("token");
                  window.location.reload();
                }}
                className="btn btn-outline-light btn-lg px-4 fw-semibold rounded-pill"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>

        <footer className="mt-5 opacity-50">
          <small>© 2025 Universidad Técnica de Manabí – Sistema Comedor Inteligente</small>
        </footer>
      </div>
    </div>
  );
}
