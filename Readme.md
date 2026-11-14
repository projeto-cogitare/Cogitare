# 🌿 Cogitare

O **Cogitare** é uma plataforma web criada para combater o descarte incorreto de medicamentos, oferecendo uma solução acessível e intuitiva para que a população realize o descarte ecológico ou a doação de forma segura e responsável.

---

## 💡 Objetivo & Impacto

- **Objetivo:** Incentivar o descarte correto de medicamentos vencidos ou em desuso e facilitar a doação de remédios ainda utilizáveis para instituições de caridade e farmácias parceiras.
- **Impacto:** Preservação do meio ambiente (prevenção da contaminação do solo e da água) e proteção da saúde pública.

---

## 🛠️ Stack Tecnológica

- **Back-end:** [Node.js](https://nodejs.org/) com [Express](https://expressjs.com/)
- **Arquitetura:** MVC (*Model-View-Controller*)
- **Front-end:** [Express-Handlebars](https://handlebarsjs.com/), [Bootstrap 5](https://getbootstrap.com/) e [Bootstrap Icons](https://icons.getbootstrap.com/)
- **Banco de Dados:** [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Geolocalização:** [Leaflet.js](https://leafletjs.com/) para renderização interativa dos pontos de descarte
- **Sessão & Segurança:** `express-session` e `connect-flash` para controle de autenticação e feedback ao usuário

---

## 📁 Estrutura do Projeto (MVC)

```text
Cogitare/
├── Cogitare_Site/
│   ├── config/              # Configurações de infraestrutura (banco de dados)
│   │   └── database.js
│   ├── controllers/         # Regras de negócio e controle de requisições
│   │   ├── apiController.js
│   │   ├── authController.js
│   │   ├── medicamentoController.js
│   │   └── pageController.js
│   ├── middlewares/         # Middlewares de segurança e validação
│   │   └── authMiddleware.js
│   ├── models/              # Modelos e Schemas do Mongoose (MongoDB)
│   │   ├── Medicamento.js
│   │   └── User.js
│   ├── public/              # Arquivos estáticos (CSS, JS cliente, imagens)
│   │   ├── favicon.png
│   │   ├── imagens/
│   │   ├── js/
│   │   └── style/
│   ├── routes/              # Definição e separação modular das rotas
│   │   ├── api.routes.js
│   │   ├── auth.routes.js
│   │   ├── index.js
│   │   ├── medicamento.routes.js
│   │   └── page.routes.js
│   ├── views/               # Telas e templates (Handlebars)
│   │   ├── layouts/
│   │   │   └── main.handlebars
│   │   ├── partials/
│   │   │   ├── _msg.handlebars
│   │   │   ├── footer.handlebars
│   │   │   └── header.handlebars
│   │   ├── cadastro.handlebars
│   │   ├── coletas.handlebars
│   │   ├── educacao.handlebars
│   │   ├── home.handlebars
│   │   ├── login.handlebars
│   │   ├── medicamentos.handlebars
│   │   ├── painel-cliente.handlebars
│   │   └── painel-parceiro.handlebars
│   ├── app.js               # Ponto de entrada limpo da aplicação Express
│   ├── package.json         # Gerenciamento de dependências e scripts
│   └── pontos.json          # Base de dados de pontos de coleta
└── Readme.md                # Este documento
```

---

## 🚀 Como Executar Localmente

### 1. Pré-requisitos
- **Node.js** (versão 18 ou superior)
- **MongoDB** em execução localmente na porta padrão (`27017`)

### 2. Passo a passo

1. Acesse o diretório da aplicação:
   ```bash
   cd Cogitare_Site
   ```

2. Instale as dependências (caso não estejam instaladas):
   ```bash
   npm install
   ```

3. Inicie o servidor:
   ```bash
   npm start
   ```
   *Ou em modo de desenvolvimento com recarregamento automático:*
   ```bash
   npm run dev
   ```

4. Abra no navegador:
   ```text
   http://localhost:3000
   ```

---

## 👥 Créditos e Instituição

- **Projeto Integrador:** FATEC Cotia – Curso de Desenvolvimento de Software Multiplataforma (DSM)
- **Equipe:** Projeto Cogitare
