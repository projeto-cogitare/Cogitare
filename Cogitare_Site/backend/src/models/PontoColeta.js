const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PontoColeta = sequelize.define('PontoColeta', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  endereco: {
    type: DataTypes.STRING,
    allowNull: false
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  tipo: {
    type: DataTypes.STRING,
    defaultValue: 'outro'
  },
  horario_funcionamento: {
    type: DataTypes.STRING,
    allowNull: true
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'pontos_coleta',
  timestamps: true // Adicionado createdAt e updatedAt nativos
});

module.exports = PontoColeta;
