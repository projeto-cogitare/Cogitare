const path = require("path");
const fs = require("fs");

class ApiController {
  static getPontosColeta(req, res) {
    const filePath = path.join(__dirname, "../pontos.json");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("❌ Erro ao ler pontos.json:", err);
        return res.status(500).json({ sucesso: false, erro: "Não foi possível carregar os pontos." });
      }
      try {
        const pontos = JSON.parse(data);
        res.json({ sucesso: true, pontos });
      } catch (parseErr) {
        console.error("❌ Erro ao converter JSON:", parseErr);
        res.status(500).json({ sucesso: false, erro: "Formato de dados inválido." });
      }
    });
  }
}

module.exports = ApiController;
