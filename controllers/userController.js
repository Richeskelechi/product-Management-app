const User = require('../models/Users');
const Product = require('../models/Product');
const Comment = require('../models/Comment');
const bcrypt = require('bcrypt');
const cloudinary = require("cloudinary").v2
var jwt = require('jsonwebtoken');
require('dotenv').config()
const { sendMail } = require('../middlewares/sendMail');
const { sendMessage } = require('../middlewares/sendMessage');

JWT_SECRET = process.env.JWT_SECRET;

const cloudinaryConfig = cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUDAPIKEY,
    api_secret: process.env.CLOUDINARYSECRET,
    secure: true
})

const getSignature = async (req, res) => {
    const timestamp = Math.round(new Date().getTime() / 1000)
    const signature = cloudinary.utils.api_sign_request(
        {
            timestamp: timestamp
        },
        cloudinaryConfig.api_secret
    )
    res.json({ timestamp, signature })
}

const signupUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ msg: 'Email Provided Already Exists. Check The Email And Try Again' });
        }
        const newUser = new User({
            fullName: req.body.fullname,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            country: req.body.country,
            state: req.body.state,
            password: req.body.password
        });
        const hashedPassword = await bcrypt.hash(newUser.password, +process.env.SALT_ROUNDS);
        newUser.password = hashedPassword;
        await newUser.save();
        newUser.password = undefined;
        res.status(201).json({ msg: 'User Created Successfully', data: newUser });
    }
    catch (error) {
        res.status(500).json({ msg: error });
        console.log(error);
    }
}

const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ msg: 'User Does Not Exist' });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Email or Password' });
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        user.password = undefined;
        res.status(200).json({ msg: 'User Logged In Successfully', data: user, userToken: token });
    }
    catch (error) {
        res.status(500).json({ msg: error });
        console.log(error);
    }
}

const getAllProducts = async (req, res) => {
    try {
        const product = await Product.find({ productCountry: req.user.country, productState: req.user.state });
        if (!product) {
            return res.status(400).json({ msg: 'User Does Not Exist' });
        }
        res.status(200).json({ msg: 'Product(s) Retrived Successfully', data: product, status: 200 });
    }
    catch (error) {
        res.status(500).json({ msg: error });
        console.log(error);
    }
}


const getSingleProduct = async (req, res) => {
    const { id: productID } = req.params;
    try {
        let oneProduct = await Product.findById(productID).exec()
        let product = { ...oneProduct._doc }
        if (!oneProduct) {
            res.status(200).json({ msg: `No product with id : ${productID}` })
        } else {
            let productOwner = await User.findById(oneProduct.userId).exec()
            if (!productOwner) {
                res.status(200).json({ msg: `No user with id : ${productOwner}` })
            } else {
                product.productOwner = productOwner.fullName
                product.productOwnerEmail = productOwner.email
                product.productOwnerNumber = productOwner.phoneNumber
                res.status(200).json({ data: product, status: 200 })
            }
        }
    } catch (error) {
        if (error.name === 'CastError') {
            res.status(400).json({ msg: `No product with id : ${productID}` })
        } else {
            res.status(500).json({ msg: error })
        }

    }
}

const addNewProduct = async (req, res) => {
    const expectedSignature = cloudinary.utils.api_sign_request({ public_id: req.body.public_id, version: req.body.version }, cloudinaryConfig.api_secret)
    if (req.body.signature === expectedSignature) {
        let newProduct = new Product({
            productName: req.body.productName,
            productCountry: req.user.country,
            productState: req.user.state,
            productLocation: req.body.productLocation,
            productComment: req.body.productComment,
            userId: req.user._id,
            productImage: req.body.public_id,
        })
        console.log(newProduct)
        try {
            newProduct = await newProduct.save();
            res.status(201).json({ msg: 'Product Added Sucessfully', status: 201 })
        } catch (error) {
            res.status(500).json({ msg: error })
        }
    }
}

const addComment = async (req, res) => {
    let newComment = new Comment({
        productId: req.body.productId,
        comment: req.body.comment,
        userId: req.user._id,
        userFullName: req.user.fullName,
    })
    try {
        newComment = await newComment.save();
        sendMail(req.body.productOwnerEmail, req.body.productOwnerFullName, `${req.user.fullName} has added a comment on your product`)
        sendMessage(req.body.productOwnerNumber, req.body.productOwnerFullName, `${req.user.fullName} has added a comment on your product`)
        res.status(201).json({ msg: 'Comment Added Sucessfully', data: newComment, status: 201 })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}


const getComment = async (req, res) => {
    const { id: productID } = req.params;
    try {
        const allComment = await Comment.find({ productId: productID });
        if (!allComment) {
            return res.status(400).json({ msg: 'No Comment Found', status: 400 });
        }
        res.status(200).json({ msg: 'Comment(s) Retrived Successfully', data: allComment, status: 200 });
    } catch (error) {
        if (error.name === 'CastError') {
            res.status(400).json({ msg: `No Comment with id : ${productID}` })
        } else {
            res.status(500).json({ msg: error })
        }

    }
}

module.exports = { signupUser, loginUser, getAllProducts, addNewProduct, getSingleProduct, addComment, getComment, getSignature }