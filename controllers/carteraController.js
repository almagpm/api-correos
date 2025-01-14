const comercializadora = require('../database2');
const createResponse = require('./response');
const util = require('util');
const query = util.promisify(comercializadora.query).bind(comercializadora);




const carteraCredito = async (req, res) => {
    try {
        const consulta = ` SELECT * FROM spsgenerarchivocartera_node_('11/01/2025',0,'02')`;
        //'11/01/2025'
        const result = await query(consulta);

        const listaAcomodada = mapeo(result);

        const response = createResponse(200, listaAcomodada, "Cartera generada correctamente", 0);
        res.send(response);
    } catch (err) {
        console.error(err);
        const response = createResponse(500, null, "Error al generar la cartera", 1);
        res.send(response);
    }
};

const mapeo = (data) => {
    return mappedResults = data.rows.map(row => {
          row.numero_cliente || '',
          row.referencia || '',
          row.ejercicio || '',
          row.periodo || '',
          row.fecha_cierre || '',
          row.dias_vencidos || '',
          row.saldo_credito || '',
          row.saldo_capital_vigente || '',
          row.saldo_capital_vencido || '',
          row.interesdevnormalmenor || '',
          row.interes_devengado_moratorio_menor || '',
          row.saldo_total_cierre_mes || '',
          row.interesdevnormalmayor || '',
          row.interes_devengado_moratorio_mayor || '',
          row.pago_interes_periodo || '',
          row.pago_moratorio_periodo || '',
          row.comisiones_mes || '',
          row.fecha_ultimo_abono_capital || '',
          row.pago_capital_periodo || '',
          row.fecha_ultimo_abono_interes || 'N/A',
          row.fecha_ultima_amortizacion_pagada || 'N/A',
          row.importe_ultima_amortizacion || '',
          row.vencimiento_primera_amort_no_cubierta || '',
          row.bonificacion_interes_periodo || '',
          row.bonificacion_moratorio_periodo || '',
          row.amortizaciones_vencidas || '',
          row.clavecredito || '',
          row.monto_credito || '',
          row.fecha_vencimiento || '',
          row.dias_por_vencer || '',
          row.tantos || '',
          row.reciprocidad || '',
          row.tasa_normal || '',
          row.tasa_moratoria || '',
          row.valor_hipoteca || '',
          row.fecha_valuacion || '',
          row.grado_prelacion || '',
          row.otras_garantias || '',
          row.porcentaje_garantiza_aval || '',
          row.tasa_normal_disminutiva || '',
          row.nombre_cliente || '',
          row.rfc || '',
          row.parsona_juridica || '',
          row.sexo || '',
          row.calle || '',
          row.numero || '',
          row.nombre_colonia || '',
          row.localidad || '',
          row.cp || '',
          row.nombre_ciudad || '',
          row.diaspasoven || '',
          row.numeroamortizaciones || '',
          row.frecuencia_pago || '',
          row.tipo_pago || '',
          row.pago_minimo || '',
          row.saldo_exigible || '',
          row.fecha_exigible || '',
          row.fechaotorgamiento || '',
          row.descripcion || '',
          row.clasificacion_contable || '',
          row.dia_mes_cobro || '',
          row.condicion || '',
          row.situacion_credito || '',
          row.no_reestructuras_o_renovaciones || '',
          row.tipocredito || '',
          row.cartera || '',
          row.nombre_estado || '',
          row.zona || '',
          row.nombre_sucursal || '',
          row.garantia || '',
          row.porcentaje_eprc_montocubierto || '',
          row.porcentaje || '',
          row.montocalificacion || '',
          row.montocubierto || '',
          row.montodescubierto || '',
          row.eprc_cubierta || '',
          row.eprc_descubierta || '',
          row.eprc_total || '',
          row.eprc_xinteresvencidos || '',
          row.acreditado_relacionado || '',
          row.tipo_acreditado_relacionado || '',
          row.num_suc || '',
          row.fpago || '',
          row.amortizacion_debe || 'N/A',
          row.tcartera || '',
          row.entidad || ''
      });
};

module.exports = { carteraCredito };
