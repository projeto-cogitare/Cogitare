const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");

router.post("/auth/cadastro", AuthController.cadastrar);
router.post("/auth/login", AuthController.login);
router.get("/logout", AuthController.logout);

module.exports = router;
