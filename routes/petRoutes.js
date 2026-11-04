//requerer a biblioteca router do express
const route = require('express').Router()
//requerer o controller do pet
const petController = require('../controllers/petController')
//requerer as validações
const { petValidationRules, validate } = require('../helpers/petValidator')
//requerer o middleware que protege as rotas
const verifyToken = require('../helpers/verify-token')

//Rotas
//cadastrar pet (precisa de token)
route.post('/create', verifyToken, petValidationRules(), validate, petController.create)
//listar todos os pets
route.get('/', petController.getAll)
//listar os meus pets (precisa de token)
//essas rotas tem que ficar antes da /:id se nao o express acha que "mypets" é um id
route.get('/mypets', verifyToken, petController.getMyPets)
//listar os pets que eu quero adotar (precisa de token)
route.get('/myadoptions', verifyToken, petController.getMyAdoptions)
//buscar um pet
route.get('/:id', petController.getPetById)
//editar pet (precisa de token)
route.patch('/:id', verifyToken, petValidationRules(), validate, petController.updatePet)
//remover pet (precisa de token)
route.delete('/:id', verifyToken, petController.removePet)
//agendar visita (precisa de token)
route.patch('/schedule/:id', verifyToken, petController.schedule)
//concluir adoção (precisa de token)
route.patch('/conclude/:id', verifyToken, petController.concludeAdoption)

module.exports = route
