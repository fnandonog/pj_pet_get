//requerer as models
const Pet = require('../models/Pet')
const User = require('../models/Users')
//helpers para descobrir quem esta logado
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

//dados do dono e do adotante que podem aparecer (sem email e sem senha)
const donoInclude = { model: User, attributes: ['id', 'name', 'phone'] }
const adotanteInclude = { model: User, as: 'adopter', attributes: ['id', 'name', 'phone'] }

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
                include: donoInclude
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
            order: [['createdAt', 'DESC']],
            //o dono ve quem agendou visita no pet dele
            include: adotanteInclude
        })

        res.status(200).json({ pets })
    }

    //listar os pets que o usuario logado quer adotar
    static async getMyAdoptions(req, res) {
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.findAll({
            where: { adopterId: user.id },
            order: [['createdAt', 'DESC']],
            //o adotante ve o contato do dono
            include: donoInclude
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
            include: donoInclude
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
        const { name, age, weight, color, image } = req.body

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

        //pet que ja foi adotado nao pode mais ser editado
        if (!pet.available) {
            res.status(422).json({ message: 'Esse pet já foi adotado e não pode ser editado' })
            return
        }

        //o "available" nao vem do body, ele so muda quando conclui a adocao
        const dadosAtualizados = {
            name: name,
            age: age,
            weight: weight,
            color: color,
            image: image
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

    //agendar visita (quem quer adotar)
    static async schedule(req, res) {
        const id = req.params.id

        if (isNaN(id)) {
            res.status(422).json({ message: 'Id inválido' })
            return
        }

        const pet = await Pet.findOne({ where: { id: id }, include: donoInclude })
        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado' })
            return
        }

        const token = getToken(req)
        const user = await getUserByToken(token)

        //regra: nao pode agendar visita no proprio pet
        if (pet.userId == user.id) {
            res.status(422).json({ message: 'Você não pode agendar visita para o seu próprio pet' })
            return
        }

        //regra: pet ja adotado nao recebe visita
        if (!pet.available) {
            res.status(422).json({ message: 'Esse pet já foi adotado' })
            return
        }

        //regra: se ja tem alguem agendado
        if (pet.adopterId) {
            if (pet.adopterId == user.id) {
                res.status(422).json({ message: 'Você já agendou uma visita para esse pet' })
            } else {
                res.status(422).json({ message: 'Esse pet já tem uma visita agendada por outra pessoa' })
            }
            return
        }

        try {
            await Pet.update({ adopterId: user.id }, { where: { id: id } })
            //devolve o contato do dono para combinar a visita
            res.status(200).json({
                message: `Visita agendada! Entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}`
            })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    //concluir adocao (so o dono)
    static async concludeAdoption(req, res) {
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

        //regra: so o dono pode concluir
        const token = getToken(req)
        const user = await getUserByToken(token)
        if (pet.userId != user.id) {
            res.status(403).json({ message: 'Só o dono do pet pode concluir a adoção' })
            return
        }

        //regra: precisa ter alguem agendado
        if (!pet.adopterId) {
            res.status(422).json({ message: 'Ninguém agendou visita para esse pet ainda' })
            return
        }

        //regra: nao concluir duas vezes
        if (!pet.available) {
            res.status(422).json({ message: 'Essa adoção já foi concluída' })
            return
        }

        try {
            await Pet.update({ available: false }, { where: { id: id } })
            res.status(200).json({ message: 'Parabéns! A adoção foi concluída' })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }
}
