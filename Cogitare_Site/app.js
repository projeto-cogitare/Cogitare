// ==========================================================================
// PROJETO COGITARE - SERVIDOR PRINCIPAL (EXPRESS + HANDLEBARS + MONGODB)
// ==========================================================================
const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");

const connectDB = require("./config/database");
const routes = require("./routes");

const app = express();

// 1. Conexão com o Banco de Dados
connectDB();

// 2. Configuração do Template Engine (Handlebars)
app.engine(
  "handlebars",
  engine({
    extname: "handlebars",
    defaultLayout: "main",
    helpers: {
      eq: function (v1, v2) {
        return v1 === v2;
      },
    },
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// 3. Middlewares Globais
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 4. Sessão e Mensagens Flash
app.use(
  session({
    secret: process.env.SESSION_SECRET || "chave-secreta-cogitare-fatec",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 dia
  })
);
app.use(flash());

// 5. Variáveis Globais para as Views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.session.user || null;
  next();
});

// 6. Rotas da Aplicação (MVC)
app.use(routes);

// 7. Tratamento de Rota 404
app.use((req, res) => {
  res.status(404).render("home", {
    titulo: "Página não encontrada - Cogitare",
    error_msg: "Página não encontrada.",
  });
});

// 8. Inicialização do Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 COGITARE ONLINE: http://localhost:${PORT}\n`);
});

module.exports = app;