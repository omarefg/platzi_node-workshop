const request = require('request')

function createRemoteDB (host, port) {
    const URL = `http://${host}:${port}`

    function req(method, table, data) {
        let url = `${URL}/${table}`
        let body = ''
        return new Promise((resolve, reject) => {
            request({
                method,
                headers: {
                    'content-type': 'application/json'
                },
                url,
                body
            }, (error, req, body) => {
                if (error) {
                    console.error('Erro with remote DB', error)
                    return reject(error.message)
                }
                const response = JSON.parse(body)
                return resolve(response.body)
            })
        })
    }

    function list(table){
        return req('GET', table)
    }

    function get(table, id){}
    function upsert(table, date){}
    function query(table, query, join){}

    return {
        list
    }
}

module.exports = createRemoteDB