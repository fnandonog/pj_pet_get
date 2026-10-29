//requerer a biblioteca router do express
const route = require('express').Router()
//requerer o controller no UserController
const userController = require('../controllers/userController')
//requerer as validações
const {
    registerValidationRules,
    loginValidationRules,
    updateValidationRules,
    validate
} = require('../helpers/userValidator')
//requerer o middleware que protege as rotas
const verifyToken = require('../helpers/verify-token')

//Rotas
//Register
route.post('/register', registerValidationRules(), validate, userController.register)
//rota de login
route.post('/login', loginValidationRules(), validate, userController.login)
//ver o usuario logado (precisa de token)
route.get('/checkuser', verifyToken, userController.checkUser)
//Listar todos (precisa de token)
route.get('/', verifyToken, userController.listAll)
//buscar um usuario
route.get('/:id', userController.getUserById)
//editar usuario (precisa de token)
route.patch('/edit/:id', verifyToken, updateValidationRules(), validate, userController.editUser)
//apagar usuario (precisa de token)
route.delete('/:id', verifyToken, userController.deleteUser)

module.exports = route
