const express = require('express');
const router = express.Router();
const registroController = require('../controllers/registroController');

// Rotas para registros
router.get('/', registroController.listarRegistros);
router.post('/', registroController.criarRegistro);
router.get('/docente/:email', registroController.buscarRegistrosPorDocente);
router.get('/data/:data', registroController.buscarRegistrosPorData);
router.get('/status/:status', registroController.buscarRegistrosPorStatus);
router.get('/estatisticas', registroController.obterEstatisticas);
router.delete('/:id', registroController.deletarRegistro);

module.exports = router;

