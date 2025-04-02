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

module.exports = usersRouter