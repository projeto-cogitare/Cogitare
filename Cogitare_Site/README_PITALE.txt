

# 🚀 Relatório de Engenharia: Projeto Cogitare
**Desenvolvedor:** Fernando Cassiano Pitale  
**Instituição:** FATEC Cotia – DSM  
**Status do Projeto:** MVP 1.0 Estabilizado (Pronto para Expansão)

---

### 🛠️ Stack Tecnológica
* **Back-end:** Node.js com Framework Express.
* **Front-end:** Handlebars (Templating Engine), Bootstrap 5 e Bootstrap Icons.
* **Banco de Dados:** MongoDB via Mongoose (Persistência NoSQL).
* **Geolocalização:** Leaflet.js para renderização de mapas interativos.
* **Segurança:** Express-Session e Connect-Flash (Gestão de Estado e Feedback).

---

### 🏗️ Arquitetura e Evolução do Sistema

#### **Fase 1: Infraestrutura e Modularização**
Migração do protótipo inicial para o ecossistema Node.js. Implementação de uma arquitetura de **Layouts e Partials**, garantindo que componentes como Header e Footer sejam reutilizáveis e que o cabeçalho (`<head>`) seja único, evitando conflitos de carregamento de scripts.

#### **Fase 2: Inteligência Geoespacial (Mapa)**
Integração da biblioteca **Leaflet.js** consumindo uma API interna (`/api/pontos-coleta`). O sistema agora renderiza pontos de descarte em Cotia em tempo real. Foi resolvida a falha crítica de visibilidade do mapa através da definição explícita de dimensões via CSS (`#map`).

#### **Fase 3: Persistência e Modelagem de Dados**
Estabelecimento do esquema de dados via Mongoose. Criamos o **Isolamento de Dados (Multi-tenancy)**, onde cada medicamento cadastrado é vinculado exclusivamente ao ID do usuário logado (`usuarioId`), garantindo privacidade e integridade das informações.

#### **Fase 4: Segurança e Controle de Acesso**
Implementação do Middleware `estaLogado`, que atua como um "guardião" das rotas, bloqueando acessos não autorizados. Configuramos a **Persistência de Sessão**, permitindo que o sistema reconheça o nome e o tipo de usuário (Cidadão ou Parceiro) em todas as páginas.

#### **Fase 5: UI/UX e Design de Alto Impacto**
* **Home Hero:** Refatoração da página inicial com gradientes de alto contraste e tipografia escalonada para melhor legibilidade (IHC).
* **Split-Card Design:** Implementação de layout desacoplado nas telas de Login e Cadastro, utilizando a propriedade `gap` e sombras suaves para criar uma interface moderna e intuitiva.

#### **Fase 6: Módulo de Inventário e Semáforo Temporal**
Desenvolvimento do CRUD de medicamentos com inteligência de datas. O Back-end agora calcula automaticamente se um remédio está:
* 🟢 **Estável:** Dentro da validade.
* 🟡 **Alerta:** Vence em menos de 30 dias.
* 🔴 **Crítico:** Já ultrapassou a data de validade.

#### **Fase 7: Camada de Feedback Transacional (Flash Messages)**
Restauração do sistema de mensagens dinâmicas. O usuário agora recebe confirmações visuais imediatas (`success_msg` e `error_msg`) ao realizar login, logout ou cadastrar novos itens, fechando o ciclo de interação humana com o sistema.

---

### ✅ Status Final do MVP
* [x] **Segurança:** Rotas privadas e logout seguro.
* [x] **Geolocalização:** Mapa funcional com integração de API interna.
* [x] **Privacidade:** Filtro de banco de dados por usuário.
* [x] **Interface:** Design responsivo, moderno e com feedback visual ativo.

---

### 📅 Próximo Sprint
* **Desenvolvimento do Painel do Parceiro:** Interface exclusiva para farmácias e pontos de coleta gerenciarem o recebimento de descartes.
* **Gamificação Ambiental:** Módulo educativo com recompensas visuais.

---

Documento atualizado em: **31 de Março de 2026**.

