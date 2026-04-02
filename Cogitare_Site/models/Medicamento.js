const mongoose = require("mongoose");

const MedicamentoSchema = new mongoose.Schema({
  nome: { 
    type: String, 
    required: true 
  },
  //  Alterado de 'dosagem' para 'tipo' para bater com o <select name="tipo"> do seu HTML
  tipo: { 
    type: String, 
    required: true 
  },
  validade: { 
    type: Date, 
    required: true 
  }, 
  dataCadastro: { 
    type: Date, 
    default: Date.now 
  },
  usuarioId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
});

module.exports = mongoose.model("Medicamento", MedicamentoSchema);