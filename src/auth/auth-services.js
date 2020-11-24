const jwt = require('jsonwebtoken');
// const { JWT_SECRET } = require('../config');
const bcrypt = require('bcryptjs')
const config = require('../config');
const { JWT_SECRET } = require('../config');

const AuthService = {
    getUser(db, username) {
        return db('ghostwriterz_users')
            .select('*')
            .where({username})
            .first()
    },
    comparePasswords(password, hash) {
        return bcrypt.compare(password, hash)
      },

      decodeJWT(data){
        let decoded = data.substr(37,63)
        return jwt.decode(decoded);
      },

    createJWT(user) {
        return jwt.sign(
            {id: user.id},
            JWT_SECRET,
            {
                subject: user.username,
                algorithm: 'HS256',
            }
            
        );
        
    },

    verifyJWT(token) {
        return jwt.verify(token, JWT_SECRET, {
            algorithm: 'HS256'
        });
    },
};

module.exports = AuthService;