const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")
const tokenBlackListModel = require("../models/blackList.model")

async function authMiddleware(req,res,next){
    const token = req.cookies.token_id || req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(401).json({
            error : "unauthorized user, token is empty"
        })
    }

    const isBlackListed = await tokenBlackListModel.findOne({token})

    if(isBlackListed){
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRECT_KEY)

        req.user = await userModel.findById({_id: decoded._id})

        return next()
    }catch(err){
        return res.status(401).json({
            error : "unauthorized user, token is InValid"
        })
    }
}

async function authSystemUserMiddleware(req,res,next){
    const token = req.cookies.token_id || req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(401).json({
            error : "unauthorized user, token is empty"
        })
    }

    const isBlackListed = await tokenBlackListModel.findOne({token})

    if(isBlackListed){
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRECT_KEY)

        const user = await userModel.findById({_id: decoded._id}).select("+systemUser")
        
        if(!user.systemUser){
            return res.status(403).json({
                message: "Forbidden access, not a system user."
            })
        }

        req.user = user

        return next()
    }catch(err){
        return res.status(401).json({
            error : `unauthorized user, token is InValid ${err}`
        })
    }
}

module.exports = {
    authMiddleware,
    authSystemUserMiddleware,
}