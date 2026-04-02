const express = require("express");
const router = express.Router();
const viewController = require("../controllers/ViewController");

router.get("/", viewController.home);
router.get("/login", viewController.login);
router.get("/cadastro", viewController.cadastro);
router.get("/educacao", viewController.educacao);
router.get("/coletas", viewController.coletas);

module.exports = router;
