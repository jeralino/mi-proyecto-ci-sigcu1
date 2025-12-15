const pool = require('../db');

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
    try {
        // Consultamos ID, Nombre y Saldo de la tabla usuarios
        const result = await pool.query('SELECT id, nombre, email, rol, saldo FROM usuarios ORDER BY id ASC');
        
        // Enviamos la lista al frontend
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

// Recargar saldo (Ya que veo el botón en tu pantalla, implementémoslo de una vez)
const recargarSaldo = async (req, res) => {
    const { userId, monto } = req.body;

    try {
        // Actualizamos el saldo sumando lo que envíes
        await pool.query(
            'UPDATE usuarios SET saldo = saldo + $1 WHERE id = $2',
            [monto, userId]
        );
        res.json({ message: 'Saldo recargado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al recargar saldo' });
    }
};

module.exports = {
    obtenerUsuarios,
    recargarSaldo
};