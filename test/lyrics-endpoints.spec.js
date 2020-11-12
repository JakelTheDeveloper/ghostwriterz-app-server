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

    describe('GET /lyrics', () => {
        context('Given there are lyrics in the database', () => {
            const testData = makeLyricsArray()
            beforeEach('insert Lyrics', () => {
                return db
                    .into('lyric_data')
                    .insert(testData)
            })
            it('responds with 200 of all articles', () => {
                return supertest(app)
                    .get('/lyrics')
                    .expect(200, testData)
            })
        })
        describe('GET /lyrics/:lyric_id', () => {
            context('Given there are lyrics in the database', () => {
                const testData = makeLyricsArray()

                beforeEach('insert lyrics', () => {
                    return db
                        .into('lyric_data')
                        .insert(testData)
                })

                it('responds with 200 and the specified lyrics', () => {
                    const lyricId = 2
                    const expectedLyric = testData[lyricId - 1]
                    return supertest(app)
                        .get(`/lyrics/${lyricId}`)
                        .expect(200, expectedLyric)
                })
            })
            describe('GET /lyrics', () => {
                context('Given there are lyrics in the database', () => {
                    it(`responds with 200 and an empty list`, () => {
                        return supertest(app)
                            .get('/lyrics')
                            .expect(200, [])
                    })
                })
            })
            describe('GET /lyrics/:lyric_id', () => {
                context('Given no lyrics', () => {
                    it(`responds with 404`, () => {
                        const lyricId = 123456
                        return supertest(app)
                            .get(`/lyrics/${lyricId}`)
                            .expect(404, { error: { message: `Lyrics doesn't exist` } })
                    })
                })
            })
        })

    })
})