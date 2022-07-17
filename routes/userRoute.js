const express = require('express');
const userRouter = express.Router();
const { signupUser, loginUser, getAllProducts, addNewProduct, getSingleProduct, addComment, getComment, getSignature } = require('../controllers/userController')
const { checkToken } = require('../middlewares/checkToken')

userRouter.post('/signup', signupUser)
userRouter.post('/login', loginUser)
userRouter.get('/myProduct', checkToken, getAllProducts)
userRouter.get('/get-signature', checkToken, getSignature)
userRouter.get('/myProduct/:id', checkToken, getSingleProduct)
userRouter.post('/addProduct', checkToken, addNewProduct)
userRouter.post('/addComment', checkToken, addComment)
userRouter.get('/getComment/:id', checkToken, getComment)

module.exports = userRouter