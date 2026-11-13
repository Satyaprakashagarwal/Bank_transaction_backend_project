const express = require("express")
const accountController = require("../controllers/account.controller")
const authMiddleWare = require("../middlewares/auth.middleware")

const router = express.Router()

/**
 *  POST - api/account 
 *  Create new Account
*/
router.post("/", authMiddleWare.authMiddleware, accountController.createAccountController)

/** 
*   GET - api/account 
*   Get All Accounts 
*/
router.get("/", authMiddleWare.authMiddleware, accountController.getAllAccountsController)

/**
 * GET = api/account/Balance/:accountId
 */
router.get("/Balance/:accountId", authMiddleWare.authMiddleware, accountController.getBalanceAccountController)

module.exports = router