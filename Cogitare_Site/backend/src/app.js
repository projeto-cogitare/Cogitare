const express = require('express');
const cors = require('cors');
const routes = require('./routes/index');

const app = express();

// Middlewares
app.use(cors()); // Permite acesso do front-end HTML local
app.use(express.json()); // Permite receber dados JSON no req.body

// Rotas principal ('/api/...')
app.use('/api', routes);

module.exports = app;
