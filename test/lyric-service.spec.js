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
            id: 20,
            title: "Hello",
            genre: "Rap",
            mood: "Happy",
            artist: "Foo",
            lyrics: "Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis"
        },
        {
            id: 21,
            title: "Bye",
            genre: "Soul",
            mood: "Sad",
            artist: "Bar",
            lyrics: "Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis"
        },
        {
            id: 22,
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

    before(() => {
        return db
            .into('lyric_data')
            .insert(testData)
    })
    after(() => db.destroy())
    describe(`getAllArticles`, () => {
        it(`resolves all articles from 'blogful_articles' table`, () => {
            // test that ArticlesService.getAllArticles gets data from table
            return LyricService.getAllArticles(db)
                .then(actual => {
                    expect(actual).to.eql(testData) 
                    expect(actual[0].title).to.eql(actual.map(i=>{
                        i[0].title
                 }))
            })
        })
    })
})