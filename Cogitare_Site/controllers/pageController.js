class PageController {
  static renderHome(req, res) {
    res.render("home", { titulo: "Home - Cogitare" });
  }

  static renderLogin(req, res) {
    res.render("login", { titulo: "Login" });
  }

  static renderCadastro(req, res) {
    res.render("cadastro", { titulo: "Cadastro" });
  }

  static renderEducacao(req, res) {
    res.render("educacao", { titulo: "Educação Ambiental" });
  }

  static renderColetas(req, res) {
    res.render("coletas", { titulo: "Pontos de Coleta" });
  }

  static renderPainelCliente(req, res) {
    res.render("painel-cliente", { usuario: req.session.user });
  }

  static renderPainelParceiro(req, res) {
    if (req.session.user.tipo !== "parceiro") {
      req.flash("error_msg", "Acesso restrito para contas de parceiros.");
      return res.redirect("/painel-cliente");
    }

    const estatisticas = {
      totalRecebido: 142,
      kgEvitados: "15.4kg",
      rankingCidade: "3º lugar",
    };

    res.render("painel-parceiro", {
      usuario: req.session.user,
      stats: estatisticas,
    });
  }
}

module.exports = PageController;
