const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");
const viewController = require("../controllers/ViewController");
const medicamentoController = require("../controllers/MedicamentoController");

// Todas as rotas abaixo usam o middleware de autenticacao
router.use(authController.estaLogado);

// Painéis
router.get("/painel-cliente", viewController.painelCliente);
router.get("/painel-parceiro", viewController.painelParceiro);

// Medicamentos
router.get("/medicamentos", medicamentoController.listar);
router.post("/medicamentos/cadastrar", medicamentoController.cadastrar);
router.post("/medicamentos/deletar/:id", medicamentoController.deletar);

// Logout
router.get("/logout", authController.logout);

module.exports = router;
