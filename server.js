//requerer o dotenv para usar as variaveis do .env
require('dotenv').config({ quiet: true })
//requere o express
const express = require('express')
//instancia do express
const api = express()
//requerer o cors
const cors = require('cors')
//requerer a conexao
const conn = require('./db/conn')
//requerer os Models (precisa para criar as tabelas)
const User = require('./models/Users')
const Pet = require('./models/Pet')
//requerer as rotas
const userRoutes = require('./routes/userRoutes')
const petRoutes = require('./routes/petRoutes')

//Configurando JSON response
api.use(express.json())

//salve cors
api.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

//rotas da api
api.use('/users', userRoutes)
api.use('/pets', petRoutes)

//rota que nao existe
api.use((req, res) => {
    res.status(404).json({ message: 'Rota não encontrada' })
})

//start api
conn.sync()
    .then(() => {
        api.listen(3030)
        console.info('API rodando na porta 3030')
    })
    .catch(error => { console.info(error) })
