const mongoose=require("mongoose")


const postSchema=new mongoose.Schema({
   postData:String,
   user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User'
   },
   date:{
      type:Date,
      default:Date.now
   }
})


const post=mongoose.model("Post",postSchema)

module.exports=post;

