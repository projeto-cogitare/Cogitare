const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Medicamento = sequelize.define('Medicamento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigo_barras: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING,
    defaultValue: 'Medicamento'
  },
  validade: {
    type: DataTypes.DATEONLY, // YYYY-MM-DD
    allowNull: false
  },
  data_cadastro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  alertado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'medicamentos',
  timestamps: false // Como já gerenciamos em 'data_cadastro', não precisamos de createdAt/updatedAt nativos por hora
});

module.exports = Medicamento;
