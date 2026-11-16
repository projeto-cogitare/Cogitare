# 🌿 Sistema Cogitare — Aplicação Web & UX

> **Plataforma web de conscientização, geolocalização de pontos de coleta e monitoramento de descarte responsável de medicamentos.**  
> *Projeto Integrador dos Cursos de Ciência de Dados e Desenvolvimento de Software Multiplataforma — FATEC Cotia.*

---

## 🎯 Sobre o Cogitare

O descarte inadequado de medicamentos em pias, vasos sanitários ou lixo comum representa uma séria ameaça ao meio ambiente (contaminação do solo e recursos hídricos) e à saúde pública (resistência microbiana e intoxicações). 

O **Cogitare** foi desenvolvido para solucionar essa dor por meio de:
1. **Geolocalização Dinâmica:** Localização interativa de Unidades Básicas de Saúde (UBS) e farmácias autorizadas em Cotia - SP com mapa interativo (Leaflet.js).
2. **Sistema Semafórico de Validade:** Monitoramento visual de medicamentos cadastrados (🟢 Válido | 🟡 Próximo ao vencimento | 🔴 Vencido).
3. **Mecanismo de Teste A/B Nativo de UX:** Comparação experimental entre interfaces de busca para redução do esforço cognitivo do usuário.
4. **Métricas e Mapas de Calor:** Instrumentação via Microsoft Clarity para análise de pontos quentes (*hotspots*) e padrões de navegação visual.

---

## 🛠️ Tecnologias e Bibliotecas

| Camada | Tecnologia |
| :--- | :--- |
| **Back-end** | Node.js (v18+) com Express |
| **Padrão de Arquitetura** | MVC (*Model-View-Controller*) |
| **Front-end / Templates** | Express-Handlebars, HTML5, CSS3, Bootstrap 5.3 e Bootstrap Icons |
| **Mapas & Geolocalização** | Leaflet.js e OpenStreetMap API |
| **Banco de Dados** | MongoDB com ODM Mongoose |
| **Sessão & Flash Messages**| `express-session`, `connect-flash` |
| **UX & Heatmaps** | Microsoft Clarity (`ze8v4q0p38`) |

---

## 🧪 Estrutura do Teste A/B (Locais de Coleta)

A plataforma implementa um sistema nativo de **Teste A/B 50/50** para validar a hipótese de agilidade de busca:

* **Versão A (Controle):** Layout padrão com lista básica e mapa sem filtros por texto.
* **Versão B (Variante Otimizada):** Adição de barra de busca instantânea, chips de filtros rápidos (*Abertos Agora*, *UBS*, *Farmácias*), contadores em tempo real e badges informativos nos cards.

### Como alternar as versões:
* Acesse `/coletas` para sorteio pseudoaleatório 50/50 persistido na sessão.
* Utilize o **Widget Flutuante de Auditoria** no canto inferior direito da tela para alternar com 1 clique.
* Ou acesse diretamente as rotas de auditoria:
  * `/coletas?v=a` ou `/coletas-a` $\to$ Força a **Versão A**
  * `/coletas?v=b` ou `/coletas-b` $\to$ Força a **Versão B**

---

## 📂 Estrutura de Diretórios

```text
Cogitare_Site/
├── config/                  # Conexão com o banco de dados (MongoDB)
│   └── database.js
├── controllers/             # Controladores com regras de negócio
│   ├── apiController.js     # API REST para envio dos pontos em JSON
│   ├── authController.js    # Autenticação e sessão de usuários
│   ├── medicamentoController.js # CRUD e semáforo de fármacos
│   └── pageController.js    # Roteamento e lógica do Teste A/B
├── middlewares/             # Middlewares de rota (ex: autenticação)
│   └── authMiddleware.js
├── models/                  # Schemas do Mongoose (User, Medicamento)
│   ├── Medicamento.js
│   └── User.js
├── public/                  # Arquivos públicos e estáticos
│   ├── imagens/             # Ativos visuais e infográficos
│   ├── js/
│   │   ├── mapa.js          # Script da Versão A (Controle)
│   │   └── mapa-b.js        # Script reativo da Versão B (Chips e Busca)
│   └── style/
│       └── style.css        # Design System e temas da aplicação
├── routes/                  # Definições modulares das rotas Express
│   ├── api.routes.js
│   ├── auth.routes.js
│   ├── index.js
│   ├── medicamento.routes.js
│   └── page.routes.js
├── views/                   # Templates Handlebars
│   ├── layouts/
│   │   └── main.handlebars  # Layout mestre com tag Microsoft Clarity
│   ├── partials/            # Componentes reutilizáveis (header, footer, msgs)
│   ├── coletas.handlebars   # Tela da Versão A
│   ├── coletas-b.handlebars # Tela da Versão B
│   ├── home.handlebars
│   ├── cadastro.handlebars
│   ├── login.handlebars
│   └── educacao.handlebars
├── app.js                   # Inicialização do servidor Express
├── package.json             # Dependências e scripts npm
├── pontos.json              # Base georreferenciada de pontos em Cotia
└── Estudo_UX_Cogitare_A02.docx # Relatório Acadêmico de UX / IHC da Atividade A02
```

---

## 🚀 Como Executar o Projeto Localmente

### 1. Pré-requisitos
* **Node.js** (versão 18.x ou superior)
* **MongoDB** rodando localmente (`mongodb://localhost:27017/cogitare`) ou string de conexão de cluster (MongoDB Atlas).

### 2. Instalação
No terminal, dentro da pasta `Cogitare_Site`:
```bash
npm install
```

### 3. Configuração de Variáveis de Ambiente (Opcional)
Se desejar, crie um arquivo `.env` na raiz de `Cogitare_Site`:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/cogitare
SESSION_SECRET=sua-chave-secreta-cogitare
```

### 4. Execução
Modo padrão:
```bash
npm start
```

Modo de desenvolvimento (com auto-reload do Node):
```bash
npm run dev
```

Acesse no navegador:
👉 `http://localhost:3000`

---

## 👥 Equipe do Projeto

* Fernando Cassiano Pitale
* Francisco Erbenio Matos Vasconcelos
* Paulo Roberto Felipe da Silva
* Pedro Zacarias José da Silva
* Rian Nito Verçosa do Nascimento

**Orientador:** Prof. Eduardo Tadeu de Almeida  
**Instituição:** FATEC Cotia — Centro Paula Souza
