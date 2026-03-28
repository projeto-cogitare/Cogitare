const { Router } = require('express');

const medicamentosRoutes = require('./medicamentos.routes');
const coletasRoutes = require('./coletas.routes');

const routes = Router();

// /api...
routes.use('/medicamentos', medicamentosRoutes);
routes.use('/pontos-coleta', coletasRoutes);

// Helper para testes de Saúde (health check da api)
routes.get('/health', (req, res) => {
    return res.status(200).json({ status: 'ok', mensagem: 'API Node.js funcionando em MVC' });
});

module.exports = routes;
