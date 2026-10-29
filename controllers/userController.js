//requerer a model do User
const User = require('../models/Users')
//requer a bibliote bcrypt
const bcrypt = require('bcrypt')
//requerer o nosso serviço para gerar token
const createUserToken = require('../helpers/create-user-token')
//helpers para descobrir quem esta logado
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

module.exports = class UserController {

    //cadastrar usuario
    static async register(req, res) {
        const { name, email, password, phone } = req.body

        //verificar se o usuário já exite
        const userExists = await User.findOne({ where: { email: email } })
        if (userExists) {
            res.status(422).json({
                message: "Usuário já cadastrado, utilize outro e-mail"
            })
            return
        }

        //criptografar a senha
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        //Criar o novo usario
        try {
            const newUser = await User.create({
                name: name,
                email: email,
                password: passwordHash,
                phone: phone
            })
            //201 = criado com sucesso
            res.status(201).json({
                message: 'Usuario cadastrado com sucesso',
                userId: newUser.id
            })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    //login
    static async login(req, res) {
        //requerer pelo body os parametros do login
        const { email, password } = req.body

        //verificar se o usuario existe
        const user = await User.findOne({ where: { email: email } })

        if (!user) {
            res.status(422).json({
                message: "Não há usuário cadastrado com esse e-mail"
            })
            return
        }

        //verificar o password
        const checkPassword = await bcrypt.compare(password, user.password)

        //retornar a mensagem para senha incorreta
        if (!checkPassword) {
            res.status(422).json({
                message: "Senha Invalida"
            })
            return
        }

        //geramos o token para o usuario
        await createUserToken(user, req, res)
    }

    //ver qual usuario esta logado
    static async checkUser(req, res) {
        const token = getToken(req)
        const currentUser = await getUserByToken(token)

        res.status(200).json({ user: currentUser })
    }

    //listar todos os usuarios (sem mostrar a senha)
    static async listAll(req, res) {
        try {
            const users = await User.findAll({
                attributes: { exclude: ['password'] }
            })
            res.status(200).json({ users })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    //buscar um usuario pelo id
    static async getUserById(req, res) {
        const id = req.params.id

        //o id tem que ser numero
        if (isNaN(id)) {
            res.status(422).json({ message: 'Id inválido' })
            return
        }

        const user = await User.findOne({
            where: { id: id },
            attributes: { exclude: ['password'] }
        })

        if (!user) {
            res.status(404).json({ message: 'Usuário não encontrado' })
            return
        }

        res.status(200).json({ user })
    }

    //editar o usuario
    static async editUser(req, res) {
        const id = req.params.id
        const { name, email, phone, password } = req.body

        //pegar o usuario que esta logado
        const token = getToken(req)
        const currentUser = await getUserByToken(token)

        //verificar se o usuario existe
        const user = await User.findOne({ where: { id: id } })
        if (!user) {
            res.status(404).json({ message: 'Usuário não encontrado' })
            return
        }

        //so pode editar o proprio perfil
        if (currentUser.id != user.id) {
            res.status(403).json({ message: 'Você só pode editar o seu próprio perfil' })
            return
        }

        //se trocou o email, ver se ninguem esta usando
        if (email !== user.email) {
            const emailExists = await User.findOne({ where: { email: email } })
            if (emailExists) {
                res.status(422).json({ message: 'Esse e-mail já está em uso' })
                return
            }
        }

        const dadosAtualizados = {
            name: name,
            email: email,
            phone: phone
        }

        //so troca a senha se mandou uma nova
        if (password) {
            const salt = await bcrypt.genSalt(12)
            dadosAtualizados.password = await bcrypt.hash(password, salt)
        }

        try {
            await User.update(dadosAtualizados, { where: { id: id } })
            res.status(200).json({ message: 'Usuário atualizado com sucesso' })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    //apagar a conta
    static async deleteUser(req, res) {
        const id = req.params.id

        const token = getToken(req)
        const currentUser = await getUserByToken(token)

        const user = await User.findOne({ where: { id: id } })
        if (!user) {
            res.status(404).json({ message: 'Usuário não encontrado' })
            return
        }

        //so pode apagar a propria conta
        if (currentUser.id != user.id) {
            res.status(403).json({ message: 'Você só pode apagar a sua própria conta' })
            return
        }

        try {
            await User.destroy({ where: { id: id } })
            res.status(200).json({ message: 'Usuário removido com sucesso' })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }
}
