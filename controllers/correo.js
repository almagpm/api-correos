const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const pdfMake = require('pdfmake');
const QRCode = require('qrcode');


const pruebas = async (filteredResults, otrasalertas, basededatos) => {
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
        const pdfFilename = `Reporte_${hoy}-${basededatos}.pdf`;
        const pdfPath = path.join(__dirname, pdfFilename);


         // Generar el QR con la información
         const qrData = `Emitido el ${hoy} desde la base de datos: ${basededatos}`;
         const qrImage = await QRCode.toDataURL(qrData); // Genera una imagen en formato DataURL
 

        // Configuración de fuentes
        // Configurar las fuentes
        const fonts = {
            Roboto: {
                normal: path.join(__dirname, 'fonts', 'Roboto-Regular.ttf'),
                bold: path.join(__dirname, 'fonts', 'Roboto-Bold.ttf'),
                italics: path.join(__dirname, 'fonts', 'Roboto-Italic.ttf'),
                bolditalics: path.join(__dirname, 'fonts', 'Roboto-BoldItalic.ttf'),
            },
        };

        const printer = new pdfMake(fonts);

        // Validación de alertas
        const noHayAlertasPLD = filteredResults[0]?.mensaje === "No hay alertas";

        // Contenido del documento
        const docDefinition = {
            content: [
                { text: basededatos, style: 'header' },
                { text: `Reporte del día: ${hoy}`, style: 'subheader' },
                { text: '\nOperaciones relevantes / PLD Alertas', style: 'tableHeader' },
                noHayAlertasPLD
                    ? {
                        text: 'No hay alertas relevantes para el día de hoy.',
                        style: 'noAlerts',
                        margin: [0, 10, 0, 10],
                    }
                    : {
                        table: {
                            headerRows: 1,
                            widths: ['auto', 'auto', '*', '*'],
                            body: [
                                ['Cliente', 'Fecha', 'Tipo', 'Motivo'], // Headers
                                ...filteredResults.map(item => [
                                    item.numero_cliente || "N/A",
                                    item.fechaalarma
                                        ? new Date(item.fechaalarma).toLocaleDateString()
                                        : "Fecha no disponible",
                                    item.tipo || "N/A",
                                    item.motivo || "N/A",
                                ]),
                            ],
                        },
                        layout: 'lightHorizontalLines',
                    },
                { text: '\nOtras Alertas', style: 'tableHeader' },
                ...otrasalertas.flatMap(group => {
                    const noHayNotificaciones =
                        group.notificaciones[0]?.mensaje === "No hay alertas";

                    return [
                        {
                            text: group.tipo,
                            style: 'groupTitle',
                            margin: [0, 10, 0, 5],
                        },
                        noHayNotificaciones
                            ? {
                                text: 'No hay alertas para el día de hoy.',
                                style: 'noAlerts',
                                margin: [0, 5, 0, 10],
                            }
                            : {
                                table: {
                                    headerRows: 1,
                                    widths: ['auto', 'auto', '*', '*'],
                                    body: [
                                        ['Cliente', 'Fecha', 'Tipo', 'Motivo'], // Headers
                                        ...group.notificaciones.map(item => [
                                            item.numero_cliente || "N/A",
                                            item.fechaalarma
                                                ? new Date(item.fechaalarma).toLocaleDateString()
                                                : "Fecha no disponible",
                                            item.tipo || "N/A",
                                            item.motivo || "N/A",
                                        ]),
                                    ],
                                },
                                layout: 'lightHorizontalLines',
                            },
                    ];
                }),
                {
                    text: '                   ',
                    style: 'noAlerts',
                    margin: [0, 10, 0, 10],
                },
                // Sello de validación y QR
                { text: '\nSello de validación de documento:           ', style: 'sello', alignment: 'right' },
                {
                    image: qrImage,
                    width: 100,
                    height: 100,
                    alignment: 'right',
                    margin: [0, 10, 20, 20],
                },
                { text: '\nCelaya, Gto.', style: 'footer' },
                { text: 'Correo de contacto: sistemas@siemprendemos.com.mx', style: 'footer' },
            ],
            styles: {
                header: { fontSize: 18, bold: true, alignment: 'center' },
                subheader: { fontSize: 14, margin: [0, 10, 0, 10], alignment: 'center' },
                tableHeader: { bold: true, fontSize: 12, color: 'black', margin: [0, 10, 0, 5] },
                groupTitle: { fontSize: 12, bold: true },
                sello: { fontSize: 10, alignment: 'center', color: 'gray' },
                noAlerts: { italics: true, alignment: 'center', margin: [0, 5, 0, 5] },
                footer: { fontSize: 10, alignment: 'center', color: 'gray', margin: [0, 20, 0, 0] },
            },
        };

        // Crear el PDF
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(fs.createWriteStream(pdfPath));
        pdfDoc.end();




        let tableRowsPLD; // Declaración inicial

        if (filteredResults[0]?.mensaje === "No hay alertas") {
            tableRowsPLD = `
                <tr style="text-align: center;">
                    <td colspan="4" style="padding: 10px; border: 1px solid #ddd;">No hay alertas para el día de hoy</td>
                </tr>
            `;
        } else {
            // Asignar el valor directamente en lugar de redeclarar con `const`
            tableRowsPLD = filteredResults.map(item => {
                const fechaAlarma = item.fechaalarma ? new Date(item.fechaalarma) : null;
                const fechaAlarmaString = fechaAlarma ? fechaAlarma.toISOString().split('T')[0] : 'Fecha no disponible';

                return `
                    <tr style="text-align: center;">
                        <td style="padding: 10px; border: 1px solid #ddd;">${item.numero_cliente} - ${item.nombre_cliente}</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${fechaAlarmaString}</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${item.tipo}</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${item.motivo}</td>
                    </tr>
                `;
            }).join('');
        }

        // Manejo de tabla para otras alertas
        const notificacionesHTML = otrasalertas.map(group => {
            const tableRowsNotificaciones = group.notificaciones[0]?.mensaje === "No hay alertas"
                ? `
                    <tr style="text-align: center;">
                        <td colspan="4" style="padding: 10px; border: 1px solid #ddd;">No hay alertas para el día de hoy</td>
                    </tr>
                `
                : group.notificaciones.map(item => {
                    const fechaAlarma = item.fechaalarma ? new Date(item.fechaalarma) : null;
                    const fechaAlarmaString = fechaAlarma ? fechaAlarma.toISOString().split('T')[0] : 'Fecha no disponible';

                    return `
                        <tr style="text-align: center;">
                            <td style="padding: 10px; border: 1px solid #ddd;">${item.numero_cliente || 'N/A'}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${fechaAlarmaString}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${item.tipo || 'N/A'}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${item.motivo || 'N/A'}</td>
                        </tr>
                    `;
                }).join('');

            return `
                <h3 style="color: #333333; text-align: center;">${group.tipo} </h3>
                <table style="margin: 20px auto; border-collapse: collapse; width: 100%; max-width: 500px; text-align: left; border: 1px solid #ddd;">
                    <thead>
                        <tr style="background-color: #00336a; color: #ffffff; text-align: center;">
                            <th style="padding: 10px; border: 1px solid #ddd;">Cliente</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Fecha</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Tipo</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Motivo</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRowsNotificaciones}
                    </tbody>
                </table>
            `;
        }).join('');

        const mailOptions = {
            from: 'sistemas@siemprendemos.com.mx',
            to: 'alma.pm.archivos@gmail.com',
            subject: `Reporte diario de operaciones y cambios - ${basededatos} - ${hoy}`,
            html: `
            <div style="background-color: #f6f6f6; padding: 20px;">
                <div style="max-width: 800px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #ddd;">
                    <div style="background-color: #00336a; padding: 20px; text-align: center;">
                        <h1 style="color: #ffffff; font-size: 24px;">${basededatos}</h1>
                    </div>
                    <div style="padding: 40px; text-align: center;">
                        <h2 style="color: #333333; font-size: 20px;">Operaciones, cambios y consultas al cierre del día de hoy con fecha:</h2>
                        <h2 style="color: #333333; font-size: 20px;">${hoy}</h2>
                        <br>
                        <h3 style="color: #333333; text-align: center;">Operaciones relevantes / PLD Alertas</h3>
                        <table style="margin: 20px auto; border-collapse: collapse; width: 100%; max-width: 500px; text-align: left; border: 1px solid #ddd;">
                            <thead>
                                <tr style="background-color: #00336a; color: #ffffff; text-align: center;">
                                    <th style="padding: 10px; border: 1px solid #ddd;">Cliente</th>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Fecha</th>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Tipo</th>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Motivo</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRowsPLD}
                            </tbody>
                        </table>
                        ${notificacionesHTML}
                    </div>
                    <div style="padding: 20px; text-align: center; font-size: 12px; color: #999999;">
                        <p>Celaya, Gto.</p>
                        <p>Correo de contacto: sistemas@siemprendemos.com.mx</p>
                    </div>
                </div>
            </div>
            `,
            attachments: [
                {
                    filename: pdfFilename,
                    path: pdfPath,
                    contentType: 'application/pdf'
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        // Eliminar el archivo PDF después de enviar el correo
        fs.unlinkSync(pdfPath);
        
    } catch (error) {
        console.error("Error al enviar el correo de verificación:", error);
        throw new Error("Error al enviar el correo de verificación.");
    }
};


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
const sendVerificationEmail = async (filteredResults, otrasalertas, basededatos) => {
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
        const pdfFilename = `Reporte_${hoy}-${basededatos}.pdf`;
        const pdfPath = path.join(__dirname, pdfFilename);


         // Generar el QR con la información
         const qrData = `Emitido el ${hoy} desde la base de datos: ${basededatos}`;
         const qrImage = await QRCode.toDataURL(qrData); // Genera una imagen en formato DataURL
 

        // Configuración de fuentes
        // Configurar las fuentes
        const fonts = {
            Roboto: {
                normal: path.join(__dirname, 'fonts', 'Roboto-Regular.ttf'),
                bold: path.join(__dirname, 'fonts', 'Roboto-Bold.ttf'),
                italics: path.join(__dirname, 'fonts', 'Roboto-Italic.ttf'),
                bolditalics: path.join(__dirname, 'fonts', 'Roboto-BoldItalic.ttf'),
            },
        };

        const printer = new pdfMake(fonts);

        // Validación de alertas
        const noHayAlertasPLD = filteredResults[0]?.mensaje === "No hay alertas";

        // Contenido del documento
        const docDefinition = {
            content: [
                { text: basededatos, style: 'header' },
                { text: `Reporte del día: ${hoy}`, style: 'subheader' },
                { text: '\nOperaciones relevantes / PLD Alertas', style: 'tableHeader' },
                noHayAlertasPLD
                    ? {
                        text: 'No hay alertas relevantes para el día de hoy.',
                        style: 'noAlerts',
                        margin: [0, 10, 0, 10],
                    }
                    : {
                        table: {
                            headerRows: 1,
                            widths: ['auto', 'auto', '*', '*'],
                            body: [
                                ['Cliente', 'Fecha', 'Tipo', 'Motivo'], // Headers
                                ...filteredResults.map(item => [
                                    item.numero_cliente || "N/A",
                                    item.fechaalarma
                                        ? new Date(item.fechaalarma).toLocaleDateString()
                                        : "Fecha no disponible",
                                    item.tipo || "N/A",
                                    item.motivo || "N/A",
                                ]),
                            ],
                        },
                        layout: 'lightHorizontalLines',
                    },
                { text: '\nOtras Alertas', style: 'tableHeader' },
                ...otrasalertas.flatMap(group => {
                    const noHayNotificaciones =
                        group.notificaciones[0]?.mensaje === "No hay alertas";

                    return [
                        {
                            text: group.tipo,
                            style: 'groupTitle',
                            margin: [0, 10, 0, 5],
                        },
                        noHayNotificaciones
                            ? {
                                text: 'No hay alertas para el día de hoy.',
                                style: 'noAlerts',
                                margin: [0, 5, 0, 10],
                            }
                            : {
                                table: {
                                    headerRows: 1,
                                    widths: ['auto', 'auto', '*', '*'],
                                    body: [
                                        ['Cliente', 'Fecha', 'Tipo', 'Motivo'], // Headers
                                        ...group.notificaciones.map(item => [
                                            item.numero_cliente || "N/A",
                                            item.fechaalarma
                                                ? new Date(item.fechaalarma).toLocaleDateString()
                                                : "Fecha no disponible",
                                            item.tipo || "N/A",
                                            item.motivo || "N/A",
                                        ]),
                                    ],
                                },
                                layout: 'lightHorizontalLines',
                            },
                    ];
                }),
                {
                    text: '                   ',
                    style: 'noAlerts',
                    margin: [0, 10, 0, 10],
                },
                // Sello de validación y QR
                { text: '\nSello de validación de documento:           ', style: 'sello', alignment: 'right' },
                {
                    image: qrImage,
                    width: 100,
                    height: 100,
                    alignment: 'right',
                    margin: [0, 10, 20, 20],
                },
                { text: '\nCelaya, Gto.', style: 'footer' },
                { text: 'Correo de contacto: sistemas@siemprendemos.com.mx', style: 'footer' },
            ],
            styles: {
                header: { fontSize: 18, bold: true, alignment: 'center' },
                subheader: { fontSize: 14, margin: [0, 10, 0, 10], alignment: 'center' },
                tableHeader: { bold: true, fontSize: 12, color: 'black', margin: [0, 10, 0, 5] },
                groupTitle: { fontSize: 12, bold: true },
                sello: { fontSize: 10, alignment: 'center', color: 'gray' },
                noAlerts: { italics: true, alignment: 'center', margin: [0, 5, 0, 5] },
                footer: { fontSize: 10, alignment: 'center', color: 'gray', margin: [0, 20, 0, 0] },
            },
        };

        // Crear el PDF
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(fs.createWriteStream(pdfPath));
        pdfDoc.end();




        let tableRowsPLD; // Declaración inicial

        if (filteredResults[0]?.mensaje === "No hay alertas") {
            tableRowsPLD = `
                <tr style="text-align: center;">
                    <td colspan="4" style="padding: 10px; border: 1px solid #ddd;">No hay alertas para el día de hoy</td>
                </tr>
            `;
        } else {
            // Asignar el valor directamente en lugar de redeclarar con `const`
            tableRowsPLD = filteredResults.map(item => {
                const fechaAlarma = item.fechaalarma ? new Date(item.fechaalarma) : null;
                const fechaAlarmaString = fechaAlarma ? fechaAlarma.toISOString().split('T')[0] : 'Fecha no disponible';

                return `
                    <tr style="text-align: center;">
                        <td style="padding: 10px; border: 1px solid #ddd;">${item.numero_cliente} - ${item.nombre_cliente}</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${fechaAlarmaString}</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${item.tipo}</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${item.motivo}</td>
                    </tr>
                `;
            }).join('');
        }

        // Manejo de tabla para otras alertas
        const notificacionesHTML = otrasalertas.map(group => {
            const tableRowsNotificaciones = group.notificaciones[0]?.mensaje === "No hay alertas"
                ? `
                    <tr style="text-align: center;">
                        <td colspan="4" style="padding: 10px; border: 1px solid #ddd;">No hay alertas para el día de hoy</td>
                    </tr>
                `
                : group.notificaciones.map(item => {
                    const fechaAlarma = item.fechaalarma ? new Date(item.fechaalarma) : null;
                    const fechaAlarmaString = fechaAlarma ? fechaAlarma.toISOString().split('T')[0] : 'Fecha no disponible';

                    return `
                        <tr style="text-align: center;">
                            <td style="padding: 10px; border: 1px solid #ddd;">${item.numero_cliente || 'N/A'}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${fechaAlarmaString}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${item.tipo || 'N/A'}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${item.motivo || 'N/A'}</td>
                        </tr>
                    `;
                }).join('');

            return `
                <h3 style="color: #333333; text-align: center;">${group.tipo} </h3>
                <table style="margin: 20px auto; border-collapse: collapse; width: 100%; max-width: 500px; text-align: left; border: 1px solid #ddd;">
                    <thead>
                        <tr style="background-color: #00336a; color: #ffffff; text-align: center;">
                            <th style="padding: 10px; border: 1px solid #ddd;">Cliente</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Fecha</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Tipo</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Motivo</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRowsNotificaciones}
                    </tbody>
                </table>
            `;
        }).join('');

        const mailOptions = {
            from: 'sistemas@siemprendemos.com.mx',
            to: ['oficialdecumplimiento@siemprendemos.com.mx','oficialcumplimiento@siemprendemos.com.mx'], // Array de correos
            subject: `Reporte diario de operaciones y cambios - ${basededatos} - ${hoy}`,
            html: `
            <div style="background-color: #f6f6f6; padding: 20px;">
                <div style="max-width: 800px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #ddd;">
                    <div style="background-color: #00336a; padding: 20px; text-align: center;">
                        <h1 style="color: #ffffff; font-size: 24px;">${basededatos}</h1>
                    </div>
                    <div style="padding: 40px; text-align: center;">
                        <h2 style="color: #333333; font-size: 20px;">Operaciones, cambios y consultas al cierre del día de hoy con fecha:</h2>
                        <h2 style="color: #333333; font-size: 20px;">${hoy}</h2>
                        <br>
                        <h3 style="color: #333333; text-align: center;">Operaciones relevantes / PLD Alertas</h3>
                        <table style="margin: 20px auto; border-collapse: collapse; width: 100%; max-width: 500px; text-align: left; border: 1px solid #ddd;">
                            <thead>
                                <tr style="background-color: #00336a; color: #ffffff; text-align: center;">
                                    <th style="padding: 10px; border: 1px solid #ddd;">Cliente</th>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Fecha</th>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Tipo</th>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Motivo</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRowsPLD}
                            </tbody>
                        </table>
                        ${notificacionesHTML}
                    </div>
                    <div style="padding: 20px; text-align: center; font-size: 12px; color: #999999;">
                        <p>Celaya, Gto.</p>
                        <p>Correo de contacto: sistemas@siemprendemos.com.mx</p>
                    </div>
                </div>
            </div>
            `,
            attachments: [
                {
                    filename: pdfFilename,
                    path: pdfPath,
                    contentType: 'application/pdf'
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        // Eliminar el archivo PDF después de enviar el correo
        fs.unlinkSync(pdfPath);
        
    } catch (error) {
        console.error("Error al enviar el correo de verificación:", error);
        throw new Error("Error al enviar el correo de verificación.");
    }
};

const sendEmailPruebas = async (filteredResults, otrasalertas, basededatos) => {
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
        const pdfFilename = `Reporte_${hoy}-${basededatos}.pdf`;
        const pdfPath = path.join(__dirname, pdfFilename);


         // Generar el QR con la información
         const qrData = `Emitido el ${hoy} desde la base de datos: ${basededatos}`;
         const qrImage = await QRCode.toDataURL(qrData); // Genera una imagen en formato DataURL
 

        // Configuración de fuentes
        // Configurar las fuentes
        const fonts = {
            Roboto: {
                normal: path.join(__dirname, 'fonts', 'Roboto-Regular.ttf'),
                bold: path.join(__dirname, 'fonts', 'Roboto-Bold.ttf'),
                italics: path.join(__dirname, 'fonts', 'Roboto-Italic.ttf'),
                bolditalics: path.join(__dirname, 'fonts', 'Roboto-BoldItalic.ttf'),
            },
        };

        const printer = new pdfMake(fonts);

        // Validación de alertas
        const noHayAlertasPLD = filteredResults[0]?.mensaje === "No hay alertas";

        // Contenido del documento
        const docDefinition = {
            content: [
                { text: basededatos, style: 'header' },
                { text: `Reporte del día: ${hoy}`, style: 'subheader' },
                { text: '\nOperaciones relevantes / PLD Alertas', style: 'tableHeader' },
                noHayAlertasPLD
                    ? {
                        text: 'No hay alertas relevantes para el día de hoy.',
                        style: 'noAlerts',
                        margin: [0, 10, 0, 10],
                    }
                    : {
                        table: {
                            headerRows: 1,
                            widths: ['auto', 'auto', '*', '*'],
                            body: [
                                ['Cliente', 'Fecha', 'Tipo', 'Motivo'], // Headers
                                ...filteredResults.map(item => [
                                    item.numero_cliente || "N/A",
                                    item.fechaalarma
                                        ? new Date(item.fechaalarma).toLocaleDateString()
                                        : "Fecha no disponible",
                                    item.tipo || "N/A",
                                    item.motivo || "N/A",
                                ]),
                            ],
                        },
                        layout: 'lightHorizontalLines',
                    },
                { text: '\nOtras Alertas', style: 'tableHeader' },
                ...otrasalertas.flatMap(group => {
                    const noHayNotificaciones =
                        group.notificaciones[0]?.mensaje === "No hay alertas";

                    return [
                        {
                            text: group.tipo,
                            style: 'groupTitle',
                            margin: [0, 10, 0, 5],
                        },
                        noHayNotificaciones
                            ? {
                                text: 'No hay alertas para el día de hoy.',
                                style: 'noAlerts',
                                margin: [0, 5, 0, 10],
                            }
                            : {
                                table: {
                                    headerRows: 1,
                                    widths: ['auto', 'auto', '*', '*'],
                                    body: [
                                        ['Cliente', 'Fecha', 'Tipo', 'Motivo'], // Headers
                                        ...group.notificaciones.map(item => [
                                            item.numero_cliente || "N/A",
                                            item.fechaalarma
                                                ? new Date(item.fechaalarma).toLocaleDateString()
                                                : "Fecha no disponible",
                                            item.tipo || "N/A",
                                            item.motivo || "N/A",
                                        ]),
                                    ],
                                },
                                layout: 'lightHorizontalLines',
                            },
                    ];
                }),
                {
                    text: '                   ',
                    style: 'noAlerts',
                    margin: [0, 10, 0, 10],
                },
                // Sello de validación y QR
                { text: '\nSello de validación de documento:           ', style: 'sello', alignment: 'right' },
                {
                    image: qrImage,
                    width: 100,
                    height: 100,
                    alignment: 'right',
                    margin: [0, 10, 20, 20],
                },
                { text: '\nCelaya, Gto.', style: 'footer' },
                { text: 'Correo de contacto: sistemas@siemprendemos.com.mx', style: 'footer' },
            ],
            styles: {
                header: { fontSize: 18, bold: true, alignment: 'center' },
                subheader: { fontSize: 14, margin: [0, 10, 0, 10], alignment: 'center' },
                tableHeader: { bold: true, fontSize: 12, color: 'black', margin: [0, 10, 0, 5] },
                groupTitle: { fontSize: 12, bold: true },
                sello: { fontSize: 10, alignment: 'center', color: 'gray' },
                noAlerts: { italics: true, alignment: 'center', margin: [0, 5, 0, 5] },
                footer: { fontSize: 10, alignment: 'center', color: 'gray', margin: [0, 20, 0, 0] },
            },
        };

        // Crear el PDF
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(fs.createWriteStream(pdfPath));
        pdfDoc.end();




        let tableRowsPLD; // Declaración inicial

        if (filteredResults[0]?.mensaje === "No hay alertas") {
            tableRowsPLD = `
                <tr style="text-align: center;">
                    <td colspan="4" style="padding: 10px; border: 1px solid #ddd;">No hay alertas para el día de hoy</td>
                </tr>
            `;
        } else {
            // Asignar el valor directamente en lugar de redeclarar con `const`
            tableRowsPLD = filteredResults.map(item => {
                const fechaAlarma = item.fechaalarma ? new Date(item.fechaalarma) : null;
                const fechaAlarmaString = fechaAlarma ? fechaAlarma.toISOString().split('T')[0] : 'Fecha no disponible';

                return `
                    <tr style="text-align: center;">
                        <td style="padding: 10px; border: 1px solid #ddd;">${item.numero_cliente} - ${item.nombre_cliente}</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${fechaAlarmaString}</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${item.tipo}</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${item.motivo}</td>
                    </tr>
                `;
            }).join('');
        }

        // Manejo de tabla para otras alertas
        const notificacionesHTML = otrasalertas.map(group => {
            const tableRowsNotificaciones = group.notificaciones[0]?.mensaje === "No hay alertas"
                ? `
                    <tr style="text-align: center;">
                        <td colspan="4" style="padding: 10px; border: 1px solid #ddd;">No hay alertas para el día de hoy</td>
                    </tr>
                `
                : group.notificaciones.map(item => {
                    const fechaAlarma = item.fechaalarma ? new Date(item.fechaalarma) : null;
                    const fechaAlarmaString = fechaAlarma ? fechaAlarma.toISOString().split('T')[0] : 'Fecha no disponible';

                    return `
                        <tr style="text-align: center;">
                            <td style="padding: 10px; border: 1px solid #ddd;">${item.numero_cliente || 'N/A'}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${fechaAlarmaString}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${item.tipo || 'N/A'}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${item.motivo || 'N/A'}</td>
                        </tr>
                    `;
                }).join('');

            return `
                <h3 style="color: #333333; text-align: center;">${group.tipo} </h3>
                <table style="margin: 20px auto; border-collapse: collapse; width: 100%; max-width: 500px; text-align: left; border: 1px solid #ddd;">
                    <thead>
                        <tr style="background-color: #FCF09F; color: #040300; text-align: center;">
                            <th style="padding: 10px; border: 1px solid #ddd;">Cliente</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Fecha</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Tipo</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Motivo</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRowsNotificaciones}
                    </tbody>
                </table>
            `;
        }).join('');

        const mailOptions = {
            from: 'sistemas@siemprendemos.com.mx',
            to: ['alma.pm.archivos@gmail.com', 'oficialdecumplimiento@siemprendemos.com.mx','oficialcumplimiento@siemprendemos.com.mx', 'direccion@ibtmx.com'],
            subject: `Entorno pruebas - Reporte diario de operaciones y cambios - ${basededatos} - ${hoy}`,
            html: `
            <div style="background-color: #f6f6f6; padding: 20px;">
                <div style="max-width: 800px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #ddd;">
                    <div style="background-color: #FCF09F; padding: 20px; text-align: center;">
                        <h1 style="color: #040300; font-size: 24px;">${basededatos}</h1>
                    </div>
                    <div style="padding: 40px; text-align: center;">
                        <h2 style="color: #333333; font-size: 20px;">Operaciones, cambios y consultas al cierre del día de hoy con fecha:</h2>
                        <h2 style="color: #333333; font-size: 20px;">${hoy}</h2>
                        <br>
                        <h3 style="color: #333333; text-align: center;">Operaciones relevantes / PLD Alertas</h3>
                        <table style="margin: 20px auto; border-collapse: collapse; width: 100%; max-width: 500px; text-align: left; border: 1px solid #ddd;">
                            <thead>
                                <tr style="background-color: #FCF09F; color: #040300; text-align: center;">
                                    <th style="padding: 10px; border: 1px solid #ddd;">Cliente</th>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Fecha</th>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Tipo</th>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Motivo</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRowsPLD}
                            </tbody>
                        </table>
                        ${notificacionesHTML}
                    </div>
                    <div style="padding: 20px; text-align: center; font-size: 12px; color: #999999;">
                        <p>Celaya, Gto.</p>
                        <p>Correo de contacto: sistemas@siemprendemos.com.mx</p>
                    </div>
                </div>
            </div>
            `,
            attachments: [
                {
                    filename: pdfFilename,
                    path: pdfPath,
                    contentType: 'application/pdf'
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        // Eliminar el archivo PDF después de enviar el correo
        fs.unlinkSync(pdfPath);
        
    } catch (error) {
        console.error("Error al enviar el correo de verificación:", error);
        throw new Error("Error al enviar el correo de verificación.");
    }
};
module.exports = { sendVerificationEmail, pruebas, sendEmailPruebas };
