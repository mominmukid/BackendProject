const express = require('express')
const app = express()
const path = require('path')

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');



app.get('/', function (req, res) {
 res.render('index')
})

app.get('/profile/:username', function (req, res) {
   const { username} = req.params
   res.send(`hello ${username}`)
  })

  app.get('/profile/:username/:age', function (req, res) {
   const { username,age} = req.params
   res.send(`hello ${username} and your age is ${age}`)
  })


app.listen(3001,()=>{
   console.log('server is running on port 3001')
})