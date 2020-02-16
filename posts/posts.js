const express = require('express')
const bodyParse = require('body-parser')

const config = require('../config.js')
const post = require('./components/post/network')
const errors = require('../network/errors')
const app = express()

app.use(bodyParse.json())


//ROUTER

app.use('/api/post', post)

app.use(errors)

app.listen(config.post.port, () => {
    console.log('Post Service listening on port', config.post.port)
})