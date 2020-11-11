const { expect } = require('chai');

const lyric_router = require('../src/Lyrics/lyric-router');
const supertest = require('supertest');

describe('GET /lyrics',()=>{
it('Should show lyrics database should be an array',()=>{
  const query = [
    {
        id:1,
        title: "Hello",
        rating: 5,
        genre:"Rap",
        mood:"Happy",
        artist:"Foo",
        lyrics:"Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis Leo sociosqu sagittis nascetur netus congue? Dapibus cubilia praesent nam magnis ante felis",
        expanded:false
    }
  ]
    return supertest(lyric_router)
    .get('/lyrics')
    .query(query)
    .expect(200) // supertest expect
    .expect('Content-Type', /json/)
    .then(res => {
      expect(res.body).to.have.all.keys('array');
      // expect(res.body).to.have.all.keys('title','rating','genre','mood','artist','lyrics');
      // array must not be empty
      expect(res.body).to.have.lengthOf.at.least(1);
    })
})
})
