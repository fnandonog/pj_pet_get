// requerer as bibliotecas do validator
const { body } = require('express-validator')

//Regras de Validações do pet (usado no cadastro e na edição)
const petValidationRules = () => {
    return [
        body('name').trim().notEmpty().withMessage('O nome do pet é Obrigatório'),
        body('age').notEmpty().withMessage('A idade é Obrigatória')
            .isInt({ min: 0 }).withMessage('A idade precisa ser um número'),
        body('weight').notEmpty().withMessage('O peso é Obrigatório')
            .isFloat({ min: 0 }).withMessage('O peso precisa ser um número'),
        body('color').trim().notEmpty().withMessage('A cor é Obrigatória'),
    ]
}

//a função validate é a mesma do usuario, entao reaproveitamos ela
const { validate } = require('./userValidator')

module.exports = {
    petValidationRules,
    validate
}
