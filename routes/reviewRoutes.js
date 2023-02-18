const express = require('express')
const router = express.Router()
const {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview
} = require('../controllers/reviewController')
//middlewares
const {authorizeUser, authenticateUser} = require('../middleware/authentication')

router.route('/').get(authenticateUser, getAllReviews).post([authenticateUser, authorizeUser('user')], createReview)
router.route('/:id').get(authenticateUser, getSingleReview).patch([authenticateUser, authorizeUser('user')], updateReview).delete([authenticateUser, authorizeUser('user')], deleteReview)

module.exports = router

