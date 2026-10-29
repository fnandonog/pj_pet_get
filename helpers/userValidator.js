// requerer as bibliotecas do validator
const { body, validationResult } = require('express-validator')

//Regras de Validações do cadastro
const registerValidationRules = () => {
    return [
        body('name').trim().notEmpty().withMessage('O nome é Obrigatório'),
        body('email').trim().notEmpty().withMessage('O E-mail é obrigatório')
            .isEmail().withMessage('Digite um e-mail válido'),
        body('password').notEmpty().withMessage('A senha é Obrigatória')
            .isLength({ min: 6 }).withMessage('A senha precisa ter no mínimo 6 caracteres'),
        body('confirmpassword').notEmpty().withMessage('A confirmação de senha é obrigatória')
            .custom((value, { req }) => value === req.body.password)
            .withMessage('A senha e a confirmação precisam ser iguais'),
        body('phone').trim().notEmpty().withMessage('O telefone é Obrigatório'),
    ]
}

//Regras de Validações do login
const loginValidationRules = () => {
    return [
        body('email').trim().notEmpty().withMessage('O E-mail é obrigatório')
            .isEmail().withMessage('Digite um e-mail válido'),
        body('password').notEmpty().withMessage('A senha é Obrigatória'),
    ]
}

//Regras de Validações da edição (a senha é opcional, so troca se mandar)
const updateValidationRules = () => {
    return [
        body('name').trim().notEmpty().withMessage('O nome é Obrigatório'),
        body('email').trim().notEmpty().withMessage('O E-mail é obrigatório')
            .isEmail().withMessage('Digite um e-mail válido'),
        body('phone').trim().notEmpty().withMessage('O telefone é Obrigatório'),
        body('password').optional()
            .isLength({ min: 6 }).withMessage('A senha precisa ter no mínimo 6 caracteres'),
        body('confirmpassword')
            .custom((value, { req }) => !req.body.password || value === req.body.password)
            .withMessage('A senha e a confirmação precisam ser iguais'),
    ]
}

//Validação
const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    //Retornar o primeiro erro encontrado
    return res.status(422).json({ message: errors.array()[0].msg })
}

module.exports = {
    registerValidationRules,
    loginValidationRules,
    updateValidationRules,
    validate
}
