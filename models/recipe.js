const mongoose = require("mongoose")

const schema = mongoose.Schema(
    {
        "rName":{type:String,required:true},
        "description":{type:String,required:true},
        "image":{type:String,required:true}
    }
)

const recipeModel = mongoose.model("recipies",schema)
module.exports={recipeModel}