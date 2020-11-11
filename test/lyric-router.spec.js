// const { expect } = require('chai');

// const lyric_router = require('../src/Lyrics/lyric-router');
// const supertest = require('supertest');

// describe('GET /lyrics',()=>{
// it('Should show lyrics database should be an array',()=>{
//   const query = [
//     {
//         id:1,
//         title: "Hello",
//         rating: 5,
//         genre:"Rap",
//         mood:"Happy",
//         artist:"Foo",
//         lyrics:"Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis",
//         expanded:false
//     }
//   ]
//     return supertest(lyric_router)
//     .get('/lyrics')
//     .query(query)
//     .expect(200) // supertest expect
//     .expect('Content-Type', /json/)
//     .then(res => {
//       expect(res.body).to.have.all.keys('array');
//       // expect(res.body).to.have.all.keys('title','rating','genre','mood','artist','lyrics');
//       // array must not be empty
//       expect(res.body).to.have.lengthOf.at.least(1);
//     })
// })
// })

const { expect } = require('chai')
const supertest = require('supertest')
const app = require('../src/app');

describe('Lyric-Router', () => {
  it('GET / responds with 200 containing Data', () => {
    return supertest(app)
      .get('/lyrics')
      .expect('Content-Type', /json/)
      .then(res => {
        // expect(200,res.body)
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(1);
        expect(res.body[0]).to.have.all.keys('id','title','rating','genre','mood','artist','lyrics','expanded');
        expect(res.body[0].id).to.be.an('number');
        expect(res.body[0].title).to.be.an('string');
        expect(res.body[0].rating).to.be.an('number');
        expect(res.body[0].genre).to.be.an('string');
        expect(res.body[0].mood).to.be.an('string');
        expect(res.body[0].artist).to.be.an('string');
        expect(res.body[0].lyrics).to.be.an('string');
        expect(res.body[0].expanded).to.be.an('boolean');
      })
  })
})