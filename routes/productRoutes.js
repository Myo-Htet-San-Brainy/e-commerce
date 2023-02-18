const express = require('express')
const router = express.Router()
const {
    getAllProducts,
    getSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage
} = require('../controllers/productController')
//middlewares
const {authorizeUser, authenticateUser} = require('../middleware/authentication')

router.route('/').get(getAllProducts)
router.route('/').post([authenticateUser, authorizeUser('admin')],createProduct)
router.route('/uploadImage').post([authenticateUser, authorizeUser('admin')], uploadImage)
router.route('/:id').get(getSingleProduct)
router.route('/:id').patch([authenticateUser, authorizeUser('admin')], updateProduct)
router.route('/:id').delete([authenticateUser, authorizeUser('admin')], deleteProduct)

module.exports = router




