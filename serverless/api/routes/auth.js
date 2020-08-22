const express = require('express')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const Users = require('../models/Users')
const { isAuthenticated } = require('../auth')

const router = express.Router()

const signToken = (_id) => {
    return jwt.sign({ _id }, 'mi-secreto', {
        expiresIn: 60 * 60 * 24 * 365
    })
}

router.post('/register', (request, response) => {
    const {email, password} = request.body
    crypto.randomBytes(16, (error, salt) => {
        const newSalt = salt.toString('base64')
        crypto.pbkdf2(password, newSalt, 10000, 64, 'sha1', (error, key) => {
            const encryptedPassword = key.toString('base64')
            Users.findOne({ email }).exec()
            .then(user => {
                if (user) {
                    return response.send('Usuario ya existe')
                }
                Users.create({
                    email: email,
                    password: encryptedPassword,
                    salt: newSalt,
                }).then(() => {
                    response.send('Usuario creado con éxito')
                })
            })
        })
    })

})

router.post('/login', (request, response) => {
    const {email, password} = request.body
    Users.findOne({ email }).exec()
    .then(user => {
        if (!user) {
            return response.send('usuario y/o contraseña incorrecta')
        }
        crypto.pbkdf2(password, user.salt, 10000, 64, 'sha1', (error, key) => {
            const encryptedPassword = key.toString('base64')
            if (user.password === encryptedPassword) {
                const token = signToken(user._id)
                return response.send({ token })
            }
            return response.send('usuario y/o contraseña incorrecta')
        })
    })
})

router.get('/me', isAuthenticated, (request, response) => {
    response.send(request.user)
})

module.exports = router