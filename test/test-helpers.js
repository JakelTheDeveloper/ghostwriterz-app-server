const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeLyricsArray() {
    return [
        {
            "id": 1,
            "title": "Hello",
            "lyrics": "Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis",
            "genre": "Rap",
            "mood": "Happy",
            "artist": 1,

        },
        {
            "id": 2,
            "title": "How You Doin",
            "lyrics": "Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis",
            "genre": "Jazz",
            "mood": "Energetic",
            "artist": 1,

        },
        {
            "id": 3,
            "title": "Down By The Roadside",
            "lyrics": "Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis",
            "genre": "Classical",
            "mood": "Happy",
            "artist": 2,

        },
        {
            "id": 4,
            "title": "How Are You",
            "lyrics": "Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis",
            "genre": "Hip Hop",
            "mood": "Energetic",
            "artist": 2,

        },
    ]
}

function makeUsersArray() {
    return [
        {
            id: 1,
            fullname: 'Sam Gamgee',
            username: 'sam.gamgee@shire.com',
            nickname: 'Sam',
            password: 'secret',
            date_created: '2029-01-22T16:28:32.615Z'
        },
        {
            id: 2,
            fullname: 'Peregrin Took',
            username: 'peregrin.took@shire.com',
            nickname: 'Pippin',
            password: 'secret',
            date_created: '2100-05-22T16:28:32.615Z',
        }
    ]
}

function makeAllFixtures() {
    const testData = makeUsersArray()
    const userData = makeLyricsArray()

    return {
        testData,
        userData
    }
}

async function seedUsersTable(db, users) {
    const preppedUsers = users.map((user) => ({
        ...user,
        user_password: bcrypt.hashSync(user.user_password, 1)
    }))

    await db('ghostwriterz_users').insert(preppedUsers)
    await db.raw(
        `SELECT setval('ghostwriterz_users_user_id_seq', ?)`,
        users[users.length - 1].user_id
    )
}

function seedAllTables(
    db,
    users,
    lyrics
) {
    return db.transaction(async (trx) => {
        await seedUsersTable(trx, users)
        await trx('ghostwriterz_users').insert(users)
        await trx('lyric_data').insert(lyrics)
        // await db.raw(
        // 	`SELECT setval('acclimate_user_task_user_task_id_seq', ?)`,
        // 	userTasks[userTasks.length - 1].user_task_id
        // )
        // await trx('acclimate_user_shopping_item').insert(userShoppingItems)
        // await db.raw(
        // 	`SELECT setval('acclimate_user_shopping_item_user_shopping_item_id_seq', ?)`,
        // 	userShoppingItems[userShoppingItems.length - 1].user_shopping_item_id
        // )
    })
}

function truncateAllTables(db) {
    return db.raw(
        `TRUNCATE lyric_data, ghostwriterz_users RESTART IDENTITY CASCADE`
    )
}

module.exports = {
    makeUsersArray,
    makeLyricsArray,
    makeAllFixtures,
    seedUsersTable,
    seedAllTables,
    truncateAllTables
    // makeJWTAuthHeader
}
