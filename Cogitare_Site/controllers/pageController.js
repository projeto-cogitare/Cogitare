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
    // 1. Suporte a troca manual via query string (?v=a ou ?v=b)
    if (req.query.v) {
      req.session.ab_versao = req.query.v.toUpperCase() === "B" ? "B" : "A";
    }

    // 2. Sorteio aleatório 50/50 na primeira visita (persistido na sessão)
    if (!req.session.ab_versao) {
      req.session.ab_versao = Math.random() < 0.5 ? "A" : "B";
    }

    const versao = req.session.ab_versao;
    const isVersaoB = versao === "B";

    res.render(isVersaoB ? "coletas-b" : "coletas", {
      titulo: isVersaoB ? "Pontos de Coleta (Versão B - UX)" : "Pontos de Coleta (Versão A)",
      versaoAB: versao,
      isVersaoB: isVersaoB,
      versaoOposta: isVersaoB ? "A" : "B"
    });
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
