const { Router } = require('express');
const PontoColetaController = require('../controllers/PontoColetaController');

const coletasRoutes = Router();

coletasRoutes.get('/proximos', PontoColetaController.proximos);
coletasRoutes.post('/', PontoColetaController.create);
coletasRoutes.get('/', PontoColetaController.index);

module.exports = coletasRoutes;
