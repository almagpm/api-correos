const siemprendemos = require('../database');
const comercializadora = require('../database2');
const createResponse = require('./response');
const util = require('util');
const query = util.promisify(siemprendemos.query).bind(siemprendemos);
const query2 = util.promisify(comercializadora.query).bind(comercializadora);

// Importa la función para enviar correos
const { sendVerificationEmail, sendVerificationEmailSiemprendemos, sendVerificationEmailGerenteIbt } = require('./correo');

const enviarCorreosPld = async (req, res) => {
    try {
        const consulta = 'SELECT * FROM vw_lista_notif_pld';
        const result = await query(consulta);

        const data = Array.isArray(result) ? result : result.rows;
        const today = new Date().toISOString().split('T')[0];
        const filteredResults = data?.filter(item => {
            const fechaAlarma = new Date(item.fechaalarma).toISOString().split('T')[0];
            return fechaAlarma === today;
        }) || [];

        // Si no hay resultados filtrados, envía un correo con un mensaje de "No hay alertas".
        const emailData = filteredResults.length > 0 ? filteredResults : [{ mensaje: "No hay alertas" }];

        await sendVerificationEmail(emailData, "SIAGRO");
        await sendVerificationEmailSiemprendemos(emailData, "SIAGRO");
	await sendVerificationEmailGerenteIbt(emailData, "SIAGRO");

        const responseMessage = filteredResults.length > 0
            ? "Notificaciones enviadas correctamente por correo"
            : "Correo enviado con el mensaje: No hay alertas";

        const response = createResponse(200, filteredResults, responseMessage, 0);
        res.send(response);
    } catch (err) {
        console.error(err);
        const response = createResponse(500, null, "Error al obtener notificaciones o enviar correos", 1);
        res.send(response);
    }
};

const enviarCorreosPldSapi = async (req, res) => {
    try {
        const consulta = 'SELECT * FROM vw_lista_notif_pld';
        const result = await query2(consulta);

        const data = Array.isArray(result) ? result : result.rows;
        const today = new Date().toISOString().split('T')[0];
        const filteredResults = data?.filter(item => {
            const fechaAlarma = new Date(item.fechaalarma).toISOString().split('T')[0];
            return fechaAlarma === today;
        }) || [];

        const emailData = filteredResults.length > 0 ? filteredResults : [{ mensaje: "No hay alertas" }];

        await sendVerificationEmail(emailData, "SAPI");
        await sendVerificationEmailSiemprendemos(emailData, "SAPI");
        await sendVerificationEmailGerenteIbt(emailData, "SAPI");

        const responseMessage = filteredResults.length > 0
            ? "Notificaciones enviadas correctamente por correo"
            : "Correo enviado con el mensaje: No hay alertas";

        const response = createResponse(200, filteredResults, responseMessage, 0);
        res.send(response);
    } catch (err) {
        console.error(err);
        const response = createResponse(500, null, "Error al obtener notificaciones o enviar correos", 1);
        res.send(response);
    }
};


module.exports = {
    enviarCorreosPld,
    enviarCorreosPldSapi
};
