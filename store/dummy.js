const db = {
    user: [
        { id: '1', name: 'Omar' },
        { id: '2', name: 'Enrique' },
    ]
}

async function list(table) {
    return db[table]
}

async function get(table, id) {
    return db[table].find(row => row.id === id)
}

async function upsert(table, data) {
    if (!db[table]) {
        db[table] = []
    }
    db[table].push(data)
    console.log(db)
}

async function remove(table, id) {
    return true
}

async function query(table, q) {
    const keys = Object.keys(q)
    const key = keys[0]
    return db[table].filter(row => row[key] === q[key])[0] || null
}

module.exports = {
    list,
    get,
    upsert,
    remove,
    query
}