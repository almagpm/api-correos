// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const {enviarCorreosPld, enviarCorreosPldSapi, pruebas_comercializadora, pruebas_siemprendemos, pruebas_queretaro, verificar} = require('../controllers/usuarioController');
const {carteraCredito, carteraCreditoConsolidada} = require('../controllers/carteraController');

router.get('/pld-correos-siagro', enviarCorreosPld);
router.get('/pld-correos-sapi', enviarCorreosPldSapi);
router.get('/pld-correos-pc', pruebas_comercializadora);
router.get('/pld-correos-ps', pruebas_siemprendemos);
router.get('/pld-correos-pq', pruebas_queretaro);
router.get('/validar-qr', verificar);

//Cartera credito

router.get('/carteras', carteraCredito);
router.get('/cartera-consolidada', carteraCreditoConsolidada);

module.exports = router;
