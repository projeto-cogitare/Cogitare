// ==========================================================================
// 1. IMPORTAÇÕES E CONFIGURAÇÕES INICIAIS
// ==========================================================================
const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const session = require('express-session');
const flash = require('connect-flash');

const User = require("./models/User");
const Medicamento = require("./models/Medicamento");

const app = express();

// ==========================================================================
// 2. CONEXÃO COM O BANCO DE DADOS (MongoDB)
// ==========================================================================
mongoose
  .connect("mongodb://127.0.0.1:27017/cogitare")
  .then(() => console.log("✅ Conectado ao MongoDB com sucesso!"))
  .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err));

// ==========================================================================
// 3. CONFIGURAÇÃO DO TEMPLATE ENGINE (Handlebars)
// ==========================================================================
app.engine(
  "handlebars",
  engine({
    extname: "handlebars",
    defaultLayout: "main",
    helpers: {
        eq: function (v1, v2) { return v1 === v2; }
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
  }),
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// ==========================================================================
// 4. MIDDLEWARES
// ==========================================================================
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'chave-secreta-cogitare-fatec',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.session.user || null; 
    next();
});

// ==========================================================================
// 5. MIDDLEWARE DE SEGURANÇA
// ==========================================================================
function estaLogado(req, res, next) {
    if (req.session.user) {
        return next();
    }
    req.flash('error_msg', 'Acesso negado! Por favor, faça login.');
    res.redirect('/login');
}

// ==========================================================================
// 6. ROTAS PÚBLICAS
// ==========================================================================
app.get("/", (req, res) => res.render("home", { titulo: "Home - Cogitare" }));
app.get("/login", (req, res) => res.render("login", { titulo: "Login" }));
app.get("/cadastro", (req, res) => res.render("cadastro", { titulo: "Cadastro" }));
app.get("/educacao", (req, res) => res.render("educacao", { titulo: "Educação Ambiental" }));
app.get("/coletas", (req, res) => res.render("coletas", { titulo: "Pontos de Coleta" }));

app.get("/api/pontos-coleta", (req, res) => {
  const filePath = path.join(__dirname, "pontos.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ sucesso: false });
    res.json({ sucesso: true, pontos: JSON.parse(data) });
  });
});

// ==========================================================================
// 7. ROTAS DE AUTENTICAÇÃO
// ==========================================================================

app.post('/auth/cadastro', async (req, res) => {
    try {
        const { nome, email, endereco, senha, tipo } = req.body;
        const usuarioExistente = await User.findOne({ email });

        if (usuarioExistente) {
            req.flash('error_msg', 'Este e-mail já está em uso.');
            return res.redirect('/cadastro');
        }

        await User.create({ nome, email, endereco, senha, tipo });
        req.flash('success_msg', 'Conta criada com sucesso! Faça seu login.');
        res.redirect('/login');
    } catch (err) {
        req.flash('error_msg', 'Erro ao realizar cadastro.');
        res.redirect('/cadastro');
    }
});

app.post('/auth/login', async (req, res) => {
    const { email, senha } = req.body;
    
    // 🔍 LOG DE TENTATIVA
    console.log(`🔍 Tentativa de login: ${email}`);

    const usuario = await User.findOne({ email });

    if (usuario && usuario.senha === senha) {
        req.session.user = {
            id: usuario._id,
            nome: usuario.nome,
            tipo: usuario.tipo
        };
        
        // ✅ LOG DE SUCESSO
        console.log(`✅ Login realizado: ${usuario.nome} (${usuario.tipo})`);

        req.flash('success_msg', `Bem-vindo, ${usuario.nome}!`);
        return res.redirect(usuario.tipo === 'parceiro' ? '/painel-parceiro' : '/painel-cliente');
    } else {
        console.log(`❌ Falha no login: E-mail ou senha incorretos para ${email}`);
        req.flash('error_msg', 'E-mail ou senha inválidos.');
        res.redirect('/login');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) console.log(err);
        res.redirect('/'); 
    });
});

// ==========================================================================
// 8. ROTAS PROTEGIDAS
// ==========================================================================

app.get('/painel-cliente', estaLogado, (req, res) => {
    res.render('painel-cliente', { usuario: req.session.user }); 
});

app.get('/painel-parceiro', estaLogado, (req, res) => {
    if (req.session.user.tipo !== 'parceiro') {
        req.flash('error_msg', 'Acesso restrito para contas de parceiros.');
        return res.redirect('/painel-cliente');
    }

    const estatisticas = {
        totalRecebido: 142,
        kgEvitados: "15.4kg",
        rankingCidade: "3º lugar"
    };

    res.render('painel-parceiro', { 
        usuario: req.session.user,
        stats: estatisticas
    });
});

// --- Módulo de Inventário ---

app.get("/medicamentos", estaLogado, async (req, res) => {
  try {
    const listaOriginal = await Medicamento.find({ usuarioId: req.session.user.id })
                                           .sort({ validade: 1 }).lean();

    const hoje = new Date();
    const trintaDiasMs = 30 * 24 * 60 * 60 * 1000;

    const medicamentos = listaOriginal.map(remedio => {
      const dataVal = new Date(remedio.validade);
      const diferenca = dataVal - hoje;

      return {
        ...remedio,
        validadeFormatada: dataVal.toLocaleDateString('pt-BR'),
        estaVencido: dataVal < hoje,
        estaPorExpirar: (dataVal >= hoje && diferenca < trintaDiasMs)
      };
    });

    res.render("medicamentos", { medicamentos });
  } catch (err) {
    res.render("medicamentos", { medicamentos: [] });
  }
});

app.post("/medicamentos/cadastrar", estaLogado, async (req, res) => {
  try {
    const dados = { ...req.body, usuarioId: req.session.user.id };
    
    // 💊 LOG DE CADASTRO
    console.log("💊 Cadastrando medicamento:", dados);

    await Medicamento.create(dados);
    
    console.log(`✅ Item "${dados.nome}" salvo com sucesso!`);

    req.flash('success_msg', 'Medicamento adicionado com sucesso!');
    res.redirect("/medicamentos");
  } catch (err) {
    console.error("❌ Erro no cadastro:", err);
    req.flash('error_msg', 'Erro ao cadastrar medicamento.');
    res.redirect("/medicamentos");
  }
});

app.post("/medicamentos/deletar/:id", estaLogado, async (req, res) => {
  try {
    await Medicamento.findByIdAndDelete(req.params.id);
    console.log(`🗑️ Registro ${req.params.id} removido.`);
    req.flash('success_msg', 'Registro removido.');
    res.redirect("/medicamentos");
  } catch (err) {
    req.flash('error_msg', 'Erro ao excluir o registro.');
    res.redirect("/medicamentos");
  }
});

// ==========================================================================
// 9. INICIALIZAÇÃO
// ==========================================================================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 COGITARE ONLINE: http://localhost:${PORT}\n`);
});