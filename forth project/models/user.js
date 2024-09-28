const mongoose=require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/userdb')

const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    age:Number
});

const User=mongoose.model('User',userSchema);

module.exports=User;