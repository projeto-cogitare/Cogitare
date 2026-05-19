#  Cogitare - Back-end (Node.js)

Seja bem-vindo(a) ao back-end moderno do projeto **Cogitare**! 

Nós migramos a nossa antiga API (que rodava em scripts soltos de Python) para uma arquitetura centralizada e profissional utilizando **Node.js, Express e Sequelize**. Este guia é para ajudar todos da equipe a rodar a aplicação nos próprios computadores de forma simples.

---

##  1. O que você precisa ter instalado?
Para rodar este código, você precisa apenas de uma ferramenta instalada no seu computador:
- **Node.js**: Baixe e instale a versão "LTS" no site oficial: [https://nodejs.org/pt-br](https://nodejs.org/pt-br)
  > Ao instalar o Node.js, ele automaticamente instala o `npm` (Gerenciador de Pacotes do Node), que usaremos para baixar as dependências do projeto.

---

##  2. Como rodar o servidor pela primeira vez?

### Passo A: Entrar na pasta do back-end
Abra o terminal (Pode ser o terminal integrado do VS Code) e navegue até a pasta `backend`:
```bash
cd backend
```

### Passo B: Instalar os pacotes necessários
Nós usamos bibliotecas externas (como o Express para gerenciar rotas). Para baixar essas regras de terceiros para o seu computador, digite:
```bash
npm install
```
*(Isso vai criar uma pasta chamada `node_modules`. Não se assuste, é normal e ela não vai para o GitHub).*

### Passo C: Ligar o Servidor!
Agora que tudo está instalado, basta iniciar o nosso servidor principal:
```bash
node server.js
```

Você deverá ver no console as seguintes mensagens de sucesso:
> "Conexão com o banco de dados SQLite estabelecida com sucesso!"
> "Servidor Node.js (MVC) rodando perfeitamente na porta 5000"

Pronto! Deixe esse terminal aberto minimizado e o front-end (arquivos `.html`) já vai conseguir se comunicar com a nossa API. 

---

##  3. Entendendo a Arquitetura MVC
Nossa estrutura de pastas foi dividida usando o padrão de mercado **MVC** *(Model-View-Controller)*. Como o nosso front-end (View) é separado no HTML puro, o back-end cuida do Model e Controller:

* `src/config/`: Guarda as configurações (como a conexão do banco de dados).
* `src/models/`: Representação matemática do Banco de Dados. Lá definimos que um *Medicamento* tem "nome" e "validade".
* `src/controllers/`: O "Cérebro" do projeto. Lá estão os cálculos matemáticos do mapa e a lógica de verificar quem está vencido ou não. 
* `src/routes/`: Os "Caminhos" da nossa API (Ex: se chama `/api/medicamentos` vai acionar o MedicamentosController).

---

## 🗄️ 4. E o Banco de Dados?
Nós estamos usando **SQLite** gerenciado pelo **Sequelize** (um ORM famoso do mercado). 
- O banco de dados real é gerado automaticamente na raiz dessa pasta com o nome de `database.sqlite` na primeira vez que você rodar `node server.js`.
- É um arquivo local (lembra muito um `.json`, mas protegido com tabelas de SQL real).
- Isso significa que **você não precisa instalar MySQL, XAMPP, ou PostgreSQL para testar**. O banco roda 100% pelo arquivo!

Qualquer dúvida, conversem durante o andamento do projeto! Bom código a todos.
