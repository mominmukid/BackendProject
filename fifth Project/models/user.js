const mongoose=require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/ModelPractice");

const userSchema=new mongoose.Schema({
   name:String,
   email:String,
   age:Number,
   post:[
      {
         type:mongoose.Schema.Types.ObjectId,
         ref:"Post"
      }
   ]
})

const User=mongoose.model("User",userSchema)

module.exports=User;

