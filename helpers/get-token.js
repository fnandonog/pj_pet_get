//pegar o token que vem no header Authorization
//ele vem assim: "Bearer eyJhbGciOi..."
const getToken = (req) => {
    const authHeader = req.headers.authorization

    //se nao mandou nada retorna null
    if (!authHeader) {
        return null
    }

    //separa o "Bearer" do token
    const token = authHeader.split(' ')[1]

    return token
}

module.exports = getToken
