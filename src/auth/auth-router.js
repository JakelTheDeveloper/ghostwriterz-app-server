const express = require('express')
const bcrypt = require('bcryptjs')
const AuthService = require('./auth-services')
const config = require('../config')
const AuthRoute = express.Router()

AuthRoute
    .route('/signin')
    .post(express.json(), (req, res, next) => {
        const { username, password } = req.body
        const loginInputs = { username, password }


        for (const [key, value] of Object.entries(loginInputs))
            if (value == null)
                return res.status(400).json({ error: `Missing ${key} in body` })

        return AuthService.getUser(req.app.get('db'), username)
            .then(user => {
                if (!user)
                    return res.status(401).json({ error: 'Invalid username' })

                let salt = bcrypt.genSaltSync(12)

                let hash = user.password

                return AuthService.comparePasswords(loginInputs.password, hash)
                    .then(match => {
                        if (!match)
                            return res.status(401).json({ error: 'Invalid password' })
                        const jwtUser = {username:user.username}
                        console.log(jwtUser)
                        const token = AuthService.createJWT(user)
                        res.status(200).json({ authToken: token })
                    })
                    .catch(next)
            })
            .catch(next)
    })

module.exports = AuthRoute