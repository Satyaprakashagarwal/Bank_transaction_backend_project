const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : [true, "email is required for creating a user."],
        trim : true,
        lowercase : true,
        unique : [true, "email already exists."],
        match : [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please fill a valid email address']
    },
    name : {
        type : String,
        required : [true, "Name is required for creating a user"]
    },
    password : {
        type : String,
        required : [true, "Password is required for creating a user"],
        minlength : [6, "Password must be greater from 6"], 
        select : false
    },
    systemUser: {
        type: Boolean,
        default: false,
        select: false,
        immutable: true,
    }
},{
    timestamps : true
})

// userSchema.pre("save", async function(next){
//     if(!this.isModified("password")){
//         return next()
//     }

//     const hash = await bcrypt.hash(this.password, 10)
//     this.password = hash

//     next()
// })

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

const userModel = mongoose.model("user", userSchema)

module.exports = userModel