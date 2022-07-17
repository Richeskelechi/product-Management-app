const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = new Schema({
    userId: {
        type: String,
        trim: true,
        required: [true, 'You Must Provide A User Id']
    },
    userFullName: {
        type: String,
        trim: true,
        required: [true, 'You Must Provide A User Fullname']
    },
    productId: {
        type: String,
        trim: true,
        required: [true, 'An ID For The Product Must Be Provided']
    },
    comment: {
        type: String,
        trim: true,
        required: [true, 'You Must Provide A Comment']
    },
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;