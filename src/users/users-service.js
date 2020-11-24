const UsersService = {
    getAllUsers(knex) {
      return knex.select('*').from('ghostwriterz_users')
    },
    
    getUserByUsername(knex,username){
        return knex
        .from('ghostwriterz_users')
        .select('*')
        .where('username', username)
        .first()
    },
  
    insertUser(knex, newUser) {
      return knex
        .insert(newUser)
        .into('ghostwriterz_users')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
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