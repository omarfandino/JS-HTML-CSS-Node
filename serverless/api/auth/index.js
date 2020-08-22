const jwt = require('jsonwebtoken')
const Users = require('../models/Users')

const isAuthenticated = (request, response, next) => {
    const token = request.headers.authorization
    if (!token) {
        return response.sendStatus(403)
    }
    jwt.verify(token, 'mi-secreto', (error, decoded) => {
        const { _id } = decoded
        Users.findOne({ _id }).exec()
        .then(user => {
            request.user = user
            next()
        })
    })
}

const hasRoles = roles => (request, response, next) => {
    if(roles.indexOf(request.user.role) > -1 ){
        return next()
    }
    response.sendStatus(403)
}

module.exports = {
    isAuthenticated,
    hasRoles,
}