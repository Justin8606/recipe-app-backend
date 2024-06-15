const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")

const users = require("./models/user")
const {userModel} = require("./models/user")

const app = express()
app.use(cors())

app.use(express.json())

app.post("/signup",(req,res)=>{
    let input = req.body
    // console.log(input)
    let user = new userModel(input)
    console.log(user)               //by this step object also come in terminal
    res.json({"status":"success"})
})


app.listen(8080,()=>{
    console.log("Server Started")
})