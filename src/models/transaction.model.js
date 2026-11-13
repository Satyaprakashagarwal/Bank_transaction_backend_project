const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
    fromAccount : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "account",
        required : [true, "Transaction must be associated with a from account."],
        index : true,
    },
    toAccount : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "account",
        required : [true, "Transaction must be associated with a to account."],
        index : true,
    },
    status : {
        type : String,
        enum : {
            values : ['PENDING', 'COMPLETED', 'FAILED', 'REVERSED'],
            message : "status can be either pending, completed, failed, or reversed."
        },
        default : 'PENDING'
    },
    amount : {
        type : Number,
        requred : [true, "amount is necessary for transaction"],
        min : [0, "Transaction amount can not be negative"]
    },
    idempotencyKey : {
        type : String,
        required : [true, "IdempotencyKey is required for creating Transation"],
        unique : true,
        index : true,
    }
},{
    timestamps : true
})

const transactionModel = mongoose.model("transaction", transactionSchema)

module.exports = transactionModel