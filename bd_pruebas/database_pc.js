const { Client } = require('pg');

const client = new Client({
  host: 'f-andromeda.c6ncukethveq.us-east-2.rds.amazonaws.com',
  user: 'postgres',
  password: 'TRlEpc7JGjxO8mVqAwD1',
  database: 'lcomercializadora',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});


client.connect((err) => {
  if (err) {
    console.error('Error de conexión:', err.message);
  } else {
    console.log('Conexión exitosa a la base de datos de prueba comercializadora');
  }
});

module.exports = client; // Asegúrate de exportar 'client'
