// Models 
const userModel = require('../models/user.model');


const jwt = require('jsonwebtoken');
require('dotenv').config();

const checkLoggedIn = async (req, res, next) => {
    if (req.cookies.login) {
        try {
            // Verify the token
            const decoded = jwt.verify(req.cookies.login, process.env.JWT_SECRET);
            userModel.findOne({ where: { id: decoded.id } })
                .then(user => {
                    req.user = user;
                    next();
                })
                .catch(err => {
                    console.log(err, 'error checklogin');
                })
        } catch (err) {
            console.log(err);
        }
    }
    if (!req.cookies.login) {
        next();
    }
}

module.exports.checkLoggedIn = checkLoggedIn;