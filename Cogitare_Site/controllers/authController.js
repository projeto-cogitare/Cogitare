const User = require("../models/User");

class AuthController {
  static async cadastrar(req, res) {
    try {
      const { nome, email, endereco, senha, tipo } = req.body;
      const usuarioExistente = await User.findOne({ email });

      if (usuarioExistente) {
        req.flash("error_msg", "Este e-mail já está em uso.");
        return res.redirect("/cadastro");
      }

      await User.create({ nome, email, endereco, senha, tipo });
      req.flash("success_msg", "Conta criada com sucesso! Faça seu login.");
      res.redirect("/login");
    } catch (err) {
      console.error("❌ Erro ao cadastrar usuário:", err);
      req.flash("error_msg", "Erro ao realizar cadastro.");
      res.redirect("/cadastro");
    }
  }

  static async login(req, res) {
    try {
      const { email, senha } = req.body;
      console.log(`🔍 Tentativa de login: ${email}`);

      const usuario = await User.findOne({ email });

      if (usuario && usuario.senha === senha) {
        req.session.user = {
          id: usuario._id,
          nome: usuario.nome,
          tipo: usuario.tipo,
        };

        console.log(`✅ Login realizado: ${usuario.nome} (${usuario.tipo})`);
        req.flash("success_msg", `Bem-vindo, ${usuario.nome}!`);
        return res.redirect(
          usuario.tipo === "parceiro" ? "/painel-parceiro" : "/painel-cliente"
        );
      } else {
        console.log(`❌ Falha no login: E-mail ou senha incorretos para ${email}`);
        req.flash("error_msg", "E-mail ou senha inválidos.");
        res.redirect("/login");
      }
    } catch (err) {
      console.error("❌ Erro durante login:", err);
      req.flash("error_msg", "Ocorreu um erro ao processar o login.");
      res.redirect("/login");
    }
  }

  static logout(req, res) {
    req.session.destroy((err) => {
      if (err) console.error("❌ Erro ao destruir sessão:", err);
      res.redirect("/");
    });
  }
}

module.exports = AuthController;
