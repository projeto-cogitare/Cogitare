# Cogitare

Um sistema de gerenciamento focado em pontos de coleta e logística reversa de medicamentos, utilizando uma arquitetura MVC e MongoDB.

## Tecnologias Utilizadas

- **Node.js** com **Express**
- **MongoDB** com **Mongoose**
- **Handlebars** para o front-end na arquitetura de Views
- **Express-Session** e **Connect-Flash** para autenticação e mensagens

## Arquitetura (MVC)

O projeto está organizado da seguinte forma:
- `models/`: Esquemas do MongoDB (Usuário, Medicamento)
- `controllers/`: Lógica de rotas e banco de dados separada
- `routes/`: Definição de URLs públicas e protegidas
- `views/`: Telas e templates no padrão Handlebars (.handlebars)
- `public/`: Páginas visuais, CSS e imagens estáticas
- `app.js`: Ponto de entrada leve (menos de 50 linhas) 

## Como Rodar o Projeto Localmente

1. **Pré-requisitos**: 
   - Ter o **Node.js** instalado na sua máquina.
   - Ter o **MongoDB** rodando localmente na porta padrão (27017).

2. **Instalar as dependências**:
   No terminal, dentro da pasta raiz do projeto, instale as bibliotecas executando:
   ```bash
   npm install
   ```

3. **Iniciando o Servidor**:
   Para iniciar a aplicação, basta rodar:
   ```bash
   node app.js
   ```

   O servidor iniciará e mostrará as mensagens:
   - `✅ Banco de Dados Conectado com Sucesso`
   - `🚀 COGITARE ONLINE: http://localhost:3000`

4. Acesse seu navegador na URL `http://localhost:3000`!
