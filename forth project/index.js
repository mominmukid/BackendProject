const express = require("express");
const app = express();
const port = 3001;
const path = require("path");
const userSchema=require('./models/user');
const cookieParser=require('cookie-parser');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');


app.use(cookieParser());
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.post('/register',(req,res)=>{
   let {name,email,password,age}=req.body;
   bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(password, salt,async function(err, hash) {
          // Store hash in your password DB.
          const createdUser=await userSchema.create({
            name,
            email,
            password:hash,
            age,
         });
          const token=jwt.sign({id:createdUser.password},'secretkey');
          res.cookie('token',token);
         res.send(createdUser);
      });
  });
  
})

app.get('/login',(req,res)=>{
  res.render('login');
})

app.post('/login',async(req,res)=>{
  const {email,password}=req.body;
  const user=await userSchema.findOne({email});
  if(user){
    const isMatch=await bcrypt.compare(password,user.password);
    if(isMatch){
      const token=jwt.sign({id:user.password},'secretkey');
      res.cookie('token',token);
      res.send('Login successful');
    }else{
      res.send('something is incorrect');
    }
  }else{
    res.send('something is incorrect');
  }
})

app.get('/logout',(req,res)=>{
   res.cookie('token','');
  res.send('Logout successful');
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
