const express = require('express')
const response = require('../network/response')
const Store = require('../store/redis')

const router = express.Router()

router.get('/:table', list)
router.get('/:table/:id', get)
router.put('/:table/', upsert)

function list(req, res, next) {
    Store.list(req.params.table)
        .then(data => response.success(req, res, data, 200))
        .catch(error => response.error(req, res, error.message, error.status))
}

function get(req, res, next) {
    Store.get(req.params.table, req.params.id)
        .then(data => response.success(req, res, data, 200))
        .catch(error => response.error(req, res, error.message, error.status))
}

function upsert(req, res, next) {
    Store.upsert(req.params.table, req.body)
        .then(data => response.success(req, res, data, 200))
        .catch(error => response.error(req, res, error.message, error.status))
}


module.exports = router