
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const pdfMake = require('pdfmake');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');

const pruebasCartera = async (filteredResults, otrasalertas, basededatos) => {
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
      

        const fonts = {
            Roboto: {
                normal: path.join(__dirname, 'fonts', 'Roboto-Regular.ttf'),
                bold: path.join(__dirname, 'fonts', 'Roboto-Bold.ttf'),
                italics: path.join(__dirname, 'fonts', 'Roboto-Italic.ttf'),
                bolditalics: path.join(__dirname, 'fonts', 'Roboto-BoldItalic.ttf'),
            },
        };

        
        

        const mailOptions = {
            from: 'sistemas@siemprendemos.com.mx',
            to: 'alma.pm.archivos@gmail.com',
            subject: `Cartera `,
            html: `
            <div style="background-color: #f6f6f6; padding: 20px;">
                <div style="max-width: 800px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #ddd;">
                    <div style="background-color: #00336a; padding: 20px; text-align: center;">
                        <h1 style="color: #ffffff; font-size: 24px;">Comercizalizador</h1>
                    </div>
                    <div style="padding: 40px; text-align: center;">
                        <h2 style="color: #333333; font-size: 20px;">Operaciones, cambios y consultas al cierre del día de hoy con fecha:</h2>
                        <h2 style="color: #333333; font-size: 20px;">aqui poner la fecha</h2>
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
                    filename: pdfFilename,
                    path: pdfPath,
                    contentType: 'application/pdf'
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        fs.unlinkSync(pdfPath);
        
    } catch (error) {
        console.error("Error al enviar el correo de verificación:", error);
        throw new Error("Error al enviar el correo de verificación.");
    }
};

module.exports = { pruebasCartera };