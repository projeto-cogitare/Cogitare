const path = require("path");
const fs = require("fs");

exports.home = (req, res) => res.render("home", { titulo: "Home - Cogitare" });
exports.login = (req, res) => res.render("login", { titulo: "Login" });
exports.cadastro = (req, res) => res.render("cadastro", { titulo: "Cadastro" });
exports.educacao = (req, res) => res.render("educacao", { titulo: "Educação Ambiental" });
exports.coletas = (req, res) => res.render("coletas", { titulo: "Pontos de Coleta" });

exports.painelCliente = (req, res) => {
    res.render('painel-cliente', { usuario: req.session.user }); 
};

exports.painelParceiro = (req, res) => {
    if (req.session.user.tipo !== 'parceiro') {
        req.flash('error_msg', 'Acesso restrito para contas de parceiros.');
        return res.redirect('/painel-cliente');
    }

    const estatisticas = {
        totalRecebido: 142,
        kgEvitados: "15.4kg",
        rankingCidade: "3º lugar"
    };

    res.render('painel-parceiro', { 
        usuario: req.session.user,
        stats: estatisticas
    });
};
