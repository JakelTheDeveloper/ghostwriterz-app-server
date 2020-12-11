const AuthServices = require('../auth/auth-services')

function requireAuth(req, res, next) {
    const authToken = req.get('Authorization') || ''

    let token

    if (!authToken.toLowerCase().startsWith('bearer ')) {
        return res.status(401).json({ error: 'Missing bearer token' })
    } else {
        token = authToken.slice('bearer '.length, authToken.length)
    }

    try {
        const payload = AuthServices.verifyJWT(token)
        return AuthServices.getUser(req.app.get('db'), payload.sub)
            .then(user => {
                if (!user)
                    return res.status(401).json({ error: 'Unauthorized' })
                req.user = user
                next()
            })
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' })
    }
}

module.exports = {
    requireAuth,
}