// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const {enviarCorreosPld, enviarCorreosPldSapi} = require('../controllers/usuarioController');

router.get('/pld-correos-siagro', enviarCorreosPld);
router.get('/pld-correos-sapi', enviarCorreosPldSapi);





module.exports = router;
