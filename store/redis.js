const redis = require('redis')
const config = require('../config')

const client = redis.createClient({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password
})

function list(table) {
    return new Promise((resolve, reject) => {
        client.get(table, (error, data) => {
            if (error) {
                return reject(error)
            }
            let response = data || null
            if (data) {
                response = JSON.parse(data)
            }
            resolve(response)
        })
    })
}

function get(table, id) {

}

async function upsert(table, data) {
    let key = table
    if (data && data.id) {
        key = key + '_' + data.id
    }
    client.setex(key, 10, JSON.stringify(data))
    return true
}

module.exports = {
    list, get, upsert
}