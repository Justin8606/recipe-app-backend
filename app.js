const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")





const users = require("./models/user")
const {userModel} = require("./models/user")

const recipe = require("./models/recipe")
const {recipeModel} = require("./models/recipe")


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
                        // res.json({"status":"success"})
                        jwt.sign({email:input.email},"recipe-app",{expiresIn:"1d"},(error,token)=>{
                            if (error) {
                                res.json({"status":"unable to create token"})
                            } else {
                                res.json({"status":"success","userId":response[0]._id,"token":token})
                            }
                        })
                        
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

app.post("/addRecipe",(req,res)=>{
    let input = req.body
    // console.log(input)
    let recipe = new recipeModel(input)     //object id also come in terminal
    recipe.save()
    // console.log(recipe)
    res.json({"status":"success"})
})

app.post("/search",(req,res)=>{
    // res.json({"status":"success"})
    let input = req.body

    let token = req.headers["token"]
    jwt.verify(token,"recipe-app",(error,decoded)=>{
        if (error) {
            res.json({"status":"unauthorised access token"})        //this will work if we do not add token in header,key and value
        } else {
            if (decoded) {
                recipeModel.find(input).then(        //from here it's like normal view
                    (data)=>{
                        res.json(data)          //this will work if we login using token id(that means login and we have to add the token in the header section(as key value pair))
                    }
                ).catch(
                    (error)=>{
                        res.json(error)
                    }
                )
            }
        }
    })
})


app.post("/viewRecipe",(req,res)=>{
    // res.json({"status":"success"})
    

    let token = req.headers["token"]
    jwt.verify(token,"recipe-app",(error,decoded)=>{
        if (error) {
            res.json({"status":"unauthorised access token"})       
        } else {
            if (decoded) {
                recipeModel.find().then(        
                    (data)=>{
                        res.json(data)         
                    }
                ).catch(
                    (error)=>{
                        res.json(error)
                    }
                )
            }
        }
    })
})


app.post("/deleteRecipe",(req,res)=>{
    // res.json({"status":"success"})
    let input = req.body

    let token = req.headers["token"]
    jwt.verify(token,"recipe-app",(error,decoded)=>{
        if (error) {
            res.json({"status":"unauthorised access token"})        
        } else {
            if (decoded) {
                recipeModel.findByIdAndDelete(input._id).then(        
                    (response)=>{
                        res.json({"status":"success"})          
                    }
                ).catch(
                    (error)=>{
                        res.json(error)
                    }
                )
            }
        }
    })
})


app.listen(8080,()=>{
    console.log("Server Started")
})