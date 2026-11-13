require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/db/db")

connectToDB()

app.listen(3005, ()=>{
    console.log("server is started at 3005")
})