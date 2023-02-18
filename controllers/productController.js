const Product = require('../models/product')
const CustomError = require('../errors')
const path = require('path')

const createProduct = async (req, res) => {
    req.body.user = req.user.userId
    const product = await Product.create(req.body)
    res.json({product})
}

const getAllProducts = async (req, res) => {
    const products = await Product.find({})
    res.json({products, count: products.length})
}

const getSingleProduct = async (req, res) => {
    const {id: productId} = req.params
    if (!productId) {
        throw new CustomError.BadRequestError('Please provide productId')
    }
    const product = await Product.findById(productId)
    if (!product) {
        throw new CustomError.NotFoundError(`No product with id: ${productId}`)
    }   
    res.json({product})
}

const updateProduct = async (req, res) => {
    const {id: productId} = req.params
    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        req.body,
        { new: true, runValidators: true}
    )
    if (!updatedProduct) {
        throw new CustomError.NotFoundError(`No product with id: ${productId}`)
    }
    res.json({updatedProduct})
}

const deleteProduct = async (req, res) => {
    const {id: productId} = req.params
    const product = await Product.findById(productId)
    if (!product) {
        throw new CustomError.NotFoundError(`No product with id: ${productId}`)
    }   
    const removeData = await product.remove()

    console.log(removeData);
    res.json({msg: `${productId} has been removed`})
}

const uploadImage = async (req, res) => {
    if (!req.files) {
        throw new CustomError.BadRequestError('Please upload file')
    }
    const productImage = req.files.image
    if (!productImage.mimetype.startsWith('image')) {
        throw new CustomError.BadRequestError('Please upload image')
    }
    const maxSize = 1024 * 1024
    if (!productImage.size > maxSize) {
        throw new CustomError.BadRequestError('Image size caannot be more than 1MB')
    }
    //now move into public/uploads
    const imagePath = path.join(__dirname, '../public/uploads/'  + productImage.name )
    await productImage.mv(imagePath)
    res.json({image: `/uploads/${productImage.name}`})
}

module.exports = {
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
    createProduct
}



