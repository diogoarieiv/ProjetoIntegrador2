const express = require('express');
const router = express.Router();
const {
  listarLaboratorios,
  criarLaboratorio
} = require('../controllers/laboratorioController');

router.get('/laboratorios', listarLaboratorios);
router.post('/laboratorios', criarLaboratorio);

module.exports = router;
