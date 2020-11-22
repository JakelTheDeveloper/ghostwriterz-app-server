const express = require('express');
const bcrypt = require('bcryptjs');

const AuthService = require('./auth-services');

const AuthRoute = express.Router();

AuthRoute
    .route('/signin')
    .post(express.json(), (req, res, next) => {
        const { username, password } = req.body;
        const loginInputs = { username, password };

        // Check for missing login inputs 
        for ( const [ key, value ] of Object.entries(loginInputs) )
            if (value == null) // Or !value
                return res.status(400).json({error: `Missing ${key} in body`})

        // Compare login inputs against/with user credentials in database
        // Send JSON web token if login inputs pass validation tests
        // Otherwise, send 401 Unauthorized and appropriate error message
        return AuthService.getUser(req.app.get('db'), username)
            .then(user => {
                if (!user)
                    return res.status(401).json({error: 'Invalid username or password'})

                return bcrypt.compare(loginInputs.password, user.password)
                    .then(match => {
                        if(!match)
                            return res.status(401).json({error: 'Invalid username or password'})
                        
                        const token = AuthService.createJWT(user);

                        res.status(200).json({authToken: token});
                    })
                    .catch(next)
            })
            .catch(next)
    });

module.exports = AuthRoute;