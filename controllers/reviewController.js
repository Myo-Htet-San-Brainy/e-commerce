const Review = require('../models/review')
const CustomError = require('../errors')
const {checkPermissions} = require('../utils')

const createReview = async (req, res) => {
    req.body.user = req.user.userId
    if (!req.body.product) {
        throw new CustomError.BadRequestError('Please provide product')
    }
    const review = await Review.create(req.body)
    res.json({review})
}

const getAllReviews = async (req, res) => {
    const reviews = await Review.find({})
    res.json({reviews, count: reviews.length})
}

const getSingleReview = async (req, res) => {
    const {id: reviewId} = req.params
    const review = await Review.findById(reviewId)
    if (!review) {
        throw new CustomError.NotFoundError(`No review with id ${reviewId}`)
    }
    res.json({review})
}

const updateReview = async (req, res) => {
    const {id: reviewId} = req.params
    const review = await Review.findById(reviewId)
    if (!review) {
        throw new CustomError.NotFoundError(`No review with id ${reviewId}`)
    }
    checkPermissions(req.user, review.user)
    console.log('Permissions passed');
    review.rating = req.body.rating
    review.title = req.body.title
    review.comment = req.body.comment
    await review.save()
    res.json({review})
}

const deleteReview = async (req, res) => {
    const {id: reviewId} = req.params
    const review = await Review.findById(reviewId)
    if (!review) {
        throw new CustomError.NotFoundError(`No review with id ${reviewId}`)
    }
    checkPermissions(req.user, review.user)
    await review.remove()
    res.json({msg: 'Review Deleted'})
}

module.exports = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview
}