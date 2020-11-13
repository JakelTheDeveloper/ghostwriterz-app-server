const { expect } = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { makeLyricsArray } = require('./lyrics.fixtures')

describe('Lyrics Endpoints', function () {
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

    describe('GET /api/lyrics', () => {
        context('Given there are lyrics in the database', () => {
            const testData = makeLyricsArray()
            beforeEach('insert Lyrics', () => {
                return db
                    .into('lyric_data')
                    .insert(testData)
            })
            it('responds with 200 of all lyrics', () => {
                return supertest(app)
                    .get('/api/lyrics')
                    .expect(200, testData)
            })
        })
        describe('GET /api/lyrics/:lyric_id', () => {
            context(`Given an XSS attack lyrics`, () => {
                const maliciousLyrics = {
                    id: 911,
                    title: "Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;",
                    genre: "Rap",
                    mood: "Happy",
                    artist: "Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;",
                    lyrics: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
                }

                beforeEach('insert malicious lyrics', () => {
                    return db
                        .into('lyric_data')
                        .insert([maliciousLyrics])
                })

                it('removes XSS attack content', () => {
                    return supertest(app)
                        .get(`/api/lyrics/${maliciousLyrics.id}`)
                        .expect(200)
                        .expect(res => {
                            expect(res.body.title).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;')
                            expect(res.body.artist).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;')
                            expect(res.body.lyrics).to.eql(`Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`)
                        })
                })
            })
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
                        .get(`/api/lyrics/${lyricId}`)
                        .expect(200, expectedLyric)
                })
            })
            describe('GET /api/lyrics', () => {
                context('Given there are lyrics in the database', () => {
                    it(`responds with 200 and an empty list`, () => {
                        return supertest(app)
                            .get('/api/lyrics')
                            .expect(200, [])
                    })
                })
            })
            describe('GET /api/lyrics/:lyric_id', () => {
                context('Given no lyrics', () => {
                    it(`responds with 404`, () => {
                        const lyricId = 123456
                        return supertest(app)
                            .get(`/api/lyrics/${lyricId}`)
                            .expect(404, { error: { message: `Lyrics doesn't exist` } })
                    })
                })
            })
            describe('POST /api/lyrics/', () => {
                it('Creates lyrics, responding with 201 and new lyrics', function () {
                    this.retries(3)
                    const newLyrics = {
                        title: "Boo",
                        genre: "Rap",
                        mood: "Happy",
                        artist: "Neptune",
                        lyrics: "Pumbay gdf nergui ergunggs egndfuigner gndfignerg egnerigne gnriegnfg ngieng gnreign erngiengien gerging e gerignagrng renairugnafginerug geau gniergrag naginreaig nergungaringpnergunbdf giuerugngngnargd"
                    }
                    return supertest(app)
                        .post('/api/lyrics')
                        .send(newLyrics)
                        .expect(201)
                        .expect(res => {
                            expect(res.body.title).to.eql(newLyrics.title)
                            expect(res.body.genre).to.eql(newLyrics.genre)
                            expect(res.body.mood).to.eql(newLyrics.mood)
                            expect(res.body.artist).to.eql(newLyrics.artist)
                            expect(res.body.lyrics).to.eql(newLyrics.lyrics)
                            expect(res.body).to.have.property('id')
                            expect(res.headers.location).to.eql(`/api/lyrics/${res.body.id}`)
                        })
                        .then(postRes =>
                            supertest(app)
                                .get(`/api/lyrics/${postRes.body.id}`)
                                .expect(postRes.body)
                        )
                })
                const requiredFields = ['title', 'genre', 'mood', 'artist', 'lyrics']

                requiredFields.forEach(field => {
                    const newLyrics = {
                        title: 'Test new article',
                        genre: "Rap",
                        mood: "Happy",
                        artist: 'Listicle',
                        lyrics: 'Test new article content...'
                    }

                    it(`responds with 400 and an error message when the '${field}' is missing`, () => {
                        delete newLyrics[field]

                        return supertest(app)
                            .post('/api/lyrics')
                            .send(newLyrics)
                            .expect(400, {
                                error: { message: `Missing '${field}' in request body` }
                            })
                    })
                })

                // it(`responds with 400 and an error message when the 'title' is missing`, () => {
                //     return supertest(app)
                //         .post('/api/lyrics')
                //         .send({
                //             genre: 'Rap',
                //             mood: 'Happy',
                //             artist: 'Venus',
                //             lyrics: 'Test new article content...'
                //         })
                //         .expect(400, {
                //             error: { message: `Missing 'title' in request body` }
                //         })
                // })
            })
        })
        describe(`DELETE /api/lyrics/:lyric_id`, () => {
            context('Given there are lyrics in the database', () => {
                const testLyrics = makeLyricsArray()

                beforeEach('insert lyrics', () => {
                    return db
                        .into('lyric_data')
                        .insert(testLyrics)
                })

                it('responds with 204 and removes the lyrics', () => {
                    const idToRemove = 2
                    const expectedLyrics = testLyrics.filter(lyrics => lyrics.id !== idToRemove)
                    return supertest(app)
                        .delete(`/api/lyrics/${idToRemove}`)
                        .expect(204)
                        .then(res =>
                            supertest(app)
                                .get(`/api/lyrics`)
                                .expect(expectedLyrics)
                        )
                })
            })
            describe.only(`PATCH /api/lyrics/:lyric_id`, () => {
                context(`Given no lyrics`, () => {
                    it(`responds with 404`, () => {
                        const lyricId = 123456
                        return supertest(app)
                            .patch(`/api/lyrics/${lyricId}`)
                            .expect(404, { error: { message: `Lyrics doesn't exist` } })
                    })
                })
                context('Given there are Lyrics in the database', () => {
                    const testLyrics = makeLyricsArray()

                    beforeEach('insert lyrics', () => {
                        return db
                            .into('lyric_data')
                            .insert(testLyrics)
                    })

                    it('responds with 204 and updates the lyrics', () => {
                        const idToUpdate = 2
                        const updateLyrics = {
                            title: "updated title",
                            genre: "Jazz",
                            mood: "Energetic",
                            artist: "updated artist",
                            lyrics: "updated lyrics"
                        }
                        const expectedLyrics = {
                            ...testLyrics[idToUpdate - 1],
                            ...updateLyrics
                        }
                        return supertest(app)
                            .patch(`/api/lyrics/${idToUpdate}`)
                            .send(updateLyrics)
                            .expect(204)
                            .then(res =>
                                supertest(app)
                                    .get(`/api/lyrics/${idToUpdate}`)
                                    .expect(expectedLyrics)
                            )
                    })
                })
            })
            it(`responds with 400 when no required fields supplied`, () => {
                const idToUpdate = 2
                return supertest(app)
                    .patch(`/api/lyrics/${idToUpdate}`)
                    .send({ irrelevantField: 'foo' })
                    .expect(400, {
                        error: {
                            message: `Request body must contain either 'title', 'genre', 'mood', 'artist' or 'lyrics'`
                        }
                    })
            })
            it(`responds with 204 when updating only a subset of fields`, () => {
                const idToUpdate = 2
                const updateLyrics = {
                    title: 'updated lyrics title',
                }
                const expectedLyrics = {
                    ...testLyrics[idToUpdate - 1],
                    ...updateLyrics
                }

                return supertest(app)
                    .patch(`/api/lyrics/${idToUpdate}`)
                    .send({
                        ...updateLyrics,
                        fieldToIgnore: 'should not be in GET response'
                    })
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/api/lyrics/${idToUpdate}`)
                            .expect(expectedLyrics)
                    )
            })
        })
    })
})