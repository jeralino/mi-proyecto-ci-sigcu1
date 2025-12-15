const bcrypt = require('bcrypt');

async function generarHash() {
  const password = 'soyyom'; // reemplaza con la contraseña que quieras
  const hash = await bcrypt.hash(password, 10); // 10 = número de salt rounds
  console.log(hash);
}

generarHash();
