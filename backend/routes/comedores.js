const express = require("express"); 
const router = express.Router();
const pool = require("../db");

// GET /api/comedores → todos los comedores
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM comedores ORDER BY nombre");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener comedores" });
  }
});

// GET /api/comedores/facultad/:facultadId → comedores de una facultad específica
router.get("/facultad/:facultadId", async (req, res) => {
  const { facultadId } = req.params;

  if (!facultadId || isNaN(facultadId)) {
    return res.status(400).json({ error: "ID de facultad inválido" });
  }

  try {
    const { rows } = await pool.query(
      "SELECT * FROM comedores WHERE id_facultad = $1 ORDER BY nombre",
      [facultadId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener comedores de la facultad" });
  }
});

// GET /api/comedores/:id → un comedor por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "ID de comedor inválido" });
  }

  try {
    const { rows } = await pool.query("SELECT * FROM comedores WHERE id = $1", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Comedor no encontrado" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener el comedor" });
  }
});

// GET /api/comedores/menu/:id → menú del día de un comedor
router.get("/menu/:id", async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "ID de comedor inválido" });
  }

  try {
    const { rows } = await pool.query(`
      SELECT md.id AS menu_id, md.fecha, p.id AS plato_id, p.nombre, p.descripcion, p.precio, p.disponible
      FROM menu_dia md
      JOIN platos p ON md.plato_id = p.id
      WHERE md.comedor_id = $1 AND md.fecha = CURRENT_DATE
      ORDER BY p.nombre
    `, [id]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener el menú del día" });
  }
});

module.exports = router;
