const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeLyricsArray } = require('./lyrics.fixtures')

describe.only('Articles Endpoints', function () {
    let db
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('lyric_data').truncate())

    afterEach('cleanup', () => db('lyric_data').truncate())

    context('Given there are lyrics in the database', () => {
        const testData = makeLyricsArray()
        beforeEach('insert Lyrics', () => {
            return db
                .into('lyric_data')
                .insert(testData)
        })
        it('GET /lyrics responds with 200 and all of the lyrics', () => {
                 return supertest(app)
                   .get('/lyrics')
                   .expect(200,testData)
               })
               it('GET /lyrics/:lyric_id responds with 200 and the specified lyrics', () => {
                    const lyricId = 2
                     const expectedLyric = testData[lyricId - 1]
                     return supertest(app)
                       .get(`/lyrics/${lyricId}`)
                       .expect(200, expectedLyric)
                   })
    })
})