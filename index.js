const express = require("express");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const app = express();
const cors = require("cors");
const { PORT, mongoUrl } = require("./utils/config");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err.message);
  });

app.use(cors());
app.use(express.json());

app.get("/api/user", async (req, res) => {
  const users = await User.find({})
    .populate("recipes", { title: 1, amount: 1, cost: 1 })
    .populate("ingredients", { name: 1, amount: 1, cost: 1 });
  res.json(users);
});

app.post("/api/user", async (req, res) => {
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

app.listen(PORT, (req, res) => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
