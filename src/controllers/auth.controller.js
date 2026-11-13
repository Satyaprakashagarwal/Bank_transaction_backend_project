const userModel = require("../models/user.model")
const emailService = require("../services/email.service")
const tokenBlackListModel = require("../models/blackList.model")

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

/**
 * 
 * - User Register Controller 
 * - POST api/auth/register
 */
async function userRegisterController(req,res){
    const {email, name, password} = req.body

    const emailIsExist = await userModel.findOne({email})

    if(emailIsExist){
        return res.status(422).json({
            message : "email is already taken."
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const newUser = await userModel.create({
        email, name, 
        password : hash
    })

    const user = await userModel.findById(newUser._id)

    const token = jwt.sign({_id : user._id}, process.env.JWT_SECRECT_KEY, {expiresIn : "3d"});

    res.cookie("token_id", token)

    res.status(201).json({
        user,
        token
    })

    await emailService.sendRegistrationEmail(user.email, user.name)
}

/**
 * 
 * - User Login Controller
 * - POST api/auth/login
 */
async function userLoginController(req,res){
    const {email, password} = req.body

    const user = await userModel.findOne({email}).select("+password")

    if(!user){
        return res.status(401).json({
            error : "Email OR Password is InValid."
        })
    }

    const isValidPassword = await user.comparePassword(password)

    if(!isValidPassword){
        return res.status(401).json({
            error : "Password is Invalid."
        })
    }

    const token = jwt.sign({_id : user._id}, process.env.JWT_SECRECT_KEY, {expiresIn : "3d"})

    res.cookie("token_id", token)

    res.status(200).json({
        message : "User login Successfully."
    })
}

/**
 * - User Logout Controller
 * - POST api/auth/logout
 */
async function userLogoutController(req,res){
    const token = req.cookies.token_id || req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(200).json({
            message: "Already logout"
        })
    }

    const alreadyBlackListed = await tokenBlackListModel.findOne({token})

    if(alreadyBlackListed){
        return res.status(400).json({
            message: "Token is already Blacklisted"
        })
    }

    await tokenBlackListModel.create({
        token
    })

    res.clearCookie("token_id")

    res.status(200).json({
        message: "User logout Successfully"
    })
}

module.exports = {
    userRegisterController, 
    userLoginController,
    userLogoutController,
}