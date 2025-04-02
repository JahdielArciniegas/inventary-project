const express = require("express")
const Recipe = require("../models/recipe")
const User = require("../models/user")
const recipesRouter = express.Router()


recipesRouter.get("/", async (req, res) => {
    const recipes = await Recipe.find({}).populate({
      path: "ingredients",
      populate: { path: "ingredient" },
    });
    res.json(recipes);
});

recipesRouter.post("/", async (req, res) => {
    const body = req.body;
    const user = await User.findById(body.userId);
    const processIngredients = body.ingredients.map((ingredient) => {
      return {
        ingredient: ingredient.id,
        amount: ingredient.amount,
      };
    });
    console.log(user._id);
    const recipe = new Recipe({
      title: body.title,
      amount: body.amount,
      cost: body.cost,
      ingredients: processIngredients,
      user: user._id,
    });
    const savedRecipe = await recipe.save();
    user.recipes = user.recipes.concat(savedRecipe._id);
    await user.save();
    res.status(201).json(savedRecipe);
});

recipesRouter.put("/:id", async (req,res) => {
  const body = req.body;
  
  const recipe = {
    title: body.title,
    amount: body.amount,
    cost: body.cost,
    ingredients: body.ingredients,
  }

  const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, recipe, { new: true}).populate({
    path: "ingredients",
    populate: {path: "ingredient"}
  })
  res.json(updatedRecipe)
})

recipesRouter.delete("/:id", async (req,res) =>{
  await Recipe.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

module.exports = recipesRouter