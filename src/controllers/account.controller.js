const accountModel = require("../models/account.model")

async function createAccountController(req,res){

    const user = req.user

    const account = await accountModel.create({
        user : user._id
    })
    
    const accountInDetail = await accountModel.findById(account._id).populate("user")

    res.status(201).json({
        account,
        user,
        accountInDetail
    })
}

async function getAllAccountsController(req,res){

    const user = req.user
    const accounts = await accountModel.find({user})

    return res.status(200).json({
        accounts: accounts
    })
}

async function getBalanceAccountController(req,res){
    const accountId = req.params.accountId

    const userAccount = await accountModel.findOne({
        _id: accountId,
        user: req.user._id
    })

    if(!userAccount){
        return res.status(404).json({
            message: "Account not found!"
        })
    }

    const balance = await userAccount.getBalance()

    return res.status(200).json({
        "Account Id": userAccount._id,
        balance,
    })
}

module.exports = {
    createAccountController,
    getAllAccountsController,
    getBalanceAccountController,
}