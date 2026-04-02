const Medicamento = require("../models/Medicamento");

exports.listar = async (req, res) => {
  try {
    const listaOriginal = await Medicamento.find({ usuarioId: req.session.user.id })
                                           .sort({ validade: 1 }).lean();

    const hoje = new Date();
    const trintaDiasMs = 30 * 24 * 60 * 60 * 1000;

    const medicamentos = listaOriginal.map(remedio => {
      const dataVal = new Date(remedio.validade);
      const diferenca = dataVal - hoje;

      return {
        ...remedio,
        validadeFormatada: dataVal.toLocaleDateString('pt-BR'),
        estaVencido: dataVal < hoje,
        estaPorExpirar: (dataVal >= hoje && diferenca < trintaDiasMs)
      };
    });

    res.render("medicamentos", { medicamentos });
  } catch (err) {
    res.render("medicamentos", { medicamentos: [] });
  }
};

exports.cadastrar = async (req, res) => {
  try {
    const dados = { ...req.body, usuarioId: req.session.user.id };
    
    //  LOG DE CADASTRO
    console.log(" Cadastrando medicamento:", dados);

    await Medicamento.create(dados);
    
    console.log(` Item "${dados.nome}" salvo com sucesso!`);

    req.flash('success_msg', 'Medicamento adicionado com sucesso!');
    res.redirect("/medicamentos");
  } catch (err) {
    console.error(" Erro no cadastro:", err);
    req.flash('error_msg', 'Erro ao cadastrar medicamento.');
    res.redirect("/medicamentos");
  }
};

exports.deletar = async (req, res) => {
  try {
    await Medicamento.findByIdAndDelete(req.params.id);
    console.log(` Registro ${req.params.id} removido.`);
    req.flash('success_msg', 'Registro removido.');
    res.redirect("/medicamentos");
  } catch (err) {
    req.flash('error_msg', 'Erro ao excluir o registro.');
    res.redirect("/medicamentos");
  }
};
