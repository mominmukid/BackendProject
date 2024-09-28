const express = require("express");
const app = express();
const path = require("path");
const postSchema = require("./models/post");
const userSchema = require("./models/user");

app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Hello miki");
});

app.get("/create", async (req, res) => {
  const user = await userSchema.create({
    name: "Miki",
    email: "miki@gmail.com",
    age: 20,
  });
  res.send(user);
});

app.get("/createpost", async (req, res) => {
  const post = await postSchema.create({
    postData: "Hello sarelog kase ho",
    user: "66f7fa3de7a06d1cbda97bc5",
  });
  let user = await userSchema.findById("66f7fa3de7a06d1cbda97bc5");
  user.post.push(post._id)
  await user.save()
  res.send({
   post,
   user
  });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
