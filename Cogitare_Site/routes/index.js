const express = require("express");
const router = express.Router();

const pageRoutes = require("./page.routes");
const authRoutes = require("./auth.routes");
const medicamentoRoutes = require("./medicamento.routes");
const apiRoutes = require("./api.routes");

router.use("/", pageRoutes);
router.use("/", authRoutes);
router.use("/", medicamentoRoutes);
router.use("/", apiRoutes);

module.exports = router;
