const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");
const mongoose = require("mongoose");
const session = require('express-session');
const flash = require('connect-flash');

const publicRoutes = require("./routes/publicRoutes");
const authRoutes = require("./routes/authRoutes");
const privateRoutes = require("./routes/privateRoutes");
const apiRoutes = require("./routes/apiRoutes");

const app = express();

// 1. CONEXÃO AO BANCO
mongoose.connect("mongodb://127.0.0.1:27017/cogitare")
  .then(() => console.log("Banco de Dados Conectado com Sucesso"))
  .catch((err) => console.error("Erro ao conectar:", err));

// 2. TEMPLATE ENGINE
app.engine("handlebars", engine({
  extname: "handlebars", defaultLayout: "main",
  helpers: { eq: (v1, v2) => v1 === v2 },
  runtimeOptions: { allowProtoPropertiesByDefault: true, allowProtoMethodsByDefault: true },
  layoutsDir: path.join(__dirname, "views/layouts"), partialsDir: path.join(__dirname, "views/partials")
}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// 3. MIDDLEWARES
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: 'chave-secreta-cogitare-fatec', resave: false, saveUninitialized: true, cookie: { maxAge: 86400000 } }));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.session.user || null;
  next();
});

// 4. ROTAS
app.use("/", publicRoutes);
app.use("/auth", authRoutes);
app.use("/", privateRoutes);
app.use("/api", apiRoutes);

// 5. INICIALIZAÇÃO
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`\n COGITARE ONLINE: http://localhost:${PORT}\n`));