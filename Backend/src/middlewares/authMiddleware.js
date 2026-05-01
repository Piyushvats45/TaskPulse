const userModel = require('../models/userModel')
const tokenBlacklistModel = require('../models/blacklistModel')
const jwt = require('jsonwebtoken')


async function authMiddleware(req,res,next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access, token is missing"
        })
    }

    const isBlacklisted = await tokenBlacklistModel.findOne({token})

    if(isBlacklisted){
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decoded.userId)

        req.user = user;
        req.userId = user._id;
        return next()
    } catch (err) {
        
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }
}

module.exports = {authMiddleware}