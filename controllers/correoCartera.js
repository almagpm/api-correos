const nodemailer = require('nodemailer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const pruebasCartera = async (listaAcomodadas, cabecera) => {
    try {
        // Configuración del transporter para enviar correos
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.CORREO,
                pass: process.env.CONTRASENA,
            },
        });

        // Crear un libro de Excel
        const workbook = xlsx.utils.book_new();

        // Crear una hoja a partir de los datos
        const worksheet = xlsx.utils.json_to_sheet([]);
        xlsx.utils.sheet_add_aoa(worksheet, [cabecera]); 
        xlsx.utils.sheet_add_json(worksheet, listaAcomodadas, { origin: 'A2', skipHeader: true });



        // Agregar la hoja al libro de Excel
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Cartera');

        // Generar un archivo temporal
        const hoy = new Date().toISOString().split('T')[0];
        const excelFilename = `Cartera-SIAGRO-${hoy}.xlsx`;
        const excelPath = path.join(__dirname, excelFilename);

        // Guardar el archivo en el sistema de archivos
        xlsx.writeFile(workbook, excelPath);

        // Opciones del correo
        const mailOptions = {
            from: 'sistemas@siemprendemos.com.mx',
            to: 'alma.pm.archivos@gmail.com',
            subject: `Cartera SIAGRO ${hoy}`,
            html: `
            <div style="background-color: #f6f6f6; padding: 20px;">
                <div style="max-width: 800px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #ddd;">
                    <div style="background-color: #00336a; padding: 20px; text-align: center;">
                        <h1 style="color: #ffffff; font-size: 24px;">Comercializador</h1>
                    </div>
                    <div style="padding: 40px; text-align: center;">
                        <h2 style="color: #333333; font-size: 20px;">Operaciones, cambios y consultas al cierre del día de hoy con fecha:</h2>
                        <h2 style="color: #333333; font-size: 20px;">${hoy}</h2>
                        <br>
                        <h3 style="color: #333333; text-align: center;">Operaciones relevantes / PLD Alertas</h3>
                        
                    <div style="padding: 20px; text-align: center; font-size: 12px; color: #999999;">
                        <p>Celaya, Gto.</p>
                        <p>Correo de contacto: sistemas@siemprendemos.com.mx</p>
                    </div>
                </div>
            </div>
            `,
            attachments: [
                {
                    filename: excelFilename,
                    path: excelPath,
                    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                },
            ],
        };

        // Enviar el correo
        await transporter.sendMail(mailOptions);

        // Eliminar el archivo Excel después de enviarlo
        fs.unlinkSync(excelPath);

        console.log('Correo enviado con éxito.');
    } catch (error) {
        console.error('Error al enviar el correo de verificación:', error);
        throw new Error('Error al enviar el correo de verificación.');
    }
};

module.exports = { pruebasCartera };
