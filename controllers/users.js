const express = require("express")
const usersRouter = express.Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")

usersRouter.get("/", async (req, res) => {
    const users = await User.find({})
      .populate("recipes", { title: 1, amount: 1, cost: 1 })
      .populate("ingredients", { name: 1, amount: 1, cost: 1 });
    res.json(users);
});

usersRouter.post("/api/user", async (req, res) => {
    const { username, name, password } = req.body;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = new User({
      username,
      name,
      passwordHash,
    });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
});

usersRouter.put("/:id", async(req,res) =>{
  const body = req.body
  const saltRounds = 10;
  const user = await User.findById(req.params.id)
  const passwordCorrect = await bcrypt.compare(body.password, user.passwordHash)
  if(!passwordCorrect){
    return res.status(401).json({error: "Invalid password"})
  }

  const passwordHash = await bcrypt.hash(body.newPassword, saltRounds)
  const newUser = {
    username : body.username,
    name : body.name,
    passwordHash
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, newUser, { new:true}).populate("recipes").populate("ingredients")
  res.json(updatedUser)
})

module.exports = usersRouter