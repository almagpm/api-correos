const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

/* const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, // o 465 para SSL
    secure: false, // true para puerto 465
    auth: {
        user: 'tu_correo@empresa.com',
        pass: 'tu_contraseña', // Consulta si puedes usar tu contraseña
    },
});

const mailOptions = {
    from: 'tu_correo@empresa.com',
    to: 'destinatario@dominio.com',
    subject: 'Asunto del correo',
    text: 'Contenido del correo',
};

transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
        console.error('Error al enviar correo:', err);
    } else {
        console.log('Correo enviado:', info.response);
    }
});
 */
/**
 * Envía un correo electrónico con una tabla generada dinámicamente a partir de los datos proporcionados.
 * @param {Array} filteredResults - Array de objetos con datos filtrados.
 */
const sendVerificationEmail = async (filteredResults, basededatos) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.CORREO,
                pass: process.env.CONTRASENA,
            },
        });
        const hoy = new Date().toISOString().split('T')[0];

        let tableRows;

        if (filteredResults[0]?.mensaje === "No hay alertas") {
            // Si no hay alertas, genera una fila vacía con un mensaje
            tableRows = `
                <tr style="text-align: center;">
                    <td colspan="4" style="padding: 10px; border: 1px solid #ddd;">No hay alertas para el día de hoy</td>
                </tr>
            `;
        } else {
            // Genera las filas dinámicas para la tabla a partir de los datos filtrados
            tableRows = filteredResults.map(item => `
                <tr style="text-align: center;">
                    <td style="padding: 10px; border: 1px solid #ddd;">${item.numero_cliente} - ${item.nombre_cliente}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${new Date(item.fechaalarma).toISOString().split('T')[0]}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${item.tipo}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${item.motivo}</td>
                </tr>
            `).join('');
        }

        const mailOptions = {
            from: 'sistemas@siemprendemos.com.mx',
            to: 'oficialdecumplimiento@siemprendemos.com.mx',
            subject: `Reporte diario de operaciones relevantes - ${basededatos} - ${hoy}`,
            html: `
            <div style="background-color: #f6f6f6; padding: 20px;">
                <div style="max-width: 800px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #ddd;">
                    <div style="background-color: #00336a; padding: 20px; text-align: center;">
                        <h1 style="color: #ffffff; font-size: 24px;">${basededatos}</h1>
                    </div>
                    <div style="padding: 40px; text-align: center;">
                        <h2 style="color: #333333; font-size: 20px;">Operaciones relevantes al cierre del día de hoy con fecha:</h2>
                        <h2 style="color: #333333; font-size: 20px;">${hoy}</h2>
                        <br>
                        <table style="margin: 20px auto; border-collapse: collapse; width: 100%; max-width: 500px; text-align: left; border: 1px solid #ddd;">
                            <thead>
                                <tr style="background-color: #00336a; color: #ffffff; text-align: center;">
                                    <th style="padding: 10px; border: 1px solid #ddd;">Cliente</th>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Fecha</th>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Monto</th>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Motivo</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRows}
                            </tbody>
                        </table>
                    </div>
                    <div style="padding: 20px; text-align: center; font-size: 12px; color: #999999;">
                        <p>Celaya, Gto.</p>
                        <p>Correo de contacto: sistemas@siemprendemos.com.mx</p>
                    </div>
                </div>
            </div>
            `,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error al enviar el correo de verificación:", error);
        throw new Error("Error al enviar el correo de verificación.");
    }
};

