const { expect } = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app');


describe('Lyric-Router', () => {
  it('GET / responds with 200 containing Data', () => {
    return supertest(app)
      .get('/')
      .expect(200)
  //     .set('Accept', 'application/json')
  //     .expect('Content-Type', /json/)
  //     .then(res => {
  //       expect(res.body).to.be.an('array');
  //       expect(res.body).to.have.lengthOf.at.least(1);
  //       expect(res.body[0]).to.have.all.keys('id','title','rating','genre','mood','artist','lyrics','expanded');
  //       expect(res.body[0].id).to.be.an('number');
  //       expect(res.body[0].title).to.be.an('string');
  //       expect(res.body[0].rating).to.be.an('number');
  //       expect(res.body[0].genre).to.be.an('string');
  //       expect(res.body[0].mood).to.be.an('string');
  //       expect(res.body[0].artist).to.be.an('string');
  //       expect(res.body[0].lyrics).to.be.an('string');
  //       expect(res.body[0].expanded).to.be.an('boolean');
  //     })
  })
})