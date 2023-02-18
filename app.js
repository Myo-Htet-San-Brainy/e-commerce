const User = require('./models/user')//testing

require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

//rest of packages
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

//db
const connectDB = require('./db/connect')

//routers
const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes')
const reviewRouter = require('./routes/reviewRoutes')

//middlewares
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(fileUpload())
app.use(express.static('./public'))

//setup routers
app.get('/', (req, res) => {
    res.send('home')
})
app.delete('/api/v1/delete', async (req, res) => {
    await User.deleteMany({})
    res.send('deleted all users')
})
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/review', reviewRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000
const start = async () => {
    try {
       //connect db
       await connectDB(process.env.MONGO_URL)
       // spin up server
       app.listen(port, () => {
        console.log(`Server is listening on port ${port}...`);
       })
    } catch (error) {
        console.log(error);
    }
}

start()


