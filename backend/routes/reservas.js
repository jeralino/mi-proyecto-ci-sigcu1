const express = require("express");
const router = express.Router();
const pool = require("../db");

// POST /api/reservas → reservar un menú
router.post("/", async (req, res) => {
  const { usuario_id, menu_id } = req.body;

  if (!usuario_id || !menu_id) {
    return res.status(400).json({ error: "usuario_id y menu_id son requeridos" });
  }

  try {
    // Verificar disponibilidad
    const { rows } = await pool.query(
      "SELECT cantidad_disponible FROM menu_dia WHERE id = $1",
      [menu_id]
    );

    if (rows.length === 0) return res.status(404).json({ error: "Menú no encontrado" });
    if (rows[0].cantidad_disponible <= 0)
      return res.status(400).json({ error: "No hay cantidad disponible" });

    // Crear reserva
    const { rows: reservaRows } = await pool.query(
      `INSERT INTO reservas (usuario_id, menu_id) VALUES ($1, $2) RETURNING id`,
      [usuario_id, menu_id]
    );

    // Actualizar inventario del menú
    await pool.query(
      "UPDATE menu_dia SET cantidad_disponible = cantidad_disponible - 1 WHERE id = $1",
      [menu_id]
    );

    res.json({ message: "Reserva creada", reserva_id: reservaRows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear reserva" });
  }
});

// DELETE /api/reservas/:reservaId → cancelar reserva
router.delete("/:reservaId", async (req, res) => {
  const { reservaId } = req.params;

  try {
    // Obtener menu_id de la reserva
    const { rows } = await pool.query(
      "SELECT menu_id FROM reservas WHERE id = $1",
      [reservaId]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Reserva no encontrada" });

    const menu_id = rows[0].menu_id;

    // Eliminar reserva
    await pool.query("DELETE FROM reservas WHERE id = $1", [reservaId]);

    // Incrementar cantidad disponible en menu
    await pool.query(
      "UPDATE menu_dia SET cantidad_disponible = cantidad_disponible + 1 WHERE id = $1",
      [menu_id]
    );

    res.json({ message: "Reserva cancelada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al cancelar reserva" });
  }
});

module.exports = router;
