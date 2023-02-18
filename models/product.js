const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        trim: true,
        maxlength: [100, 'Name can not be more than 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please provide price'],
        default: 0
    },
    description: {
        type: String,
        required: [true, 'Please provide description'],
        maxlength: [1000, 'Description can not be more than 1000 characters']
    },
    image: {
        type: String,
        default: '/uploads/root_joint.png'
    },
    category: {
        type: String,
        required: [true, 'Please provide category'],
        enum: {
            values: ['office','kitchen','bedroom'],
            message: '{VALUE} is not supported'
        }
    },
    company: {
        type: String,
        required: [true, "Please provide company"],
        enum: {
            values: ['ikea', 'liddy', 'marcos'],
            message: '{VALUE} is not supported'
        }
    },
    colors: {
        type: [String],
        default: ['#222'],
        required: [true, 'Please provide colors']
    },
    featured: {
        type: Boolean,
        default: false
    },
    freeShipping: {
        type: Boolean,
        default: false
    },
    inventory: {
        type: Number,
        required: true,
        default: 15
    },
    averageRating: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {timestamps: true})

module.exports = mongoose.model('Product', productSchema)