const Pet = require('../models/pet')

const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = class PetController {

    static async create(req, res) {

        const { name, age, weight, color } = req.body

        const available = true

        if (!name) {
            res.status(422).json({ message: "O nome é obrigatório" })
        }

        if (!age) {
            res.status(422).json({ message: "A idade é obrigatória" })
        }

        if (!weight) {
            res.status(422).json({ message: "O peso é obrigatório" })
        }

        if (!color) {
            res.status(422).json({ message: "A cor é obrigatória" })
        }

        const token = getToken(req)

        const user = await getUserByToken(token)

        const pet = new Pet({
            name, age, weight, color, available, images: [], user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone,
            }
        })

        try {

            const newPet = await pet.save()
            res.status(201).json({
                message: "Pet cadastrado com sucesso", newPet,
            })

        } catch (error) {

            res.status(500).json({ message: error })

        }

    }

    static async getAll(req, res) {

        const pets = await Pet.find().sort('-createdAt')

        res.status(200).json({ pets: pets })

    }

    static async getAllUserPets(req, res) {

        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({ 'user._id': user._id }).sort('-createdAt')

        res.status(200).json({ pets })

    }

    static async getAllUserAdoptions(req, res) {

        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({ 'adopter._id': user._id }).sort('-createdAt')

        res.status(200).json({ pets })

    }

    static async getPetsById(req, res) {

        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID Invalido' })
            return
        }

        const pet = await Pet.findOne({ _id: id })

        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado' })
            return
        }

        res.status(200).json({ pet })

    }

    static async removePetById(req, res) {

        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID Invalido' })
            return
        }

        const pet = await Pet.findOne({ _id: id })

        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado' })
            return
        }

        const token = getToken(req)
        const user = await getUserByToken(token)

        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Houve um problema ao processar a sua solicitação, tente novamente mais tarde' })
            return
        }

        await Pet.findByIdAndRemove(id)

        res.status(200).json({ message: 'Pet removido com sucesso' })

    }

    static async updatePet(req, res) {

        const id = req.params.id

        const { name, age, weight, color, available } = req.body

        const updatedData = {}

        const pet = await Pet.findOne({ _id: id })

        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado' })
            return
        }

        const token = getToken(req)
        const user = await getUserByToken(token)

        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Houve um problema ao processar a sua solicitação, tente novamente mais tarde' })
            return
        }

        if (!name) {
            res.status(422).json({ message: "O nome é obrigatório" })
        } else {
            updatedData.name = name
        }

        if (!age) {
            res.status(422).json({ message: "A idade é obrigatória" })
        } else {
            updatedData.age = age
        }

        if (!weight) {
            res.status(422).json({ message: "O peso é obrigatório" })
        } else {
            updatedData.weight = weight
        }

        if (!color) {
            res.status(422).json({ message: "A cor é obrigatória" })
        } else {
            updatedData.color = color
        }

        await Pet.findByIdAndUpdate(id, updatedData)

        res.status(200).json({ message: 'Pet atualizado com sucesso' })

    }

}