const express = require("express");
const router = express.Router();
const ApiController = require("../controllers/apiController");

router.get("/api/pontos-coleta", ApiController.getPontosColeta);

module.exports = router;
