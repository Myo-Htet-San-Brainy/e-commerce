const {verifyJWT} = require('../utils')
const CustomError = require('../errors')

const authenticateUser =  (req, res, next) => {
    if (!req.signedCookies.token) {
        throw new CustomError.UnauthenticatedError('Authentication Invalid')
    }
    try {
        const {name, userId, role} = verifyJWT(req.signedCookies.token)
        req.user = {name, userId, role}
        next()
    } catch (error) {
        throw new CustomError.UnauthenticatedError('Authentication Invalid')
    }
    
}

const authorizeUser =  (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomError.UnAuthorizeError('Authorization Invalid')
        }
        next()
    }
}

module.exports = {authenticateUser, authorizeUser}