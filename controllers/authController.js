const User = require('../models/user')
const CustomError = require('../errors')
const {
    attachCookiesToResponse,
    createUserToken
} = require('../utils')

const register = async (req, res) => {
    const {name, email, password} = req.body
    //check for null
    if (!name || !email || !password) {
        throw new CustomError.BadRequestError('Please provide name, email and password')
    }
    //check email if unique
    const isEmailUnique = await User.findOne({email})
    if (isEmailUnique) {
        throw new CustomError.BadRequestError('Email already exists')
    }
    //decide if admin
    const isFirstUser = (await User.countDocuments({})) === 0
    const role = isFirstUser ? 'admin' : 'user'
    //create or regis user
    const user = await User.create({name, email, password, role})

    //res
    const payload = createUserToken(user)
    attachCookiesToResponse(res, payload)
    res.json({user: payload})
}

const login = async (req, res) => {
    const {email, password} = req.body
    //check for null
    if (!email || !password) {
        throw new CustomError.BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({email})
    //check if user exists
    if (!user) {
        throw new CustomError.UnauthenticatedError('Invalid credentials')
    }
    //check if password correct
    const isMatched = await user.comparePassword(password)
    if (!isMatched) {
        throw new CustomError.UnauthenticatedError('Invalid credentials')
    }

    //res
    const payload = createUserToken(user)
    attachCookiesToResponse(res, payload)
    res.json({user: payload})
}

const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    })
    res.json({msg: 'User logged out'})
}

module.exports = {
    register,
    login,
    logout
}