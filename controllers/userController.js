const User = require('../models/user')
const CustomError = require('../errors')
const {
    createUserToken,
    attachCookiesToResponse,
    checkPermissions
} = require('../utils')

const getAllUsers = async (req, res) => {
    console.log(req.user);
    const users = await User.find({role: 'user'}).select('-password')
    res.json({users})
}

const getSingleUser = async (req, res) => {
    const user = await User.findOne({role: 'user', _id: req.params.id}).select('-password')
    if (!user) {
        throw new CustomError.BadRequestError(`No user with id ${req.params.id}`)
    }
    checkPermissions(req.user, user._id)
    res.json({user})
}

const updateUser = async (req, res) => {
    const {email, name} = req.body
    if (!email || !name) {
        throw new CustomError.BadRequestError('Please provide name and email')
    }
    const user = await User.findById(req.user.userId)
    user.name = name
    user.email = email
    user.save()
    const payload = createUserToken(user)
    attachCookiesToResponse(res, payload)
    res.json({user})
}

const updateUserPassword = async (req, res) => {
    const {oldPassword, newPassword} = req.body
    //check if null
    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError('Please provide old password and new password')
    }
    const user = await User.findById(req.user.userId)
    const isMatched = await user.comparePassword(oldPassword)
    //check if authenticated again
    if (!isMatched) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }
    user.password = newPassword
    await user.save()

    res.json({user})
}

const showCurrentUser = async (req, res) => {
    res.json({user: req.user})
}

module.exports = {
    getAllUsers,
    getSingleUser,
    updateUser,
    updateUserPassword,
    showCurrentUser
}

// const updateUser = async (req, res) => {
//     const {email, name} = req.body
//     if (!email || !name) {
//         throw new CustomError.BadRequestError('Please provide name and email')
//     }
//     const user = await User.findByIdAndUpdate(req.user.userId, {email, name}, { new: true, runValidators: true})
//     const payload = createUserToken(user)
//     attachCookiesToResponse(res, payload)
//     res.json({user})
// }


