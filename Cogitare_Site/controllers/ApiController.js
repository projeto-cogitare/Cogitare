const path = require("path");
const fs = require("fs");

exports.getPontosColeta = (req, res) => {
  const filePath = path.join(__dirname, "../pontos.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ sucesso: false });
    res.json({ sucesso: true, pontos: JSON.parse(data) });
  });
};
