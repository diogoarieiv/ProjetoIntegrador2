const express = require('express');
const router = express.Router();
const {
  listarLaboratorios,
  criarLaboratorio
} = require('../controllers/laboratorioController');

// GET /api/laboratorios → Lista todos os laboratórios
router.get('/laboratorios', listarLaboratorios);

// POST /api/laboratorios → Cria um novo laboratório
router.post('/laboratorios', criarLaboratorio);

module.exports = router;
