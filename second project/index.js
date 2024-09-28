const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const { log } = require("console");


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");


app.post("/create", (req, res) => {
   fs.writeFile(`./files/${req.body.title.split(" ").join("")}.txt`, req.body.delails, () => {
     res.redirect("/");
   });
   // console.log(req.body);
  
 });
 app.get("/file/:filename", (req, res) => {
   fs.readFile(`./files/${req.params.filename}`, "utf-8",  (err, data)=>{
     if(err){
      console.log(err);
     }else{
         res.render("show", {content: data, filename: req.params.filename});
     }
   } )
 });

 app.get("/edit/:filename", (req, res) => {
  res.render("edit", {filename: req.params.filename});
 });

 app.post("/edit", (req, res) => {

  fs.rename(`./files/${req.body.previousName}`,`./files/${req.body.newName}`,(err)=>{
    res.redirect('/');
  })
  
  
 });

app.get("/", (req, res) => {
  fs.readdir(`./files`, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(files);
      res.render("index", { files });
    }
  });
});


app.listen(3001, () => {
  console.log("server is running on port 3001");
});
