const mysql = require('mysql')
const config = require('../config')

const dbConf = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
}

let connection

function handleCon() {
    connection = mysql.createConnection(dbConf)
    connection.connect(error => {
        if (error) {
            console.error('[DB Error] ', error)
            setTimeout(handleCon, 2000)
        } else {
            console.log('DB Connected')
        }
    })
    connection.on('error', error => {
        console.error('[DB Error] ', error)
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
            handleCon()
        } else {
            throw error
        }
    })
}

handleCon()

function list(table) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table}`, (error, data) => {
            if (error) {
                return reject(error)
            }
            resolve(data)
        })
    })
}

function get(table, id) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table} WHERE id=${id}`, (error, data) => {
            if (error) {
                return reject(error)
            }
            resolve(data)
        })
    })
}

function insert(table, data) {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO ${table} SET ?`, data, (error, result) => {
            if (error) {
                return reject(error)
            }
            resolve(result)
        })
    })
}

function update(table, data) {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE ${table} SET ? WHERE id=?`, [data, data.id], (error, result) => {
            if (error) {
                return reject(error)
            }
            resolve(result)
        })
    })
}


function upsert(table, data) {
    if (data && data.id) {
        return update(table, data)
    } else {
        return insert(table, data)
    }
}

function query(table, query, join) {
    let joinQuery = ''
    if (join) {
        const key = Object.keys(join)[0]
        const val = join[key]
        joinQuery = `JOIN ${key} on ${table}.${val} = ${key}.id`
    }
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table} ${joinQuery} WHERE ?`, query, (error, result) => {
            if (error) {
                return reject(error)
            }
            resolve(result[0] || null)
        })
    })
}

module.exports = {
    list,
    get,
    upsert,
    query,
    insert
}

