const jwt = require('jsonwebtoken')

const createJWT =  (payload) => {
    const token =  jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
    return token
}

const verifyJWT =  (token) => {
    const isAuthenticated =  jwt.verify(token, process.env.JWT_SECRET)
    return isAuthenticated
}

const attachCookiesToResponse =  (res, payload) => {
    const token =  createJWT(payload)

    const oneDay = 1000 * 60 * 60 * 24
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true,
      });
}

module.exports = {
    createJWT,
    verifyJWT,
    attachCookiesToResponse
}