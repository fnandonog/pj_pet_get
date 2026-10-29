//requerer a biblioteca jwt
const jwt = require('jsonwebtoken')
//requerer o helper que pega o token
const getToken = require('./get-token')
//requerer o model do usuario
const User = require('../models/Users')

//middleware que protege as rotas
//so deixa passar quem mandou um token valido
const verifyToken = async (req, res, next) => {
    const token = getToken(req)

    //nao mandou token
    if (!token) {
        return res.status(401).json({ message: 'Acesso negado! Faça login.' })
    }

    try {
        //verificar se o token é valido
        const verified = jwt.verify(token, process.env.CHAVETOKEN)

        //verificar se o usuario do token ainda existe no banco
        const user = await User.findOne({ where: { id: verified.id } })
        if (!user) {
            return res.status(401).json({ message: 'Usuário do token não existe mais' })
        }

        //guardar os dados do usuario na requisição
        req.user = verified
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido ou expirado!' })
    }
}

module.exports = verifyToken
