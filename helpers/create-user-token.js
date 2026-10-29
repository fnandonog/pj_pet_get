//requerer a bibioteca jwt
const jwt = require('jsonwebtoken')

//criar o metodo para gerar o token
const createUserToken = async (user, req, res) => {
    const token = jwt.sign({
        name: user.name,
        id: user.id
    }, process.env.CHAVETOKEN, {
        //o token vale por 1 dia
        expiresIn: '1d'
    })

    //retornamos o token
    res.status(200).json({
        message: 'Você está autenticado',
        token: token,
        userId: user.id
    })
}

module.exports = createUserToken
