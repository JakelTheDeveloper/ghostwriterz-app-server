const LyricsService = require('../src/Lyrics/lyric-service')
const knex = require('knex')
const { test } = require('mocha')
const { expect } = require('chai')
const helpers = require('../test/test-helpers')
const app = require('../src/app')
const supertest = require('supertest')


describe(`Lyrics service object`, function () {
    let db
    let testData = [
        {
            id: 1,
            title: "Hello",
            genre: "Rap",
            mood: "Happy",
            artist: 1,
            lyrics: "Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis"
        },
        {
            id: 2,
            title: "Bye",
            genre: "Soul",
            mood: "Sad",
            artist: 1,
            lyrics: "Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis"
        },
        {
            id: 3,
            title: "See You Again",
            genre: "Rock",
            mood: "Energetic",
            artist: 2,
            lyrics: "Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis"
        },
    ]

    let testUsers = [
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
            password: 'secretA',
            date_created: '2100-05-22T16:28:32.615Z',
        }
    ];
    // const {testData,userData} = helpers.makeAllFixtures();
    const testUser = testUsers[0]

    before('Make a connection', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    before('clean tables before all test', () => helpers.truncateAllTables(db))

    afterEach('cleanup tables after each test', () => helpers.truncateAllTables(db))

    after('destroy the connection', () => db.destroy())

    context(`Given 'lyric_data' has data`, () => {
        beforeEach(`Seed all tables before each test in this context`, () => {
            // return helpers.seedAllTables(db,userData,testData)
            return db
                .into('ghostwriterz_users')
                .insert(testUsers)
                .then(() => {
                    return db
                        .into('lyric_data')
                        .insert(testData)
                })
        })
        // return helpers.seedAllTables(db,userData,testData)
        it(`getAllLyrics() resolves all lyrics from 'lyrics_data' table`, () => {
            return LyricsService.getAllLyrics(db)
                .then(actual => {
                    expect(actual).to.eql(testData)
                })
        })

        it(`getById() resolves lyric by id from 'lyric_data' table`, () => {
            const thirdId = 2
            const thirdTestLyrics = testData[thirdId - 1]
            return LyricsService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: thirdId,
                        title: thirdTestLyrics.title,
                        genre: thirdTestLyrics.genre,
                        mood: thirdTestLyrics.mood,
                        artist: thirdTestLyrics.artist,
                        lyrics: thirdTestLyrics.lyrics
                    })
                })
        })
        it(`deleteLyric() removes lyric by id from 'lyric_data' table`, () => {
            const lyricsId = 3
            return LyricsService.deleteLyrics(db, lyricsId)
                .then(() => LyricsService.getAllLyrics(db))
                .then(allLyrics => {

                    const expected = testData.filter(lyrics => lyrics.id !== lyricsId)
                    expect(allLyrics).to.eql(expected)
                })
        })
        it(`updateLyrics() updates lyrics from the 'lyric_data' table`, () => {
            const idOfLyricsToUpdate = 3
            const newLyricsData = {
                title: 'updated title',
                genre: 'Rap',
                mood: 'Happy',
                artist: 2,
                lyrics: 'updated lyrics'
            }
            return LyricsService.updateLyrics(db, idOfLyricsToUpdate,newLyricsData.artist, newLyricsData)
                .then(() => LyricsService.getById(db, idOfLyricsToUpdate))
                .then(lyrics => {
                    expect(lyrics).to.eql({
                        id: idOfLyricsToUpdate,
                        ...newLyricsData,
                    })
                })
        })
    })
    context(`Given 'lyric_data' has no data`, () => {
        it(`getAllLyrics() resolves an empty array`, () => {
            return LyricsService.getAllLyrics(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })
        it(`insertLyric() inserts a new lyric and resolves the new lyric with an 'id'`, () => {
            const newLyrics = {
                title: "See",
                genre: "Rock",
                mood: "Energetic",
                artist: 1,
                lyrics: "Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis"
            }
            return db
            .into('ghostwriterz_users')
            .insert(testUsers)
            .then(()=>{
                return LyricsService.insertLyrics(db,newLyrics)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        title: "See",
                        genre: "Rock",
                        mood: "Energetic",
                        artist: 1,
                        lyrics: "Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis"
                    })
                })
            })
        })
    })
})
