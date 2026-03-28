const { Sequelize } = require('sequelize');
const path = require('path');

// Usando SQLite na pasta principal do backend para simular um banco local
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', '..', 'database.sqlite'),
  logging: false // Desativa logs do SQL no console para manter o terminal limpo
});

module.exports = sequelize;
