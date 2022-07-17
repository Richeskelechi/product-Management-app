var jwt = require('jsonwebtoken');
const User = require('../models/Users');
require('dotenv').config()
const checkToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.id) {
            const user = await User.findById(decoded.id);
            if (user) {
                req.user = user;
                next();
            }
            else {
                res.status(401).json({ msg: 'Invalid Token' });
            }
        }
    }
    catch (error) {
        res.status(401).json({ msg: 'Invalid Token' });
        console.log('Invalid Token');
    }

}

module.exports = { checkToken }