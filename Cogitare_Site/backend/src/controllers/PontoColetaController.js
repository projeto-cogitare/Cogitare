const PontoColeta = require('../models/PontoColeta');

function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raio da Terra em km
  
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distancia = R * c;
  
  return distancia;
}

class PontoColetaController {

  // GET /api/pontos-coleta
  async index(req, res) {
    try {
      const pontos = await PontoColeta.findAll();
      return res.status(200).json({
        sucesso: true,
        total: pontos.length,
        pontos
      });
    } catch (error) {
      return res.status(500).json({ sucesso: false, erro: error.message });
    }
  }

  // GET /api/pontos-coleta/proximos
  async proximos(req, res) {
    try {
      const latUsuario = parseFloat(req.query.lat);
      const lngUsuario = parseFloat(req.query.lng);
      const raioKm = parseFloat(req.query.raio) || 10;

      if (isNaN(latUsuario) || isNaN(lngUsuario)) {
        return res.status(400).json({
          sucesso: false,
          erro: 'Parâmetros lat e lng são obrigatórios e devem ser números'
        });
      }

      const todosPontos = await PontoColeta.findAll();
      
      const pontosComDistancia = [];
      
      for (const ponto of todosPontos) {
        const distancia = calcularDistancia(latUsuario, lngUsuario, ponto.latitude, ponto.longitude);
        if (distancia <= raioKm) {
          // Prepara objeto com distância arredondada para 2 casas como no Python
          const objPonto = ponto.toJSON();
          objPonto.distancia = parseFloat(distancia.toFixed(2));
          pontosComDistancia.push(objPonto);
        }
      }

      // Ordernar por distância ASC
      pontosComDistancia.sort((a, b) => a.distancia - b.distancia);

      return res.status(200).json({
        sucesso: true,
        localizacao: {
          latitude: latUsuario,
          longitude: lngUsuario,
          raio_km: raioKm
        },
        total: pontosComDistancia.length,
        pontos: pontosComDistancia
      });

    } catch (error) {
      return res.status(500).json({ sucesso: false, erro: error.message });
    }
  }

  // POST /api/pontos-coleta
  async create(req, res) {
    try {
      const { nome, endereco, latitude, longitude, tipo, horario_funcionamento, telefone } = req.body;
      
      const camposObrigatorios = ['nome', 'endereco', 'latitude', 'longitude'];
      for (const campo of camposObrigatorios) {
        if (!req.body[campo]) {
          return res.status(400).json({
            sucesso: false,
            erro: `Campo obrigatório ausente: ${campo}`
          });
        }
      }

      const ponto = await PontoColeta.create({
        nome,
        endereco,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        tipo: tipo || 'outro',
        horario_funcionamento: horario_funcionamento || '',
        telefone: telefone || ''
      });

      return res.status(201).json({
        sucesso: true,
        mensagem: 'Ponto de coleta adicionado com sucesso',
        ponto // Ponto retorna com UUID como ID (assim como no json antigo)
      });
      
    } catch (error) {
       return res.status(500).json({ sucesso: false, erro: error.message });
    }
  }
}

module.exports = new PontoColetaController();
