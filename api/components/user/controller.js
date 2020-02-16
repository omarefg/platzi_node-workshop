const auth = require('../auth')

const TABLE = 'user'

module.exports = function (injectedStore, injectedCache) {
    let cache = injectedCache
    let store = injectedStore

    if (!store) {
        store = require('../../../store/dummy')
    }

    if (!cache) {
        cache = require('../../../store/dummy')
    }

    async function list() {
        let users = await cache.list(TABLE)
        if (!users) {
            console.log('Was not in cache, looking in DB')
            users = await store.list(TABLE)
            cache.upsert(TABLE, users)
        } else {
            console.log('IT was in cache')
        }
        return users
    }

    function get(id) {
        return store.get(TABLE, id)
    }

    async function upsert (body) {
        const user = {
            name: body.name,
            username: body.username
        }

        if (body.id) {
            user.id = body.id
        }

        if (body.password || body.username) {
            await auth.upsert({
                id: user.id,
                username: user.username,
                password: body.password
            })
        }

        return store.upsert(TABLE, user)
    }

    function follow(from, to) {
        return store.upsert(TABLE + '_follow', {
            user_from: from,
            user_to: to
        })
    }

    async function following(user) {
        const join = {}
        join[TABLE] = 'user_to'
        const query = { user_from: user }
        return await store.query(TABLE + '_follow', query, join)
    }

    return {
        list,
        get,
        upsert,
        follow,
        following
    }
}