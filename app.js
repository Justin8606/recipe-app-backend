const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")
const bcrypt = require("bcryptjs")





const users = require("./models/user")
const {userModel} = require("./models/user")



const app = express()
app.use(cors())

app.use(express.json())

mongoose.connect("mongodb+srv://justin:nitsuj21@cluster0.3jf2qw3.mongodb.net/recipedb?retryWrites=true&w=majority&appName=Cluster0")

const generatedHashPassword = async(password)=>{
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt)
}

app.post("/signup",async(req,res)=>{
    let input = req.body
    // console.log(input)
    let hashedPassword = await generatedHashPassword(input.password)
    input.password = hashedPassword
    let user = new userModel(input)
    // console.log(user)               //by this step object also come in terminal

    
    user.save()
    res.json({"status":"success"})
})


app.post("/signin", (req,res)=>{
    let input = req.body
    // console.log(input)
    userModel.find({"email":input.email}).then(
        (response)=>{
            // res.json(response)       if we wrong email,it will give empty [].
            if (response.length>0) {
                // res.json(response)
                let dbPassword = response[0].password
                bcrypt.compare(input.password,dbPassword,(error,isMatch)=>{
                    if (isMatch) {
                        res.json({"status":"success"})
                        
                    } else {
                        res.json({"status":"password not matching"})        //password verified
                        
                    }
                })        
            } else {
                res.json({"status":"user not found"})          // instead of this [] it will print user not found.
            }
        }
    ).catch()
    // res.json({"status":"success"})
})

app.listen(8080,()=>{
    console.log("Server Started")
})