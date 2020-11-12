const LyricService = require('../src/lyric-service')
const knex = require('knex')
const { test } = require('mocha')
const { expect } = require('chai')

// describe(`Articles service object`, function() {
//     it(`should run the tests`, () => {
//       expect(true).to.eql(false)
//     })
//   })
describe(`Articles service object`, function () {
    let db
    let testData = [
        {
            id: 1,
            title: "Hello",
            genre: "Rap",
            mood: "Happy",
            artist: "Foo",
            lyrics: "Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis"
        },
        {
            id: 2,
            title: "Bye",
            genre: "Soul",
            mood: "Sad",
            artist: "Bar",
            lyrics: "Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis"
        },
        {
            id: 3,
            title: "See You Again",
            genre: "Rock",
            mood: "Energetic",
            artist: "Lee",
            lyrics: "Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis"
        },
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    before(() => db('lyric_data').truncate())
    afterEach(() => db('lyric_data').truncate())
    after(() => db.destroy())

    context(`Given 'lyric_data' has data`, () => {
        beforeEach(() => {
            return db
                .into('lyric_data')
                .insert(testData)
        })

        it(`getAllLyrics() resolves all lyrics from 'lyrics_data' table`, () => {
            // test that ArticlesService.getAllArticles gets data from table
            return LyricService.getAllLyrics(db)
                .then(actual => {
                    expect(actual).to.eql(testData)
                })
        })

        it(`getById() resolves lyric by id from 'lyric_data' table`, () => {
            const thirdId = 3
            const thirdTestLyric = testData[thirdId - 1]
            return LyricService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: thirdId,
                        title: thirdTestLyric.title,
                        genre: thirdTestLyric.genre,
                        mood: thirdTestLyric.mood,
                        artist: thirdTestLyric.artist,
                        lyrics: thirdTestLyric.lyrics
                    })
                })
        })
        it(`deleteLyric() removes lyric by id from 'lyric_data' table`, () => {
            const lyricId = 3
            return LyricService.deleteLyrics(db, lyricId)
                .then(() => LyricService.getAllLyrics(db))
                .then(allLyrics => {
                    // copy the test lyrics array without the "deleted" lyric
                    const expected = testData.filter(lyric => lyric.id !== lyricId)
                    expect(allLyrics).to.eql(expected)
                })
        })
        it(`updateLyrics() updates lyrics from the 'lyric_data' table`, () => {
            const idOfLyricsToUpdate = 3
            const newLyricData = {
                title: 'updated title',
                genre: 'Rap',
                mood: 'Happy',
                artist: 'updated artist',
                lyrics: 'updated lyrics'
            }
            return LyricService.updateLyrics(db, idOfLyricsToUpdate, newLyricData)
                .then(() => LyricService.getById(db, idOfLyricsToUpdate))
                .then(lyric => {
                    expect(lyric).to.eql({
                        id: idOfLyricsToUpdate,
                        ...newLyricData,
                    })
                })
        })
    })
    context(`Given 'lyric_data' has no data`, () => {
        it(`getAllLyrics() resolves an empty array`, () => {
            return LyricService.getAllLyrics(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })
        it(`insertLyric() inserts a new lyric and resolves the new lyric with an 'id'`, () => {
            const newLyric = {
                title: "Hello",
                genre: "Rap",
                mood: "Happy",
                artist: "Foo",
                lyrics: "Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis"
            }
            return LyricService.insertLyrics(db, newLyric)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        title: "Hello",
                        genre: "Rap",
                        mood: "Happy",
                        artist: "Foo",
                        lyrics: "Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis"
                    })
                })
        })
    })
})
