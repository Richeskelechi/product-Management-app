const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new Schema({
    productName: {
        type: String,
        trim: true,
        required: [true, 'You Must Provide A Product Name']
    },
    productImage: {
        type: String,
        trim: true,
        required: [true, 'An Image For The Product Must Be Provided']
    },
    productCountry: {
        type: String,
        trim: true,
        required: [true, 'An Country For The Product Must Be Provided']
    },
    productState: {
        type: String,
        trim: true,
        required: [true, 'An State For The Product Must Be Provided']
    },
    productComment: {
        type: String,
        trim: true,
        required: [true, 'An Comment For The Product Must Be Provided']
    },
    productLocation: {
        type: String,
        trim: true,
        required: [true, 'You Must Provide A Location For The Product']
    },
    userId: {
        type: String,
        trim: true,
        required: [true, 'You Must Provide A User Id']
    },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;