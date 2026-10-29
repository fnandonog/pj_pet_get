//requerer o siquelize
const Sequelize = require('sequelize')

//parametros de conexão (agora vem do .env e nao fica mais no codigo)
const conn = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS, {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: 3306
    }
)

//testar a conexao
conn.authenticate()
    .then(() => { console.info('Banco de Dados conectado com sucesso!') })
    .catch(error => { console.info(`Não foi possivel conectar ao banco: ${error}`) })

module.exports = conn
