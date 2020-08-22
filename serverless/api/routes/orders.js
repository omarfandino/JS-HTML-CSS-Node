const express = require('express')
const Orders = require('../models/Orders')
const { isAuthenticated } = require('../auth')

const router = express.Router()

router.get('/', (request, response) => {
    Orders.find()
        .exec()
        .then( x => response.status(200).send(x) )
})

router.get('/:id', (request, response) => {
    Orders.findById(request.params.id)
        .exec()
        .then( x => response.status(200).send(x) )
})

router.post('/', isAuthenticated, (request, response) => {
    const { _id } = request.user
    Orders.create({ ...request.body, user_id: _id })
        .then( x => response.status(201).send(x) )
})

router.put('/:id', isAuthenticated, (request, response) => {
    Orders.findByIdAndUpdate(request.params.id, request.body)
        .then( x => response.sendStatus(204) )
})

router.delete('/:id', isAuthenticated, (request, response) => {
    Orders.findByIdAndDelete(request.params.id)
        .exec()
        .then( x => response.sendStatus(204) )
})

module.exports = router