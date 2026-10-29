//requerer a biblioteca jwt
const jwt = require('jsonwebtoken')
//requerer o model do usuario
const User = require('../models/Users')

//descobrir quem é o usuario pelo token
const getUserByToken = async (token) => {
    //abrir o token para pegar o id
    const decoded = jwt.verify(token, process.env.CHAVETOKEN)

    //buscar o usuario no banco (sem a senha)
    const user = await User.findOne({
        where: { id: decoded.id },
        attributes: { exclude: ['password'] }
    })

    return user
}

module.exports = getUserByToken
