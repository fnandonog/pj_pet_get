//requerer as models
const Pet = require('../models/Pet')
const User = require('../models/Users')
//helpers para descobrir quem esta logado
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

module.exports = class PetController {

    //cadastrar pet
    static async create(req, res) {
        const { name, age, weight, color, image } = req.body

        //o dono do pet é o usuario logado
        const token = getToken(req)
        const user = await getUserByToken(token)

        try {
            const newPet = await Pet.create({
                name: name,
                age: age,
                weight: weight,
                color: color,
                image: image,
                available: true,
                userId: user.id
            })
            res.status(201).json({
                message: 'Pet cadastrado com sucesso',
                pet: newPet
            })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    //listar todos os pets (mais novos primeiro)
    static async getAll(req, res) {
        try {
            const pets = await Pet.findAll({
                order: [['createdAt', 'DESC']],
                //trazer o nome e telefone do dono junto
                include: { model: User, attributes: ['name', 'phone'] }
            })
            res.status(200).json({ pets })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    //listar so os pets do usuario logado
    static async getMyPets(req, res) {
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.findAll({
            where: { userId: user.id },
            order: [['createdAt', 'DESC']]
        })

        res.status(200).json({ pets })
    }

    //buscar um pet pelo id
    static async getPetById(req, res) {
        const id = req.params.id

        //o id tem que ser numero
        if (isNaN(id)) {
            res.status(422).json({ message: 'Id inválido' })
            return
        }

        const pet = await Pet.findOne({
            where: { id: id },
            include: { model: User, attributes: ['name', 'phone'] }
        })

        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado' })
            return
        }

        res.status(200).json({ pet })
    }

    //editar pet
    static async updatePet(req, res) {
        const id = req.params.id
        const { name, age, weight, color, image, available } = req.body

        if (isNaN(id)) {
            res.status(422).json({ message: 'Id inválido' })
            return
        }

        //verificar se o pet existe
        const pet = await Pet.findOne({ where: { id: id } })
        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado' })
            return
        }

        //so o dono pode editar
        const token = getToken(req)
        const user = await getUserByToken(token)
        if (pet.userId != user.id) {
            res.status(403).json({ message: 'Você só pode editar os seus pets' })
            return
        }

        const dadosAtualizados = {
            name: name,
            age: age,
            weight: weight,
            color: color,
            image: image
        }

        //so muda o available se mandou
        if (available !== undefined) {
            dadosAtualizados.available = available
        }

        try {
            await Pet.update(dadosAtualizados, { where: { id: id } })
            res.status(200).json({ message: 'Pet atualizado com sucesso' })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    //remover pet
    static async removePet(req, res) {
        const id = req.params.id

        if (isNaN(id)) {
            res.status(422).json({ message: 'Id inválido' })
            return
        }

        const pet = await Pet.findOne({ where: { id: id } })
        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado' })
            return
        }

        //so o dono pode remover
        const token = getToken(req)
        const user = await getUserByToken(token)
        if (pet.userId != user.id) {
            res.status(403).json({ message: 'Você só pode remover os seus pets' })
            return
        }

        try {
            await Pet.destroy({ where: { id: id } })
            res.status(200).json({ message: 'Pet removido com sucesso' })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }
}
