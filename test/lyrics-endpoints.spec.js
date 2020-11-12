const { expect } = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { makeLyricsArray } = require('./lyrics.fixtures')

describe('Articles Endpoints', function () {
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
            describe.only('POST /lyrics/', () => {
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
                        .post('/lyrics')
                        .send(newLyrics)
                        .expect(201)
                        .expect(res => {
                            expect(res.body.title).to.eql(newLyrics.title)
                            expect(res.body.genre).to.eql(newLyrics.genre)
                            expect(res.body.mood).to.eql(newLyrics.mood)
                            expect(res.body.artist).to.eql(newLyrics.artist)
                            expect(res.body.lyrics).to.eql(newLyrics.lyrics)
                            expect(res.body).to.have.property('id')
                            expect(res.headers.location).to.eql(`/lyrics/${res.body.id}`)
                        })
                        .then(postRes =>
                            supertest(app)
                                .get(`/lyrics/${postRes.body.id}`)
                                .expect(postRes.body)
                        )
                })
                it(`responds with 400 and an error message when the 'title' is missing`, () => {
                    return supertest(app)
                        .post('/lyrics')
                        .send({
                            genre: 'Rap',
                            mood:'Happy',
                            artist:'Venus',
                            lyrics: 'Test new article content...'
                        })
                        .expect(400, {
                            error: { message: `Missing 'title' in request body` }
                        })
                })
                it(`responds with 400 and an error message when the 'genre' is missing`, () => {
                    return supertest(app)
                        .post('/lyrics')
                        .send({
                            title: 'Foo',
                            mood:'Happy',
                            artist:'Venus',
                            lyrics: 'Test new article content...'
                        })
                        .expect(400, {
                            error: { message: `Missing 'genre' in request body` }
                        })
                })
                it(`responds with 400 and an error message when the 'mood' is missing`, () => {
                    return supertest(app)
                        .post('/lyrics')
                        .send({
                            title: 'Foo',
                            genre:'Rap',
                            artist:'Venus',
                            lyrics: 'Test new article content...'
                        })
                        .expect(400, {
                            error: { message: `Missing 'mood' in request body` }
                        })
                })
                it(`responds with 400 and an error message when the 'artist' is missing`, () => {
                    return supertest(app)
                        .post('/lyrics')
                        .send({
                            title: 'Foo',
                            genre:'Rap',
                            mood:'Sad',
                            lyrics: 'Test new article content...'
                        })
                        .expect(400, {
                            error: { message: `Missing 'artist name' in request body` }
                        })
                })
                it(`responds with 400 and an error message when the 'lyrics' is missing`, () => {
                    return supertest(app)
                        .post('/lyrics')
                        .send({
                            title: 'Foo',
                            genre:'Rap',
                            mood:'Sad',
                            artist: 'Neptune'
                        })
                        .expect(400, {
                            error: { message: `Missing 'lyrics' in request body` }
                        })
                })
            })
        })

    })
})