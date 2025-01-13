const comercializadora = require('../database2');
const createResponse = require('./response');
const util = require('util');
const jwt = require('jsonwebtoken');
const query = util.promisify(comercializadora.query).bind(comercializadora);




const carteraCredito = async (req, res) => {
    try {
        const consulta = ` SELECT * FROM spsgenerarchivocartera_node_(CURRENT_DATE,0,'02')`;
        const result = await query(consulta);

        
    } catch (err) {
        console.error(err);
        const response = createResponse(500, null, "Error al generar la cartera", 1);
        res.send(response);
    }
};

module.exports = { carteraCredito };
