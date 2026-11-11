const express = require("express");
const router = express.Router();
const PageController = require("../controllers/pageController");
const { estaLogado } = require("../middlewares/authMiddleware");

// Rotas públicas
router.get("/", PageController.renderHome);
router.get("/login", PageController.renderLogin);
router.get("/cadastro", PageController.renderCadastro);
router.get("/educacao", PageController.renderEducacao);
router.get("/coletas", PageController.renderColetas);

// Rotas privadas de painel
router.get("/painel-cliente", estaLogado, PageController.renderPainelCliente);
router.get("/painel-parceiro", estaLogado, PageController.renderPainelParceiro);

module.exports = router;
