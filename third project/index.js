const express = require('express')
const app = express()
const path=require('path')
const userSchema=require('./models/user')


app.set("view engine",'ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({extended:true}))


app.get("/",(req,res)=>{
  res.render('index')
})

app.get('/read',async(req,res)=>{
  const users=await userSchema.find({})
  res.render('read',{users})
})

app.post('/create',async(req,res)=>{
  const {name,email,image}=req.body
   const user=await userSchema.create({
    name,
    email,
    imageUrl:image
   })
   res.redirect('/read')
})

app.get('/delete/:id',async(req,res)=>{
  const id=req.params.id
  const user=await userSchema.findByIdAndDelete(id)
  res.redirect('/read')
})

app.get('/edit/:id',async(req,res)=>{
  const id=req.params.id
  const user=await userSchema.findById(id)
  res.render('edit',{user})
})

app.post('/update/:id',async(req,res)=>{
  const {name,email,image}=req.body
  const user=await userSchema.findOneAndUpdate({_id:req.params.id},{name,email,imageUrl:image},{new:true})
  res.redirect('/read')
})

app.listen(3001)