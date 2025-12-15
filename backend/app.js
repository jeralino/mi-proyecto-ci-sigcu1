// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const facultadRoutes = require('./routes/facultades');
const comedoresRoutes = require("./routes/comedores");
const usuariosRoutes = require("./routes/usuarios");
const reservasRoutes = require("./routes/reservas");
const menuRouter = require("./routes/menu");
const adminRoutes = require("./routes/admin");

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/facultades', facultadRoutes);
app.use("/api/comedores", comedoresRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/reservas", reservasRoutes);
app.use("/api/menu", menuRouter);
app.use("/api/admin", adminRoutes); 


// Ruta pública de prueba
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'API Comida Universitaria funcionando' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