const sendVerificationEmailSiemprendemos = async (filteredResults, basededatos) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.CORREO,
                pass: process.env.CONTRASENA,
            },
        });
        const hoy = new Date().toISOString().split('T')[0];

        let tableRows;

        if (filteredResults[0]?.mensaje === "No hay alertas") {
            // Si no hay alertas, genera una fila vacía con un mensaje
            tableRows = `
                <tr style="text-align: center;">
                    <td colspan="4" style="padding: 10px; border: 1px solid #ddd;">No hay alertas para el día de hoy</td>
                </tr>
            `;
        } else {
            // Genera las filas dinámicas para la tabla a partir de los datos filtrados
            tableRows = filteredResults.map(item => `
                <tr style="text-align: center;">
                    <td style="padding: 10px; border: 1px solid #ddd;">${item.numero_cliente} - ${item.nombre_cliente}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${new Date(item.fechaalarma).toISOString().split('T')[0]}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${item.tipo}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${item.motivo}</td>
                </tr>
            `).join('');
        }

        const mailOptions = {
            from: 'sistemas@siemprendemos.com.mx',
            to: 'oficialcumplimiento@siemprendemos.com.mx',
            subject: `Reporte diario de operaciones relevantes - ${basededatos} - ${hoy}`,
            html: `
            <div style="background-color: #f6f6f6; padding: 20px;">
                <div style="max-width: 800px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #ddd;">
                    <div style="background-color: #00336a; padding: 20px; text-align: center;">
                        <h1 style="color: #ffffff; font-size: 24px;">${basededatos}</h1>
                    </div>
                    <div style="padding: 40px; text-align: center;">
                        <h2 style="color: #333333; font-size: 20px;">Operaciones relevantes al cierre del día de hoy con fecha:</h2>
                        <h2 style="color: #333333; font-size: 20px;">${hoy}</h2>
                        <br>
                        <table style="margin: 20px auto; border-collapse: collapse; width: 100%; max-width: 500px; text-align: left; border: 1px solid #ddd;">
                            <thead>
                                <tr style="background-color: #00336a; color: #ffffff; text-align: center;">
                                    <th style="padding: 10px; border: 1px solid #ddd;">Cliente</th>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Fecha</th>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Monto</th>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Motivo</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRows}
                            </tbody>
                        </table>
                    </div>
                    <div style="padding: 20px; text-align: center; font-size: 12px; color: #999999;">
                        <p>Celaya, Gto.</p>
                        <p>Correo de contacto: sistemas@siemprendemos.com.mx</p>
                    </div>
                </div>
            </div>
            `,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error al enviar el correo de verificación:", error);
        throw new Error("Error al enviar el correo de verificación.");
    }
};
const sendVerificationEmailGerenteIbt = async (filteredResults, basededatos) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.CORREO,
                pass: process.env.CONTRASENA,
            },
        });
        const hoy = new Date().toISOString().split('T')[0];

        let tableRows;

        if (filteredResults[0]?.mensaje === "No hay alertas") {
            // Si no hay alertas, genera una fila vacía con un mensaje
            tableRows = `
                <tr style="text-align: center;">
                    <td colspan="4" style="padding: 10px; border: 1px solid #ddd;">No hay alertas para el día de hoy</td>
                </tr>
            `;
        } else {
            // Genera las filas dinámicas para la tabla a partir de los datos filtrados
            tableRows = filteredResults.map(item => `
                <tr style="text-align: center;">
                    <td style="padding: 10px; border: 1px solid #ddd;">${item.numero_cliente} - ${item.nombre_cliente}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${new Date(item.fechaalarma).toISOString().split('T')[0]}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${item.tipo}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${item.motivo}</td>
                </tr>
            `).join('');
        }

        const mailOptions = {
            from: 'sistemas@siemprendemos.com.mx',
            to: 'direccion@ibtmx.com',
            subject: `Reporte diario de operaciones relevantes - ${basededatos} - ${hoy}`,
            html: `
            <div style="background-color: #f6f6f6; padding: 20px;">
                <div style="max-width: 800px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #ddd;">
                    <div style="background-color: #00336a; padding: 20px; text-align: center;">
                        <h1 style="color: #ffffff; font-size: 24px;">${basededatos}</h1>
                    </div>
                    <div style="padding: 40px; text-align: center;">
                        <h2 style="color: #333333; font-size: 20px;">Operaciones relevantes al cierre del día de hoy con fecha:</h2>
                        <h2 style="color: #333333; font-size: 20px;">${hoy}</h2>
                        <br>
                        <table style="margin: 20px auto; border-collapse: collapse; width: 100%; max-width: 500px; text-align: left; border: 1px solid #ddd;">
                            <thead>
                                <tr style="background-color: #00336a; color: #ffffff; text-align: center;">
                                    <th style="padding: 10px; border: 1px solid #ddd;">Cliente</th>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Fecha</th>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Monto</th>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Motivo</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRows}
                            </tbody>
                        </table>
                    </div>
                    <div style="padding: 20px; text-align: center; font-size: 12px; color: #999999;">
                        <p>Celaya, Gto.</p>
                        <p>Correo de contacto: sistemas@siemprendemos.com.mx</p>
                    </div>
                </div>
            </div>
            `,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error al enviar el correo de verificación:", error);
        throw new Error("Error al enviar el correo de verificación.");
    }
};
module.exports = { sendVerificationEmail, sendVerificationEmailSiemprendemos, sendVerificationEmailGerenteIbt };
