const express = require("express")
const cookieParser = require("cookie-parser")

const app = express()

/**
 * Basic middleware 
 * - for raw data from postman
 * - for cookie
 */
app.use(express.json())
app.use(cookieParser())

/**
 * - Router require
 */
const authRouter = require("./routes/auth.routes")
const accountRouter = require("./routes/account.routes")
const transactionRouter = require("./routes/transaction.routes")

/**
 * - use Routes
 */
app.get("/", (req,res)=>{
    res.send("Ledger Service is up and Running")
})

app.use("/api/auth", authRouter)
app.use("/api/account", accountRouter)
app.use("/api/transaction", transactionRouter)

module.exports = app