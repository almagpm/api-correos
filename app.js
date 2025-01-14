require('dotenv').config();
const express = require('express');
const app = express();


const correosRoutes = require('./routes/correosRoutes');
app.use('/correos', correosRoutes);


const port = process.env.PORT || 3006;
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

console.log('Servidor inicializado');
