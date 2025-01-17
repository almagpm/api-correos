const ExcelJS = require('exceljs');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const pruebasCartera = async (listaAcomodadas, cabecera) => {
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
        const completa = new Date();
        const mes = completa.toLocaleString('default', { month: 'long' });
        const anio = completa.getFullYear();


        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Cartera');


        worksheet.mergeCells('A1:CJ1'); 
        const tituloCell = worksheet.getCell('A1');
        tituloCell.value = `CARTERA DE CRÉDITO COMERCIALIZADORA ${mes.toUpperCase()} DE ${anio}`;
        tituloCell.font = { bold: true, size: 14, color: { argb: 'FFFFFF' } };
        tituloCell.alignment = { horizontal: 'left', vertical: 'middle' };
        tituloCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00336A' } };

        worksheet.mergeCells('A2:CJ2'); 
        const fechaCell = worksheet.getCell('A2');
        fechaCell.value = `Fecha de Impresión: ${hoy}`;
        fechaCell.font = { bold: true, size: 12, color: { argb: 'FFFFFF' } };
        fechaCell.alignment = { horizontal: 'left', vertical: 'middle' };
        fechaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00336A' } };

        // Crear la cabecera de las columnas
        worksheet.addRow(cabecera);
        const headerRow = worksheet.getRow(3); // Cabecera en la fila 4
        headerRow.eachCell((cell, colNumber) => {
            cell.font = { bold: true, color: { argb: '000000' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9B3FF' } };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            worksheet.getColumn(colNumber).width = 20; 
        });


        listaAcomodadas.forEach((data) => {
            worksheet.addRow(Object.values(data)); 
        });

        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });
        });

        const excelFilename = `Cartera-SIAGRO-${hoy}.xlsx`;
        const excelPath = path.join(__dirname, excelFilename);
        await workbook.xlsx.writeFile(excelPath);

        const mailOptions = {
            from: 'sistemas@siemprendemos.com.mx',
            to: ['alma.pm.archivos@gmail.com', 'contabilidadsiemprendemos_cdr@siemprendemos.com.mx', 'direccion@ibtmx.com'],
            subject: `Cartera SIAGRO ${hoy}`,
            html: `
            <div style="background-color: #f6f6f6; padding: 20px;">
                <div style="max-width: 800px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #ddd;">
                    <div style="background-color: #00336a; padding: 20px; text-align: center;">
                        <h1 style="color: #ffffff; font-size: 24px;">SAPI</h1>
                    </div>
                    <div style="padding: 40px; text-align: center;">
                        <h2 style="color: #333333; font-size: 20px;">Cartera del día:</h2>
                        <h2 style="color: #333333; font-size: 20px;">${hoy}</h2>
                        <br>
                        <h3 style="color: #333333; text-align: center;">Se encuentra adjunto el archivo de cartera en este correo</h3>
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
                    filename: excelFilename,
                    path: excelPath,
                    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                },
            ],
        };

        // Enviar correo
        await transporter.sendMail(mailOptions);

        // Eliminar archivo temporal
        fs.unlinkSync(excelPath);

        console.log('Correo enviado con éxito.');
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        throw new Error('Error al enviar el correo.');
    }
};



const sinPreCierre = async () => {
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


        
        // Generar un archivo temporal
        const hoy = new Date().toISOString().split('T')[0];

        

        // Opciones del correo
        const mailOptions = {
            from: 'sistemas@siemprendemos.com.mx',
            to: ['alma.pm.archivos@gmail.com', 'contabilidadsiemprendemos_cdr@siemprendemos.com.mx', 'direccion@ibtmx.com'],
            subject: `Cartera SAPI ${hoy}`,
            html: `
            <div style="background-color: #f6f6f6; padding: 20px;">
                <div style="max-width: 800px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #ddd;">
                    <div style="background-color: #00336a; padding: 20px; text-align: center;">
                        <h1 style="color: #ffffff; font-size: 24px;">SAPI</h1>
                    </div>
                    <div style="padding: 40px; text-align: center;">
                        <h2 style="color: #333333; font-size: 20px;">Cartera del día:</h2>
                        <h2 style="color: #333333; font-size: 20px;">${hoy}</h2>
                        <br>
                        <h3 style="color: #333333; text-align: center;">No se generó la cartera debido a que no hubo un precierre disponible</h3>
                    <div style="padding: 20px; text-align: center; font-size: 12px; color: #999999;">
                        <p>Celaya, Gto.</p>
                        <p>Correo de contacto: sistemas@siemprendemos.com.mx</p>
                    </div>
                </div>
            </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        

        console.log('Correo enviado con éxito.');
    } catch (error) {
        console.error('Error al enviar el correo de verificación:', error);
        throw new Error('Error al enviar el correo de verificación.');
    }
};

module.exports = { pruebasCartera,  sinPreCierre};