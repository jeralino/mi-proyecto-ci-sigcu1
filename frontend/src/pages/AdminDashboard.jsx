import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // AGREGADO: Para proteger la ruta

function AdminPanel() {
  const navigate = useNavigate(); // AGREGADO
  const [usuarios, setUsuarios] = useState([]);
  const [userId, setUserId] = useState("");
  const [monto, setMonto] = useState("");

  // --- RECUPERAMOS EL TOKEN ---
  const token = localStorage.getItem("token"); 

  useEffect(() => {
    // Si no hay token, nos vamos al login (Seguridad básica)
    if (!token) {
        navigate('/login');
        return;
    }

    // Petición de Usuarios (AHORA CON TOKEN)
    fetch("http://localhost:4000/api/admin/usuarios", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // <--- CLAVE PARA EVITAR EL 401
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al obtener usuarios");
        return res.json();
      })
      .then(data => {
        // --- PROTECCIÓN CONTRA PANTALLA BLANCA ---
        // Verificamos si 'data' es un array antes de usarlo.
        if (Array.isArray(data)) {
            setUsuarios(data);
        } else {
            console.error("El servidor no devolvió una lista:", data);
            setUsuarios([]); // Evita el error "map is not a function"
        }
      })
      .catch(err => console.error(err));
  }, [token, navigate]);

  const recargar = async () => {
    if (!userId || !monto) {
      alert("Seleccione usuario y monto");
      return;
    }

    try {
      // Petición de Recarga (AHORA CON TOKEN)
      const res = await fetch("http://localhost:4000/api/admin/recargar", {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // <--- CLAVE PARA EVITAR EL 401
        },
        body: JSON.stringify({ userId, monto })
      });

      const data = await res.json();
      alert(data.message || data.error);
      
    } catch (error) {
      console.error(error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Panel de Administrador</h1>

      <h2>Usuarios registrados:</h2>
      {/* Agregamos una validación visual por si la lista está vacía */}
      {usuarios.length === 0 ? (
          <p>Cargando usuarios o no hay datos disponibles...</p>
      ) : (
          <select
            onChange={e => setUserId(e.target.value)}
            style={{ width: "250px", padding: "5px" }}
          >
            <option value="">Seleccione un usuario</option>
            {usuarios.map(u => (
              <option key={u.id} value={u.id}>
                {u.nombre} — Saldo: ${u.saldo}
              </option>
            ))}
          </select>
      )}

      <br /><br />

      <input
        type="number"
        placeholder="Monto a recargar"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
        style={{ padding: "5px", width: "150px" }}
      />

      <br /><br />

      <button onClick={recargar} style={{ padding: "10px 20px" }}>
        Recargar saldo
      </button>
    </div>
  );
}

export default AdminPanel;