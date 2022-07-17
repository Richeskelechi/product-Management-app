const express = require('express');
const path = require('path');
const multer = require('multer')
const userRouter = express.Router();
const { signupUser, loginUser, getAllProducts, addNewProduct, getSingleProduct, addComment, getComment } = require('../controllers/userController')
const { checkToken } = require('../middlewares/checkToken')

// define storage for image 
let appRoot = process.env.PWD;
const storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, path.join(appRoot, './controllers/uploads'))
    },

    // add back the extention 
    filename: function (request, file, callback) {
        callback(null, Date.now() + file.originalname)
    }
});

// upload parameters for multer 
const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 3
    },
})

userRouter.post('/signup', signupUser)
userRouter.post('/login', loginUser)
userRouter.get('/myProduct', checkToken, getAllProducts)
userRouter.get('/myProduct/:id', checkToken, getSingleProduct)
userRouter.post('/addProduct', checkToken, upload.single('image'), addNewProduct)
userRouter.post('/addComment', checkToken, addComment)
userRouter.get('/getComment/:id', checkToken, getComment)

module.exports = userRouter