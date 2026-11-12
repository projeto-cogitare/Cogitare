function estaLogado(req, res, next) {
  if (req.session.user) {
    return next();
  }
  req.flash("error_msg", "Acesso negado! Por favor, faça login.");
  res.redirect("/login");
}

module.exports = { estaLogado };
