const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")

const users = require("./models/user")
const {userModel} = require("./models/user")



const app = express()
app.use(cors())

app.use(express.json())

mongoose.connect("mongodb+srv://justin:nitsuj21@cluster0.3jf2qw3.mongodb.net/recipedb?retryWrites=true&w=majority&appName=Cluster0")

app.post("/signup",(req,res)=>{
    let input = req.body
    // console.log(input)
    let user = new userModel(input)
    // console.log(user)               //by this step object also come in terminal
    user.save()
    res.json({"status":"success"})
})


app.listen(8080,()=>{
    console.log("Server Started")
})