const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /api/facultades → lista todas las facultades
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM facultades ORDER BY nombre");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener facultades" });
  }
});

// GET /api/facultades/:id → info de una facultad específica
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query("SELECT * FROM facultades WHERE id = $1", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Facultad no encontrada" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener la facultad" });
  }
});

module.exports = router;
