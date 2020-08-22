const express = require('express')
const Meals = require('../models/Meals')

const router = express.Router()

router.get('/', (request, response) => {
    Meals.find()
        .exec()
        .then( x => response.status(200).send(x) )
})

router.get('/:id', (request, response) => {
    Meals.findById(request.params.id)
        .exec()
        .then( x => response.status(200).send(x) )
})

router.post('/', (request, response) => {
    Meals.create(request.body)
        .then( x => response.status(201).send(x) )
})

router.put('/:id', (request, response) => {
    Meals.findByIdAndUpdate(request.params.id, request.body)
        .then( x => response.sendStatus(204) )
})

router.delete('/:id', (request, response) => {
    Meals.findByIdAndDelete(request.params.id)
        .exec()
        .then( x => response.sendStatus(204) )
})

module.exports = router