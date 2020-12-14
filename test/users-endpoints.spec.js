const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const helpers = require('./test-helpers')
const bcrypt = require('bcryptjs')
describe('Users Endpoints', function () {
    let db

    const { userData } = helpers.makeAllFixtures()
    const testUser = userData[0]

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    before('cleanup', () => helpers.truncateAllTables(db))

    afterEach('cleanup', () => helpers.truncateAllTables(db))

    after('disconnect from db', () => db.destroy())

    describe(`POST /api/users`, () => {
        context(`User Validation`, () => {
            beforeEach('insert users', () =>
                helpers.seedUsersTable(
                    db,
                    userData,
                )
            )

            const requiredFields = ['username', 'password', 'fullname', 'nickname', 'passwordConfirm']

            let registerAttemptBody = {
                username: ' ',
                password: ' ',
                fullname: ' ',
                nickname: ' ',
                passwordConfirm: ' '
            }
            it(`responds with 400 required error when 'email' is missing`, () => {
                registerAttemptBody = {
                    username: null,
                    password: 'P@ssword!',
                    passwordConfirm: 'P@ssword!',
                    fullname: 'test full_name',
                    nickname: 'test nickname',
                }
                return supertest(app)
                    .post('/api/users')
                    .send(registerAttemptBody)
                    .expect(400, {
                        error: { message: `Missing 'email' in request body` },
                    })
            })
            it(`responds with 400 required error when 'fullname' is missing`, () => {
                registerAttemptBody = {
                    username: 'Foo',
                    password: 'P@ssword!',
                    passwordConfirm: 'P@ssword!',
                    fullname: null,
                    nickname: 'test nickname',
                }
                return supertest(app)
                    .post('/api/users')
                    .send(registerAttemptBody)
                    .expect(400, {
                        error: `Missing 'fullname' in request body`,
                    })
            })
            it(`responds with 400 required error when 'nickname' is missing`, () => {
                registerAttemptBody = {
                    username: 'Foo',
                    password: 'P@ssword!',
                    passwordConfirm: 'P@ssword!',
                    fullname: 'FooMan',
                    nickname: null,
                }
                return supertest(app)
                    .post('/api/users')
                    .send(registerAttemptBody)
                    .expect(400, {
                        error: { message: `Missing 'username' in request body` },
                    })
            })
            it(`responds with 400 required error when 'password' is missing`, () => {
                registerAttemptBody = {
                    username: 'Foo',
                    password: null,
                    passwordConfirm: null,
                    fullname: 'FooMan',
                    nickname: 'FooFoo',
                }
                return supertest(app)
                    .post('/api/users')
                    .send(registerAttemptBody)
                    .expect(400, {
                        error: `Missing 'password' in request body`,
                    })
            })
            it(`responds with 400 required error when password length is too short`, () => {
                registerAttemptBody = {
                    username: 'Foo',
                    password: 'short',
                    passwordConfirm: 'short',
                    fullname: 'FooMan',
                    nickname: 'FooFoo',
                }
                return supertest(app)
                    .post('/api/users')
                    .send(registerAttemptBody)
                    .expect(400, {
                        error: { message: `Password must be between 8-72 characters long` },
                    })
            })
            it(`responds with 400 required error when password has spaces at beginning and/or end`, () => {
                registerAttemptBody = {
                    username: 'Foo',
                    password: ' spaceatbeginning',
                    passwordConfirm: ' spaceatbeginning',
                    fullname: 'FooMan',
                    nickname: 'FooFoo',
                }
                return supertest(app)
                    .post('/api/users')
                    .send(registerAttemptBody)
                    .expect(400, {
                        error: { message: `Password must have no spaces at beginning or end` },
                    })
            })
            it(`responds with 400 required error when password doesn't contain 1 upper case, lower case, number, and special character`, () => {
                registerAttemptBody = {
                    username: 'Foo',
                    password: 'spaceatbeginning',
                    passwordConfirm: 'spaceatbeginning',
                    fullname: 'FooMan',
                    nickname: 'FooFoo',
                }
                return supertest(app)
                    .post('/api/users')
                    .send(registerAttemptBody)
                    .expect(400, {
                        error: { message: `Password must contain 1 upper case, lower case, number and special character` },
                    })
            })
            it(`responds with 400 required error when passwords don't match`, () => {
                registerAttemptBody = {
                    username: 'Foo',
                    password: 'P@ssword1234',
                    passwordConfirm: 'P@ssword1',
                    fullname: 'FooMan',
                    nickname: 'FooFoo',
                }
                return supertest(app)
                    .post('/api/users')
                    .send(registerAttemptBody)
                    .expect(400, {
                        error: { message: `Passwords must match!` },
                    })
            })
            it(`responds 400 'User name already taken' when username isn't unique`, () => {
                const duplicateUser = {
                    username: 'Foogi',
                    password: 'P@ssword1234',
                    passwordConfirm: 'P@ssword1234',
                    fullname: 'FooMan',
                    nickname: testUser.nickname,
                }
                return supertest(app)
                    .post('/api/users')
                    .send(duplicateUser)
                    .expect(400, {
                        error: { message: `Username Already Taken!` },
                    })
            })
        })
    })
    context(`Happy path`, () => {
        it(`responds 201, serialized user, storing bcryped password`, () => {
            const newUser = {
                fullname: 'Foo Bar',
                username: 'FooBar@gmail.com',
                nickname: 'FooMan',
                password: 'P@ssword1234',
                passwordConfirm: 'P@ssword1234',
                date_created: 'now()'
            }
            return supertest(app)
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id')
                    expect(res.body.username).to.eql(newUser.username)
                    expect(res.body.fullname).to.eql(newUser.fullname)
                    expect(res.body.nickname).to.eql(newUser.nickname)
                    expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
                    const expectedDate = new Date(res.body.date_created).toLocaleString()
                    const actualDate = new Date(res.body.date_created).toLocaleString()
                    expect(actualDate).to.eql(expectedDate)
                })
                .expect(res =>
                    db
                        .from('ghostwriterz_users')
                        .select('*')
                        .where({ id: res.body.id })
                        .first()
                        .then(row => {
                            expect(row.username).to.eql(newUser.username)
                            expect(row.fullname).to.eql(newUser.fullname)
                            expect(row.nickname).to.eql(newUser.nickname)
                            const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                            const actualDate = new Date(row.date_created).toLocaleString()
                            expect(actualDate).to.eql(expectedDate)
                            return bcrypt.compare(newUser.password, row.password)
                        })
                        .then(compareMatch => {
                            expect(compareMatch).to.be.true
                        })
                )
        })
    })
})
