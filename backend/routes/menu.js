const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /api/menu/:comedorId → menú del día del comedor
router.get("/:comedorId", async (req, res) => {
  const { comedorId } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT md.id AS menu_id, p.nombre, p.descripcion, p.precio, p.disponible, md.cantidad_disponible
       FROM menu_dia md
       JOIN platos p ON md.plato_id = p.id
       WHERE md.comedor_id = $1 AND md.fecha = CURRENT_DATE
       ORDER BY p.nombre`,
      [comedorId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener el menú del día" });
  }
});

module.exports = router;
