const comercializadora = require('../database2');
const createResponse = require('./response');
const util = require('util');
const query = util.promisify(comercializadora.query).bind(comercializadora);

//Importaciones para el excel


const {  pruebasCartera, sinPreCierre} = require('./correoCartera');


const carteraCredito = async (req, res) => {
    try {
        // Verificar si existe al menos un registro en la tabla precierre
        const validacionCierre = `SELECT * FROM precierre WHERE fecha_cierre = CURRENT_DATE`;
        const validacionResult = await query(validacionCierre);

        console.log("Resultados");
        console.log(validacionResult.rowCount);

        if (!validacionResult || validacionResult.rowCount === 0) {
            await sinPreCierre();
            const response = createResponse(400, null, "No hay un precierre para generar la cartera", 1);
            return res.send(response);
        }



        const consulta = `SELECT * FROM spsgenerarchivocartera_node_(CURRENT_DATE, 0, '02')`;
        const result = await query(consulta);

        
        const listaAcomodada = mapeo(result);
        const cabecera = cabeceraExcel();

        await pruebasCartera(listaAcomodada, cabecera);

        const response = createResponse(200, listaAcomodada, "Cartera generada correctamente", 0);
        res.send(response);
    } catch (err) {
        console.error(err);
        const response = createResponse(500, null, "Error al generar la cartera", 1);
        res.send(response);
    }
};


const mapeo = (data) => {
    const rows = data.rows || []; // Asegurarse de trabajar con el array
    return rows.map(row => ({
        numero_cliente: row.numero_cliente || '',
        referencia: row.referencia || '',
        ejercicio: row.ejercicio || '',
        periodo: row.periodo || '',
        fecha_cierre: row.fecha_cierre || '',
        dias_vencidos: row.dias_vencidos || '',
        saldo_credito: row.saldo_credito || '',
        saldo_capital_vigente: row.saldo_capital_vigente || '',
        saldo_capital_vencido: row.saldo_capital_vencido || '',
        interesdevnormalmenor: row.interesdevnormalmenor || '',
        interes_devengado_moratorio_menor: row.interes_devengado_moratorio_menor || '',
        saldo_total_cierre_mes: row.saldo_total_cierre_mes || '',
        interesdevnormalmayor: row.interesdevnormalmayor || '',
        interes_devengado_moratorio_mayor: row.interes_devengado_moratorio_mayor || '',
        pago_interes_periodo: row.pago_interes_periodo || '',
        pago_moratorio_periodo: row.pago_moratorio_periodo || '',
        comisiones_mes: row.comisiones_mes || '',
        fecha_ultimo_abono_capital: row.fecha_ultimo_abono_capital || '',
        pago_capital_periodo: row.pago_capital_periodo || '',
        fecha_ultimo_abono_interes: row.fecha_ultimo_abono_interes || 'N/A',
        fecha_ultima_amortizacion_pagada: row.fecha_ultima_amortizacion_pagada || 'N/A',
        importe_ultima_amortizacion: row.importe_ultima_amortizacion || '',
        vencimiento_primera_amort_no_cubierta: row.vencimiento_primera_amort_no_cubierta || '',
        bonificacion_interes_periodo: row.bonificacion_interes_periodo || '',
        bonificacion_moratorio_periodo: row.bonificacion_moratorio_periodo || '',
        amortizaciones_vencidas: row.amortizaciones_vencidas || '',
        clavecredito: row.clavecredito || '',
        monto_credito: row.monto_credito || '',
        fecha_vencimiento: row.fecha_vencimiento || '',
        dias_por_vencer: row.dias_por_vencer || '',
        tantos: row.tantos || '',
        reciprocidad: row.reciprocidad || '',
        tasa_normal: row.tasa_normal || '',
        tasa_moratoria: row.tasa_moratoria || '',
        valor_hipoteca: row.valor_hipoteca || '',
        fecha_valuacion: row.fecha_valuacion || '',
        grado_prelacion: row.grado_prelacion || '',
        otras_garantias: row.otras_garantias || '',
        porcentaje_garantiza_aval: row.porcentaje_garantiza_aval || '',
        tasa_normal_disminutiva: row.tasa_normal_disminutiva || '',
        nombre_cliente: row.nombre_cliente || '',
        rfc: row.rfc || '',
        parsona_juridica: row.parsona_juridica || '',
        sexo: row.sexo || '',
        calle: row.calle || '',
        numero: row.numero || '',
        nombre_colonia: row.nombre_colonia || '',
        localidad: row.localidad || '',
        cp: row.cp || '',
        nombre_ciudad: row.nombre_ciudad || '',
        diaspasoven: row.diaspasoven || '',
        numeroamortizaciones: row.numeroamortizaciones || '',
        frecuencia_pago: row.frecuencia_pago || '',
        tipo_pago: row.tipo_pago || '',
        pago_minimo: row.pago_minimo || '',
        saldo_exigible: row.saldo_exigible || '',
        fecha_exigible: row.fecha_exigible || '',
        fechaotorgamiento: row.fechaotorgamiento || '',
        descripcion: row.descripcion || '',
        clasificacion_contable: row.clasificacion_contable || '',
        dia_mes_cobro: row.dia_mes_cobro || '',
        condicion: row.condicion || '',
        situacion_credito: row.situacion_credito || '',
        no_reestructuras_o_renovaciones: row.no_reestructuras_o_renovaciones || '',
        tipocredito: row.tipocredito || '',
        cartera: row.cartera || '',
        nombre_estado: row.nombre_estado || '',
        zona: row.zona || '',
        nombre_sucursal: row.nombre_sucursal || '',
        garantia: row.garantia || '',
        porcentaje_eprc_montocubierto: row.porcentaje_eprc_montocubierto || '',
        porcentaje: row.porcentaje || '',
        montocalificacion: row.montocalificacion || '',
        montocubierto: row.montocubierto || '',
        montodescubierto: row.montodescubierto || '',
        eprc_cubierta: row.eprc_cubierta || '',
        eprc_descubierta: row.eprc_descubierta || '',
        eprc_total: row.eprc_total || '',
        eprc_xinteresvencidos: row.eprc_xinteresvencidos || '',
        acreditado_relacionado: row.acreditado_relacionado || '',
        tipo_acreditado_relacionado: row.tipo_acreditado_relacionado || '',
        num_suc: row.num_suc || '',
        fpago: row.fpago || '',
        amortizacion_debe: row.amortizacion_debe || 'N/A',
        tcartera: row.tcartera || '',
        entidad: row.entidad || ''
    }));
};


