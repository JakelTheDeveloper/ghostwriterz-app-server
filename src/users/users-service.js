const bcrypt = require('bcryptjs')

const UsersService = {
  getAllUsers(knex) {
    return knex.select('*').from('ghostwriterz_users')
  },
  getUserByUsername(knex, username) {
    return knex
      .from('ghostwriterz_users')
      .select('*')
      .where('username', username)
      .first()
  },
  hasUserWithUserName(db, nickname) {
    return db('ghostwriterz_users')
      .where({ nickname })
      .first()
      .then(user => !!user)
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12)
  },
  insertUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into('ghostwriterz_users')
      .returning('*')
      .then(([user]) => user)
  },
  getById(knex, id) {
    return knex
      .from('ghostwriterz_users')
      .select('*')
      .where('id', id)
      .first()
  },
  deleteUser(knex, id) {
    return knex('ghostwriterz_users')
      .where({ id })
      .delete()
  },
  updateUser(knex, id, newUserFields) {
    return knex('ghostwriterz_users')
      .where({ id })
      .update(newUserFields)
  },
}

module.exports = UsersService