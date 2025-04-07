const express = require("express")
const Recipe = require("../models/recipe")
const User = require("../models/user")
const Ingredient = require("../models/ingredient")
const recipesRouter = express.Router()
const jwt = require("jsonwebtoken")


recipesRouter.get("/", async (req, res) => {
    const recipes = await Recipe.find({}).populate({
      path: "ingredients",
      populate: { path: "ingredient" },
    });
    res.json(recipes);
});

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if(authorization && authorization.startsWith('Bearer ')){
    return authorization.replace('Bearer ', '')
  }
  return null
}

recipesRouter.get("/:idUser", async(req, res) => {
  const recipes = await Recipe.find({user: req.params.idUser}).populate({
    path: "ingredients",
    populate: { path: "ingredient" },
  })
  res.json(recipes)
})


recipesRouter.post("/", async (req, res) => {
    const body = req.body;
    let cost = 0

    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
    if(!decodedToken){
      return res.status(401).json({error: "Invalid token"})
    }

    const user = await User.findById(decodedToken.id);
    const processIngredients = body.ingredients.map(async(ingredient) => {
      const ingredientFind = await Ingredient.findById(ingredient.id)
      cost += ingredientFind.cost * ingredient.amount
      return {
        ingredient: ingredient.id,
        amount: ingredient.amount,
      };
    });
    const recipe = new Recipe({
      title: body.title,
      amount: body.amount,
      cost,
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
  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
    if(!decodedToken){
      return res.status(401).json({error: "Invalid token"})
    }

  await Recipe.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

module.exports = recipesRouter