const app = require('./src/app');
const sequelize = require('./src/config/database');

const PORT = 5000;

// Sincronizando o banco de dados com nossos Models e iniciando o servidor
sequelize.sync({ force: false }) // se usar true, recria o banco toda vez. 'false' preserva.
  .then(() => {
    console.log(' Conexão com o banco de dados SQLite estabelecida com sucesso!');
    
    app.listen(PORT, () => {
      console.log(` Servidor Node.js (MVC) rodando perfeitamente na porta ${PORT}`);
      console.log(`- API Saúde: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((err) => {
    console.error(' Não foi possível conectar ao banco de dados:', err);
  });
