const {Router} = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const transactionController = require("../controllers/transaction.controller")

const transactionRouter = Router()
/**
 * POST - /api/transaction
 * Create a new transaction
 */
transactionRouter.post("/", authMiddleware.authMiddleware, transactionController.createTransaction)

/**
 * POST - /api/transaction/system/initial-funds
 */
transactionRouter.post("/system/initial-funds", authMiddleware.authSystemUserMiddleware, transactionController.createInitialFundsTransaction)

module.exports = transactionRouter
