const mongoose = require('mongoose');

// Definindo o molde do Usuário (Schema)
const UserSchema = new mongoose.Schema({
    nome: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    endereco: { 
        type: String 
    },
    senha: { 
        type: String, 
        required: true 
    },
    // Campo para identificar se é 'cliente' ou 'parceiro' (Farmácia)
    tipo: { 
        type: String, 
        enum: ['cliente', 'parceiro'], 
        default: 'cliente' 
    },
    dataCadastro: { 
        type: Date, 
        default: Date.now 
    }
});

// Exportando o modelo para ser usado no app.js
module.exports = mongoose.model('User', UserSchema);