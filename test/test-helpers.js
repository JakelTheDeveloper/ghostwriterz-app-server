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
            id:1,
            fullname: 'Foo',
            username: 'foo@gmail.com',
            nickname: 'DemoFoo',
            password: 'secret',
            date_created: '2029-01-22T16:28:32.615Z'
          },
          {
              id:2,
              fullname: 'Peregrin Took',
              username: 'peregrin.took@shire.com',
              nickname: 'Pippin',
              password: 'lololo',
              date_created: '2100-05-22T16:28:32.615Z',
            }
    ]
}

function makeAllFixtures() {
    const testData = makeLyricsArray()
    const userData = makeUsersArray()
    return {
        testData,
        userData
    }
}

async function seedUsersTable(db, users) {
    const preppedUsers = users.map((user) => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }))

    await db('ghostwriterz_users').insert(preppedUsers)
    await db.raw(`SELECT setval('ghostwriterz_users_id_seq', (SELECT MAX(id) + 1 FROM
    ghostwriterz_users))`);
}

function seedAllTables(
    db,
    users,
    lyrics
) {
    return db.transaction(async (trx) => {
        await seedUsersTable(trx, users)
        await trx('lyric_data').insert(lyrics)
    })
}

function truncateAllTables(db) {
    return db.raw(
        `TRUNCATE lyric_data, ghostwriterz_users RESTART IDENTITY CASCADE`
    )
}

function makeJWTAuthHeader(user, secret = process.env.JWT_SECRET) {
	const token = jwt.sign({ username: user.username }, secret, {
		subject: user.username,
		algorithm: 'HS256'
	});

	return `Bearer ${token}`;
}
module.exports = {
    makeJWTAuthHeader,
    makeUsersArray,
    makeLyricsArray,
    makeAllFixtures,
    seedUsersTable,
    seedAllTables,
    truncateAllTables
}
