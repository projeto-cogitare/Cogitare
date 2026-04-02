const User = require("../models/User");

// Middleware de Segurança (Exportado para ser usado nas rotas protegidas)
exports.estaLogado = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    req.flash('error_msg', 'Acesso negado! Por favor, faça login.');
    res.redirect('/login');
};

exports.cadastro = async (req, res) => {
    try {
        const { nome, email, endereco, senha, tipo } = req.body;
        const usuarioExistente = await User.findOne({ email });

        if (usuarioExistente) {
            req.flash('error_msg', 'Este e-mail já está em uso.');
            return res.redirect('/cadastro');
        }

        await User.create({ nome, email, endereco, senha, tipo });
        req.flash('success_msg', 'Conta criada com sucesso! Faça seu login.');
        res.redirect('/login');
    } catch (err) {
        req.flash('error_msg', 'Erro ao realizar cadastro.');
        res.redirect('/cadastro');
    }
};

exports.login = async (req, res) => {
    const { email, senha } = req.body;
    
    //  LOG DE TENTATIVA
    console.log(` Tentativa de login: ${email}`);

    const usuario = await User.findOne({ email });

    if (usuario && usuario.senha === senha) {
        req.session.user = {
            id: usuario._id,
            nome: usuario.nome,
            tipo: usuario.tipo
        };
        
        //  LOG DE SUCESSO
        console.log(` Login realizado: ${usuario.nome} (${usuario.tipo})`);

        req.flash('success_msg', `Bem-vindo, ${usuario.nome}!`);
        return res.redirect(usuario.tipo === 'parceiro' ? '/painel-parceiro' : '/painel-cliente');
    } else {
        console.log(` Falha no login: E-mail ou senha incorretos para ${email}`);
        req.flash('error_msg', 'E-mail ou senha inválidos.');
        res.redirect('/login');
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if(err) console.log(err);
        res.redirect('/'); 
    });
};
