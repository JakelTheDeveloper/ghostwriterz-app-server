const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const jwt = require('jsonwebtoken');
const testHelpers = require('./test-helpers');

describe(`Auth Endpoint`, () => {
    let db;
   
    // let testUsers = [
    //     {
    //       id: 1,
    //       fullname: 'Foo',
    //       username: 'foo@gmail.com',
    //       nickname: 'DemoFoo',
    //       password: 'secret',
    //       date_created: '2029-01-22T16:28:32.615Z'
    //     },
    //     {
    //         id: 2,
    //         fullname: 'Peregrin Took',
    //         username: 'peregrin.took@shire.com',
    //         nickname: 'Pippin',
    //         password: 'lololo',
    //         date_created: '2100-05-22T16:28:32.615Z',
    //       }
    // ]

    let { testData,userData } = testHelpers.makeAllFixtures();

    before(`Make a connection`, () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        });
        app.set('db', db);
    });

    before(`Clean tables before all tests`, () => helpers.truncateAllTables(db));
    afterEach(`Clean tables after each test`, () => helpers.truncateAllTables(db));
    after(`Destroy the connection`, () => db.destroy());

    describe.only(`POST /signin endpoint`, () => {
    //     beforeEach(`Seed user table before each test`, () => {
    //         return db
    //     .into('ghostwriterz_users')
    //     .insert(testUsers)
    // })
    beforeEach(`Seed user table before each test`, () => helpers.seedAllTables(db, userData));
      
        const requiredLoginFields = ['username', 'password']

        requiredLoginFields.forEach(field => {
            const loginInputs = {
                username: userData[0].username,
                password: userData[0].password,
            };
            console.log(loginInputs)
            delete loginInputs[field]
         
            it(`POST /api/auth/signin responds with 400 and 'Missing ${field} in body' error`, () => {
                return supertest(app)
                    .post('/api/auth/signin')
                    .send(loginInputs)
                    .expect(400, {error: `Missing ${field} in body`})
            });
        });

        it(`POST /api/auth/signin responds with 401 and 'Invalid username or password' error when invalid user_name`, () => {
            const invalidUserName = {username: 'Meow', password: userData[0].password}

            return supertest(app)
                .post('/api/auth/signin')
                .send(invalidUserName)
                .expect(401, {error: 'Invalid username'})
        });

        it(`POST /api/auth/signin responds with 401 and 'Invalid username or password' error when invalid user_password`, () => {
            const invalidUserPassword = {username: userData[0].username, password: 'yournotsoamazingpassword'}

            return supertest(app)
                .post('/api/auth/signin')
                .send(invalidUserPassword)
                .expect(401, {error: 'Invalid password'})
        });

        it(`POST /api/auth/signin responds with 200 and token when valid username and userpassword`, () => {
            const userValidCreds = {
                      username: userData[0].username,
                      password: userData[0].password,
                    }
                    
                    
            const token = jwt.sign(
                { id: userData[0].id },
                process.env.JWT_SECRET,
                {
                    subject: userData[0].username,
                    algorithm: 'HS256',
                } 
            );
            return supertest(app)
                .post('/api/auth/signin')
                .set('Authorization', helpers.makeJWTAuthHeader(userData[0]))
                .send(userValidCreds)
                .expect(200, {authToken: token})
        });
    });
});