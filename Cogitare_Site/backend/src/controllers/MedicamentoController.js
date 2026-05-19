const Medicamento = require('../models/Medicamento');
const { Op } = require('sequelize');

class MedicamentoController {
  
  // POST /api/medicamentos
  async create(req, res) {
    try {
      const { codigo_barras, nome, validade } = req.body;
      
      if (!codigo_barras || !validade) {
        return res.status(400).json({ erro: 'Código de barras e validade são obrigatórios' });
      }

      // Validação de formato da data (rudimentar, apenas verifica M-D-Y ou Y-M-D)
      if (isNaN(new Date(validade).getTime())) {
        return res.status(400).json({ erro: 'Formato de data inválido. Use YYYY-MM-DD' });
      }

      const medicamento = await Medicamento.create({
        codigo_barras,
        nome: nome || 'Medicamento',
        validade
      });

      return res.status(201).json({
        mensagem: 'Medicamento cadastrado com sucesso',
        id: medicamento.id
      });
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }

  // GET /api/medicamentos
  async index(req, res) {
    try {
      const medicamentos = await Medicamento.findAll({
        order: [['validade', 'ASC']]
      });
      return res.status(200).json(medicamentos);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }

  // DELETE /api/medicamentos/:id
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await Medicamento.destroy({ where: { id } });

      if (!result) {
        return res.status(404).json({ erro: 'Medicamento não encontrado' });
      }

      return res.status(200).json({ mensagem: 'Medicamento deletado com sucesso' });
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }

  // GET /api/medicamentos/alertas
  async alertas(req, res) {
    try {
      const hojeDate = new Date();
      const limiteDate = new Date();
      limiteDate.setDate(limiteDate.getDate() + 30);

      // Tratando para formato 'YYYY-MM-DD'
      const hoje = hojeDate.toISOString().split('T')[0];
      const limite = limiteDate.toISOString().split('T')[0];

      const medicamentos = await Medicamento.findAll({
        where: {
          validade: {
            [Op.lte]: limite, // <= limite
            [Op.gte]: hoje    // >= hoje
          }
        },
        order: [['validade', 'ASC']]
      });

      // Calcular dias restantes como no Python
      const alertas = medicamentos.map(med => {
        const validadeDate = new Date(med.validade);
        const diffTime = validadeDate.getTime() - new Date().getTime();
        const dias_restantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
          id: med.id,
          codigo_barras: med.codigo_barras,
          nome: med.nome,
          validade: med.validade,
          dias_restantes: dias_restantes > 0 ? dias_restantes : 0
        };
      });

      return res.status(200).json(alertas);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }

  // GET /api/medicamentos/vencidos
  async vencidos(req, res) {
    try {
      const hoje = new Date().toISOString().split('T')[0];

      const vencidosDb = await Medicamento.findAll({
        where: {
          validade: {
            [Op.lt]: hoje // < hoje
          }
        },
        order: [['validade', 'DESC']]
      });

      // Retornar no mesmo formado e com as mesmas chaves do original
      const vencidos = vencidosDb.map(med => ({
        id: med.id,
        codigo_barras: med.codigo_barras,
        nome: med.nome,
        validade: med.validade,
        data_cadastro: med.data_cadastro
      }));

      return res.status(200).json(vencidos);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }
}

module.exports = new MedicamentoController();
