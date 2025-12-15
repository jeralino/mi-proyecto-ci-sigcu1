import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaWallet, FaSignOutAlt, FaUser, FaBookOpen, FaUtensils, FaShoppingCart } from "react-icons/fa";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [facultades, setFacultades] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [saldo, setSaldo] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    fetch("http://localhost:4000/api/facultades")
      .then(res => res.json())
      .then(data => setFacultades(data))
      .catch(err => console.error(err));

    fetch(`http://localhost:4000/api/reservas/${user.id}`)
      .then(res => res.json())
      .then(data => setHistorial(data))
      .catch(err => console.error(err));

    fetch(`http://localhost:4000/api/usuarios/${user.id}`)
      .then(res => res.json())
      .then(data => setSaldo(Number(data.saldo) || 0))
      .catch(err => console.error(err));
  }, [user]);

  if (!user) return <div className="text-center mt-5 text-white">Cargando...</div>;

  return (
    <div className="d-flex flex-column align-items-center vh-100 text-white"
         style={{ background: "linear-gradient(135deg, #004e92, #000428)" }}>
      
      <header className="w-100 p-4 d-flex justify-content-between align-items-center">
        <h2 className="fw-bold d-flex align-items-center gap-2">
          <FaUser /> Bienvenido, {user.nombre}
        </h2>
        <div className="d-flex align-items-center gap-3">
          <span className="d-flex align-items-center gap-1 fw-bold text-white">
            <FaWallet /> ${saldo.toFixed(2)}
          </span>
          <button
            className="btn btn-outline-light d-flex align-items-center gap-1"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            <FaSignOutAlt /> Cerrar sesión
          </button>
        </div>
      </header>

      <main className="container mt-5 d-flex justify-content-center align-items-start flex-wrap gap-4">
        
        <div className="col-md-5 p-4 rounded-4 shadow-lg text-center"
             style={{ background: "rgba(0,0,0,0.5)" }}>
          <h4 className="d-flex justify-content-center align-items-center gap-2 mb-4">
            <FaBookOpen /> Facultades Disponibles
          </h4>
          <ul className="list-unstyled mt-2">
            {facultades.length === 0 && <li className="text-white">No hay facultades disponibles</li>}
            {facultades.map(f => (
              <li
                key={f.id}
                className="p-3 my-2 rounded-3 cursor-pointer text-white d-flex align-items-center justify-content-center gap-2"
                style={{ background: "rgba(255,255,255,0.1)", transition: "all 0.3s" }}
                onClick={() => navigate(`/comedores/${f.id}`)}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
              >
                <FaUtensils /> {f.nombre}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-md-5 p-4 rounded-4 shadow-lg text-center"
             style={{ background: "rgba(0,0,0,0.5)" }}>
          <h4 className="d-flex justify-content-center align-items-center gap-2 mb-4">
            <FaShoppingCart /> Historial de Compras
          </h4>
          <ul className="list-unstyled mt-2">
            {historial.length === 0 && <li className="text-white">No has realizado compras aún</li>}
            {historial.map(r => (
              <li
                key={r.id}
                className="p-2 my-2 rounded-3 text-white"
                style={{ background: "rgba(255,255,255,0.1)" }}
              >
                {r.plato_nombre} - {new Date(r.fecha_reserva).toLocaleDateString()} - {r.estado}
              </li>
            ))}
          </ul>
        </div>
      </main>

      <footer className="mt-auto p-3 opacity-50 text-center w-100">
        <small>© 2025 Universidad Técnica de Manabí – Sistema Comedor Inteligente</small>
      </footer>
    </div>
  );
}
