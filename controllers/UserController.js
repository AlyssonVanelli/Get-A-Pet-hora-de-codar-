const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

module.exports = class UserController {

    static async register(req, res) {

        const { name, email, phone, password, confirmpassword } = req.body

        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório' })
            return
        }

        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório' })
            return
        }

        if (!phone) {
            res.status(422).json({ message: 'O telefone é obrigatório' })
            return
        }

        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatório' })
            return
        }

        if (!confirmpassword) {
            res.status(422).json({ message: 'A confirmação de senha é obrigatório' })
            return
        }

        if (password !== confirmpassword) {
            res.status(422).json({ message: 'A senha e confirmação de senha não são iguais' })
            return
        }

        const UserExist = await User.findOne({ email: email })

        if (UserExist) {
            res.status(422).json({ message: 'Usuario já cadastrado' })
            return
        }

        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        const user = new User({
            name,
            email,
            phone,
            password: passwordHash
        })

        try {

            const newUser = await user.save()
            await createUserToken(newUser, req, res)

        } catch (error) {

            res.status(500).json({ message: error })

        }

    }

    static async login(req, res) {

        const { email, password } = req.body

        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório' })
            return
        }

        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatório' })
            return
        }

        const user = await User.findOne({ email: email })

        if (!user) {
            res.status(422).json({ message: 'Usuario não cadastrado' })
            return
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            res.status(422).json({ message: 'Usuario ou Senha inválido' })
            return
        }

        await createUserToken(user, req, res)

    }

    static async checkUser(req, res) {

        let currentUser

        if (req.headers.authorization) {

            const token = getToken(req)
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            currentUser = await User.findById(decoded.id)

            currentUser.password = undefined

        } else {

            currentUser = null

        }

        res.status(200).send(currentUser)

    }

    static async getUserById(req, res) {

        const id = req.params.id

        const user = await User.findById(id).select("-password")

        if (!user) {
            res.status(422).json({ message: 'Usuario não cadastrado' })
            return
        }

        res.status(200).json({ user })

    }

    static async editUser(req, res) {

        const id = req.params.id

        const token = getToken(req)

        const user = await getUserByToken(token)

        const { name, email, phone, password, confirmpassword } = req.body

        let image = ''

        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório' })
            return
        }

        user.name = name

        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório' })
            return
        }

        const UserExist = await User.findOne({ email: email })

        if (user.email !== email && UserExist) {
            res.status(422).json({ message: 'Usuario já cadastrado' })
            return
        }

        user.email = email

        if (!phone) {
            res.status(422).json({ message: 'O telefone é obrigatório' })
            return
        }

        user.phone = phone

        if (password != confirmpassword) {
            res.status(422).json({ message: 'As senhas não conferem' })
            return
        } else if (password === confirmpassword && password != null) {

            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            user.password = passwordHash

        }

        try {

            await User.findOneAndUpdate(
                { _id: user._id },
                { $set: user },
                { new: true }
            )

            res.status(200).json({ message: 'Usuario atualizado com sucesso' })

        } catch (error) {
            res.status(500).json({ message: error })
            return
        }

    }

}