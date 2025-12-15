const pool = require('../db');

async function getMenuDia(req, res) {
  try {
    const query = `
      SELECT md.id, md.fecha, md.cantidad_disponible,
             p.nombre AS plato, p.descripcion AS plato_descripcion,
             c.nombre AS comedor
      FROM menu_dia md
      JOIN platos p ON md.plato_id = p.id
      JOIN comedores c ON md.comedor_id = c.id
      ORDER BY md.fecha, c.nombre, p.nombre;
    `;

    const { rows } = await pool.query(query);
    res.json({ ok: true, menu: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo el menú del día' });
  }
}

module.exports = { getMenuDia };
