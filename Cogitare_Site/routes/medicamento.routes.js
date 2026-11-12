const express = require("express");
const router = express.Router();
const MedicamentoController = require("../controllers/medicamentoController");
const { estaLogado } = require("../middlewares/authMiddleware");

router.get("/medicamentos", estaLogado, MedicamentoController.listar);
router.post("/medicamentos/cadastrar", estaLogado, MedicamentoController.cadastrar);
router.post("/medicamentos/deletar/:id", estaLogado, MedicamentoController.deletar);

module.exports = router;
