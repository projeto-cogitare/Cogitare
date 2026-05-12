const { Router } = require('express');

const MedicamentoController = require('../controllers/MedicamentoController');

const medicamentosRoutes = Router();

medicamentosRoutes.get('/alertas', MedicamentoController.alertas);
medicamentosRoutes.get('/vencidos', MedicamentoController.vencidos);
medicamentosRoutes.post('/', MedicamentoController.create);
medicamentosRoutes.get('/', MedicamentoController.index);
medicamentosRoutes.delete('/:id', MedicamentoController.delete);

module.exports = medicamentosRoutes;
