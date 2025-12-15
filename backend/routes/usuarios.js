const express = require("express");
const router = express.Router();
const pool = require("../db");
const { authenticateToken, isAdmin } = require("../middleware/auth");

// GET /api/usuarios → todos los usuarios (solo admin)
router.get("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT id, nombre, email, rol, saldo FROM usuarios ORDER BY nombre");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// GET /api/usuarios/:id → obtener información de un usuario (solo admin)
router.get("/:id", authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query("SELECT id, nombre, email, rol, saldo FROM usuarios WHERE id = $1", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
});

// PUT /api/usuarios/:id/saldo → agregar saldo al usuario (solo admin)
router.put("/:id/saldo", authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { monto } = req.body;

  if (!monto || isNaN(monto) || Number(monto) <= 0) {
    return res.status(400).json({ error: "Monto inválido" });
  }

  try {
    const { rows } = await pool.query(
      "UPDATE usuarios SET saldo = saldo + $1 WHERE id = $2 RETURNING id, nombre, email, rol, saldo",
      [Number(monto), id]
    );

    if (rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar saldo" });
  }
});

module.exports = router;
