import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaUtensils, FaArrowLeft } from "react-icons/fa";

export default function Comedores() {
  const { facultadId } = useParams();
  const navigate = useNavigate();
  const [comedores, setComedores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!facultadId) return;

    fetch(`http://localhost:4000/api/comedores/facultad/${facultadId}`)
      .then(res => res.json())
      .then(data => {
        setComedores(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [facultadId]);

  if (loading) return <div className="text-center mt-5 text-white fs-4">Cargando...</div>;

  return (
    <div
      className="d-flex flex-column align-items-center min-vh-100 text-white p-4"
      style={{ 
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)", 
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" 
      }}
    >
      {/* Header */}
      <header className="w-100 d-flex justify-content-between align-items-center mb-4">
        <button
          className="btn btn-outline-light d-flex align-items-center gap-2 fw-semibold"
          onClick={() => navigate("/dashboard")}
          style={{ transition: "0.3s" }}
        >
          <FaArrowLeft /> Volver
        </button>
        <h2 className="fw-bold text-white text-shadow">Comedores de la Facultad</h2>
        <div></div>
      </header>

      {/* Comedores */}
      <main className="container d-flex flex-wrap justify-content-center gap-4">
        {comedores.length === 0 && (
          <p className="text-white fs-5 text-center w-100 mt-5">
            No hay comedores disponibles en esta facultad
          </p>
        )}
        {comedores.map(c => (
          <div
            key={c.id}
            className="col-md-3 p-4 rounded-4 cursor-pointer d-flex flex-column align-items-center text-center glass-card"
            onClick={() => navigate(`/comedor/${c.id}`)}
          >
            <FaUtensils size={50} className="mb-3 gradient-icon" />
            <h5 className="fw-bold mb-2">{c.nombre}</h5>
            <span className={`px-3 py-1 rounded-pill fw-semibold ${c.abierto ? 'open' : 'closed'}`}>
              {c.abierto ? "Abierto" : "Cerrado"}
            </span>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="mt-auto p-3 opacity-50 text-center w-100">
        <small>© 2025 Universidad Técnica de Manabí – Sistema Comedor Inteligente</small>
      </footer>

      {/* Estilos CSS internos */}
      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.4);
          transition: all 0.3s ease;
        }
        .glass-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 15px 30px rgba(0,0,0,0.6);
          background: rgba(255, 255, 255, 0.15);
        }
        .gradient-icon {
          background: linear-gradient(45deg, #ff512f, #dd2476);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .text-shadow {
          text-shadow: 2px 2px 6px rgba(0,0,0,0.7);
        }
        .open {
          background-color: #4caf50;
          color: white;
        }
        .closed {
          background-color: #f44336;
          color: white;
        }
      `}</style>
    </div>
  );
}
