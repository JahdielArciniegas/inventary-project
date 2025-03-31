const express = require("express");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const app = express();
const cors = require("cors");
const { PORT, mongoUrl } = require("./utils/config");
const mongoose = require("mongoose");
const Recipe = require("./models/recipe");
const Ingredient = require("./models/ingredient");

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

app.get("/api/recipe", async (req, res) => {
  const recipes = await Recipe.find({});
  res.json(recipes);
});

app.get("/api/ingredient", async (req, res) => {
  const ingredient = await Ingredient.find({});

  res.json(ingredient);
});

app.post("/api/recipe", async (req, res) => {
  const body = req.body;
  const user = await User.findById(body.userId);

  const recipe = new Recipe({
    title: body.title,
    amount: body.amount,
    cost: body.cost,
    ingredients: body.ingredients,
    user: user._id,
  });

  const savedRecipe = await recipe.save();
  user.recipes = user.recipes.concat(savedRecipe._id);
  await user.save();
  res.status(201).json(savedRecipe);
});

app.post("/api/ingredient", async (req, res) => {
  const { name, amount, cost, userId } = req.body;
  const user = await User.findById(userId);

  const ingredient = new Ingredient({
    name,
    amount,
    cost,
    user: user._id,
  });

  const savedIngredient = await ingredient.save();
  user.ingredients = user.ingredients.concat(savedIngredient._id);
  await user.save();
  res.status(201).json(savedIngredient);
});

app.listen(PORT, (req, res) => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
