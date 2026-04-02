const express = require("express");
const router = express.Router();
const apiController = require("../controllers/ApiController");

router.get("/pontos-coleta", apiController.getPontosColeta);

module.exports = router;
