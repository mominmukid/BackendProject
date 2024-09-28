const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("./models/user");
const postModel = require("./models/post");
const upload=require("./config/multerconfig")


app.use(cookieParser());
// app.use(jwt())
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.render("index");
});

app.post("/register", async (req, res) => {
  const { name, email, password, age, username } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    return res.send("User already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const userdata = await userModel.create({
    name,
    email,
    password: hashedPassword,
    age,
    username,
  });
  const token = jwt.sign(
    { userid: userdata._id, email: userdata.email },
    "secretkey"
  );
  res.cookie("token", token);
  res.status(500).send("User created successfully");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.send("Something went wrong please try again");
  }
  await bcrypt.compare(password, user.password, async (err, result) => {
    if (err) {
      return res.send("Something went wrong please try again");
    }
    if (result) {
      const tokan = jwt.sign(
        { userid: user._id, email: user.email },
        "secretkey"
      );
      res.cookie("token", tokan);
      res.status(200).redirect("/profile");
    } else {
      res.redirect("/login");
    }
  });
});

app.post("/post", isloggedin, async (req, res) => {
  const { content } = req.body;
  const user = await userModel.findOne({ email: req.user.email });
  const post = await postModel.create({
    content,
    userid: user._id,
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});

app.get("/like/:id", isloggedin, async (req, res) => {
  const post = await postModel.findById(req.params.id).populate("user");
  if (post.likes.indexOf(req.user.userid) == -1) {
    post.likes.push(req.user.userid);
  } else {
    post.likes.splice(post.likes.indexOf(req.user.userid), 1);
  }
  await post.save();
  res.redirect("/profile");
});
app.get("/edit/:id", isloggedin, async (req, res) => {
  const post = await postModel.findById(req.params.id);
  res.render("edit", { post });
});

app.post("/update/:id", isloggedin, async (req, res) => {
  const post = await postModel.findById(req.params.id);
  post.content = req.body.content;
  await post.save();
  res.redirect("/profile");
});

app.get("/profile", isloggedin, async (req, res) => {
  const user = await userModel
    .findOne({ email: req.user.email })
    .populate("posts");
  res.render("profile", { user });
});

app.get("/profileUpload", isloggedin, (req, res) => {
  res.render("profileUpload");
});

app.post("/upload", isloggedin, upload.single("image"), async (req, res) => {
  const user = await userModel.findOne({ email: req.user.email });
  user.profilepic = req.file.filename;
  await user.save();
  res.redirect("/profile");
});

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/login");
  // res.send("Logout Successfully")
});



function isloggedin(req, res, next) {
  if (req.cookies.token == "") {
    res.redirect("/login");
  } else {
    let data = jwt.verify(req.cookies.token, "secretkey");
    req.user = data;
    next();
  }
}

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
