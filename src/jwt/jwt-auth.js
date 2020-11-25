const AuthServices = require('../auth/auth-services');

function requireAuth(req, res, next) {
    const authToken = req.get('Authorization') || '';

    let token;

    // Validate authToken
    // Remove 'bearer ' and set JSON web token to variable called token
    if(!authToken.toLowerCase().startsWith('bearer ')) {
        return res.status(401).json({error: 'Missing bearer token'})
    } else {
        token = authToken.slice('bearer '.length, authToken.length);
    }

    // Verify token and set result containing user_name to variable called payload
    // On verification sucess, retrieve user data from database
    // If a match is found, append user creds to request
    // Otherwise, return 401 Unauthorized and appropriate error message
    try {
        const payload = AuthServices.verifyJWT(token);
        return AuthServices.getUser(req.app.get('db'), payload.sub)
            .then(user => {
                if(!user)
                    return res.status(401).json({error: 'Unauthorized'})
                req.user = user;
                next();
            })
    } catch(error) {
        res.status(401).json({error: 'Unauthorized'});
    };
};

module.exports = {
    requireAuth,
};