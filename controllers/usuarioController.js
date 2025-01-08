const siemprendemos = require('../database');
const comercializadora = require('../database2');
const comercializadora_prueba = require('../bd_pruebas/database_pc');
const siemprendemos_prueba = require('../bd_pruebas/database_ps');
const queretaro_prueba = require('../bd_pruebas/database_pq');
const createResponse = require('./response');
const util = require('util');
const jwt = require('jsonwebtoken');
const query = util.promisify(siemprendemos.query).bind(siemprendemos);
const query2 = util.promisify(comercializadora.query).bind(comercializadora);

//Bases de datos de pruebas
const query_pc = util.promisify(comercializadora_prueba.query).bind(comercializadora_prueba);
const query_ps = util.promisify(siemprendemos_prueba.query).bind(siemprendemos_prueba);
const query_pq = util.promisify(queretaro_prueba.query).bind(queretaro_prueba);

// Importa la función para enviar correos
const { sendVerificationEmail, pruebas, sendEmailPruebas} = require('./correo');

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

        //await sendVerificationEmail(emailData,groupedNotificaciones, "SIAGRO");
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

const pruebas_comercializadora = async (req, res) => {
    try {
        //CONSULTA DE PLD
        const consulta = ` SELECT * FROM vw_lista_notif_pld WHERE fechaalarma = CURRENT_DATE `;
        const result = await query_pc(consulta);

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
        
        const resultNotificaciones = await query_pc(consultaNotificaciones);

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

        await sendEmailPruebas(emailData, groupedNotificaciones, "SAPI (prueba)");

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

const pruebas_siemprendemos = async (req, res) => {
    try {
        //CONSULTA DE PLD
        const consulta = ` SELECT * FROM vw_lista_notif_pld WHERE fechaalarma = CURRENT_DATE `;
        const result = await query_ps(consulta);

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
        
        const resultNotificaciones = await query_ps(consultaNotificaciones);

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

        await sendEmailPruebas(emailData, groupedNotificaciones, "SIAGRO (prueba)");

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
const pruebas_queretaro = async (req, res) => {
    try {
        //CONSULTA DE PLD
        const consulta = ` SELECT * FROM vw_lista_notif_pld WHERE fechaalarma = CURRENT_DATE `;
        const result = await query_pq(consulta);

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
        
        const resultNotificaciones = await query_pq(consultaNotificaciones);

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

        await sendEmailPruebas(emailData, groupedNotificaciones, "Queretaro (prueba)");

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

//PARA VALIDAR EL QR CUANDO ES ESCANEADO
const verificar = async (req, res) => {
    try {
        const { token } = req.query;

        // Verificar y decodificar el token usando la clave secreta
        const decoded = jwt.verify(token, process.env.SECRET);

        console.log('Datos del token:', decoded);

        // Extraer la fecha y la base de datos
        const { fecha, basededatos } = decoded;

        // Generar el mensaje de éxito con Bootstrap
        const htmlResponse = `
            <html>
                <head>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
                </head>
                <body>
                    <div class="alert alert-success" role="alert">
                        <strong>¡Sello válido!</strong><br>
                        Fecha: ${fecha} <br>
                        Base de datos: ${basededatos}
                    </div>
                </body>
            </html>
        `;

        // Enviar la respuesta con el mensaje de éxito
        res.send(htmlResponse);

    } catch (err) {
        console.error("Error al verificar usuario:", err);

        // Generar el mensaje de error con Bootstrap
        const htmlResponse = `
            <html>
                <head>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
                </head>
                <body>
                    <div class="alert alert-warning" role="alert">
                        <strong>Error al verificar el sello:</strong><br>
                        ${err.message}
                    </div>
                </body>
            </html>
        `;

        // Enviar la respuesta con el mensaje de error
        res.send(htmlResponse);
    }
};




module.exports = {
    enviarCorreosPld,
    enviarCorreosPldSapi,
    pruebas_comercializadora,
    pruebas_siemprendemos,
    pruebas_queretaro,
    verificar
};
