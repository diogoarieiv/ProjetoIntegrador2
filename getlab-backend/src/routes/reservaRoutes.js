const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');

// Rotas para reservas
router.get('/', reservaController.listarReservas);
router.post('/', reservaController.criarReserva);
router.put('/:id', reservaController.atualizarReserva);
router.delete('/:id', reservaController.deletarReserva);
router.get('/laboratorio/:laboratorioId', reservaController.buscarReservasPorLaboratorio);
router.get('/usuario/:usuarioId', reservaController.buscarReservasPorUsuario);
router.get('/pendentes', reservaController.buscarReservasPendentes);
router.get('/calendario/:laboratorioId/:ano/:mes', reservaController.buscarReservasPorDataLaboratorio);

module.exports = router;