const cabeceraExcel = () =>{
    return [
        "No.Socio/Cliente", 
        "Referencia del Crédito", 
        "Ejercicio", 
        "Periodo", 
        "Fecha de Cierre", 
        "Dias de Mora", 
        "Saldo del Crédito", 
        "Saldo de Capital Vigente", 
        "Saldo de Capital Vencido", 
        "Int.Devengado Normal Menor", 
        "Int.Devengado Moratorio Menor al Vencido", 
        "Saldo Total al Cierre de Mes", 
        "Int.Devengado Normal Mayor (Int.Ctas de Orden)", 
        "Int.Devengado Moratorio Mayor al Vencido (Int.Ctas de Orden)", 
        "Monto (Int.del Mes)", 
        "Pago Moratorio Periodo (Int.del Mes)", 
        "Comisiones del Mes", 
        "Fecha (Ultimo Pago de Cápital)", 
        "Monto (Ultimo Pago de Cápital)", 
        "Fecha (Ultimo Pago de Intereses)", 
        "Monto (Ultimo Pago de Intereses)", 
        "Fecha (Ultima Amortización)", 
        "Importe (Ultima Amortización)", 
        "Vencimiento de la Primera Amortizacion No Cubierta", 
        "Bonificación Int.Periodo", 
        "Bonificación Moratorio Periodo", 
        "Total Amortizaciones Vencidas",
        "Identificador del Crédito", 
        "Monto Crédito", 
        "Fecha Vencimiento", 
        "Dias por Vencer", 
        "No.Tantos", 
        "Reciprocidad", 
        "Tasa de Int.Pactada", 
        "Tasa Moratoria", 
        "Hipoteca (Valor)", 
        "Fecha Valuación Garantía", 
        "Grado Prelación Garantía", 
        "Otras Garantias (muebles,derechos, etc.)(Valor de la Garantía)", 
        "Porcentaje que Garantiza el Aval", 
        "Tasa Normal Disminutiva", 
        "Nombre Socio/Cliente", 
        "RFC", 
        "Tipo de Acreditado", 
        "Genero", 
        "Calle", 
        "Número", 
        "Colonia", 
        "Localidad", 
        "CP", 
        "Municipio", 
        "Dias Traspaso Vigente a Vencida", 
        "No.Pagos Programados", 
        "Frecuencia de Pago(en días)", 
        "Tipo de Pago", 
        "Pago Mínimo", 
        "Saldo Exigible", 
        "Fecha Exigible", 
        "Fecha Otorgamiento", 
        "Tipo de Crédito", 
        "Clasificación Contable", 
        "Días Liquidación Crédito", 
        "Modalidad de Pago", 
        "Situación del Crédito", 
        "No.de Reestructuras o Renovaciones", 
        "Tipo de Cartera", 
        "Situación del Crédito", 
        "Estado", 
        "Zona", 
        "Sucursal", 
        "Garantía Crédito", 
        "% de EPRC Monto Cubierto", 
        "% de EPRC Requerida", 
        "Monto Sujeto Calificacion", 
        "Monto Cubierto", 
        "Monto Expuesto", 
        "EPRC Parte Cubierta", 
        "EPRC Parte Expuesta", 
        "EPRC TOTAL", 
        "EPRC POR INTERES VENCIDOS", 
        "Acreditado Relacionado", 
        "Tipo de Acreditado Relacionado", 
        "No.Sucursal", 
        "Plazo", 
        "Fecha Venc Ult Pago No Realizado", 
        "Clasificación de Cartera", 
        "Empresa/Promotor"
    ];
    };


module.exports = { carteraCredito };
