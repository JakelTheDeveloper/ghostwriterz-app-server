const { expect } = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const helpers = require('../test/test-helpers')
const app = require('../src/app')

describe(`Lyric Router Endpoint`, () => {
  let db
  let { testData, userData } = helpers.makeAllFixtures()

  before(`Make a connection`, () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  before('clean tables before all test', () => helpers.truncateAllTables(db))

  afterEach('cleanup tables after each test', () => helpers.truncateAllTables(db))

  after('destroy the connection', () => db.destroy())
  describe.only('Lyric-Router', () => {
    beforeEach(`Seed user table before each test`, () => helpers.seedAllTables(db, userData, testData))
    it('GET / responds with 200 containing Data', () => {
      return supertest(app)
        .get('/api/lyrics')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf.at.least(1);
          expect(res.body[0]).to.have.all.keys('id', 'title', 'genre', 'mood', 'artist', 'lyrics');
          expect(res.body[0].id).to.be.an('number');
          expect(res.body[0].title).to.be.an('string');
          expect(res.body[0].genre).to.be.an('string');
          expect(res.body[0].mood).to.be.an('string');
          expect(res.body[0].artist).to.be.an('number');
          expect(res.body[0].lyrics).to.be.an('string');
        })
    })
  })
})