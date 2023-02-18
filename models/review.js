const mongoose = require('mongoose')
const product = require('./product')
const user = require('./user')

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: [true, 'Please provide rating'],
        min: 1,
        max: 5
    },
    title: {
        type: String,
        required: [true, 'Please provide title'],
        trim: true,
        maxlength: 50,
        default: 'Title'
    },
    comment: {
        type: String,
        required: [true, 'Please provide comment'],
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: user,
        required: true
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: product,
        required: true
    }
}, {timestamps: true})

reviewSchema.index({user: 1, product: 1}, { unique: true})

module.exports = mongoose.model('Review', reviewSchema)