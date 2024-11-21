const { Client } = require('pg');

const client = new Client({
  host: 'f-andromeda.c6ncukethveq.us-east-2.rds.amazonaws.com',
  user: 'postgres',
  password: 'l1tq71Ob*c5M&2m',
  database: 'siemprendemos',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});


client.connect((err) => {
  if (err) {
    console.error('Error de conexión:', err.message);
  } else {
    console.log('Conexión exitosa a la base de datos siemprendemos');
  }
});

module.exports = client; // Asegúrate de exportar 'client'
