const siemprendemos = require('../database');
const comercializadora = require('../database2');
const createResponse = require('./response');
const util = require('util');
const query = util.promisify(siemprendemos.query).bind(siemprendemos);
const query2 = util.promisify(comercializadora.query).bind(comercializadora);

// Importa la función para enviar correos
const { sendVerificationEmail, sendVerificationEmailSiemprendemos, sendVerificationEmailGerenteIbt, pruebas} = require('./correo');

const enviarCorreosPld = async (req, res) => {
    try {
        //CONSULTA DE PLD
        const consulta = ` SELECT * FROM vw_lista_notif_pld WHERE fechaalarma = CURRENT_DATE `;
        const result = await query(consulta);

        const data = Array.isArray(result) ? result : result.rows;

        const emailData = data.length > 0 ? data : [{ mensaje: "No hay alertas" }];
        // SE TERMINA EL PLD

        //INICIA EL DE CORREOS DIVERSOS
        const consultaNotificaciones = `
            SELECT * 
            FROM vw_notificaciones
            WHERE fechaalarma = CURRENT_DATE
            ORDER BY fechaalarma DESC
        `;
        const tiposNotificaciones = [
            { tipo: "Cambio de Datos" },
            { tipo: "Cambio de Riesgo" },
            { tipo: "Consulta Tipo de Cambio" },
            { tipo: "Operaciones Inusuales" }
        ];
        
        const resultNotificaciones = await query(consultaNotificaciones);

        const dataNotificaciones = Array.isArray(resultNotificaciones) ? resultNotificaciones : resultNotificaciones.rows;
        // Agrupa por tipo
        const groupedNotificaciones = tiposNotificaciones.map(tipo => {
            const notificacionesPorTipo = dataNotificaciones.filter(n => n.tipo === tipo.tipo);
            return {
                tipo: tipo.tipo,
                notificaciones: notificacionesPorTipo.length > 0 ? notificacionesPorTipo : [{ mensaje: "No hay alertas" }]
            };
        });


        //TERMINA EL DE CORREO DE DIVERSOS

        await sendVerificationEmail(emailData,groupedNotificaciones, "SIAGRO");
        await sendVerificationEmailSiemprendemos(emailData, groupedNotificaciones, "SIAGRO");
	    await sendVerificationEmailGerenteIbt(emailData, groupedNotificaciones, "SIAGRO");
        await pruebas(emailData, groupedNotificaciones, "SIAGRO");

        const responseMessage = data.length > 0 || dataNotificaciones.length > 0
            ? "Notificaciones enviadas correctamente por correo"
            : "Correo enviado con el mensaje: No hay alertas";

        const response = createResponse(200, { data, groupedNotificaciones }, responseMessage, 0);
        res.send(response);
    } catch (err) {
        console.error(err);
        const response = createResponse(500, null, "Error al obtener notificaciones o enviar correos", 1);
        res.send(response);
    }
};

const enviarCorreosPldSapi = async (req, res) => {
    try {
        //CONSULTA DE PLD
        const consulta = ` SELECT * FROM vw_lista_notif_pld WHERE fechaalarma = CURRENT_DATE `;
        const result = await query2(consulta);

        const data = Array.isArray(result) ? result : result.rows;
       

        const emailData = data.length > 0 ? data : [{ mensaje: "No hay alertas" }];
         // SE TERMINA EL PLD


         
        //INICIA EL DE CORREOS DIVERSOS
        const consultaNotificaciones = `
            SELECT * 
            FROM vw_notificaciones
            WHERE fechaalarma = CURRENT_DATE
            ORDER BY fechaalarma DESC
        `;
        const tiposNotificaciones = [
            { tipo: "Cambio de Datos" },
            { tipo: "Cambio de Riesgo" },
            { tipo: "Consulta Tipo de Cambio" },
            { tipo: "Operaciones Inusuales" }
        ];
        
        const resultNotificaciones = await query2(consultaNotificaciones);

        const dataNotificaciones = Array.isArray(resultNotificaciones) ? resultNotificaciones : resultNotificaciones.rows;
        // Agrupa por tipo
        const groupedNotificaciones = tiposNotificaciones.map(tipo => {
            const notificacionesPorTipo = dataNotificaciones.filter(n => n.tipo === tipo.tipo);
            return {
                tipo: tipo.tipo,
                notificaciones: notificacionesPorTipo.length > 0 ? notificacionesPorTipo : [{ mensaje: "No hay alertas" }]
            };
        });


        //TERMINA EL DE CORREO DE DIVERSOS

        await sendVerificationEmail(emailData, groupedNotificaciones, "SAPI");
        await sendVerificationEmailSiemprendemos(emailData, groupedNotificaciones, "SAPI");
        await sendVerificationEmailGerenteIbt(emailData,groupedNotificaciones, "SAPI");
        await pruebas(emailData, groupedNotificaciones, "SAPI");

        const responseMessage = data.length > 0 || dataNotificaciones.length > 0
            ? "Notificaciones enviadas correctamente por correo"
            : "Correo enviado con el mensaje: No hay alertas";

        const response = createResponse(200, { data, groupedNotificaciones }, responseMessage, 0);
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
