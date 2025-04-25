import express from "express";
import Recipe from "../models/recipe.js"
import User from "../models/user.js"
import Ingredient from "../models/ingredient.js"
const recipesRouter = express.Router()
import jwt from "jsonwebtoken"

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

export const calcCost = async(ingredients) => {
  const totalCost = ingredients.map(async(ingredient) => {
    let ingredientFind= ""
    if(!ingredient.ingredient){
      ingredientFind = await Ingredient.findById(ingredient.id)
    }else{
      ingredientFind = ingredient.ingredient
    }
    return Number(ingredientFind.cost) * Number(ingredient.amount)
  })
  return (await Promise.all(totalCost)).reduce((a, b) => a + b, 0)
}

recipesRouter.post("/", async (req, res) => {
    const body = req.body;

    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
    if(!decodedToken){
      return res.status(401).json({error: "Invalid token"})
    }
    const user = await User.findById(decodedToken.id);
    const processIngredients = body.ingredients.map((ingredient) => {
      return {
        ingredient: ingredient.id,
        amount: ingredient.amount,
      };
    })
    const cost = await calcCost(body.ingredients)
    const recipe = new Recipe({
      title: body.title,
      amount: body.amount,
      unit : body.unit,
      cost : String(cost),
      ingredients: processIngredients,
      user: user._id,
    });
    const savedRecipe = await recipe.save();
    user.recipes = user.recipes.concat(savedRecipe._id);
    await user.save();
    await savedRecipe.populate({
      path: "ingredients",
      populate: { path: "ingredient" },
    })
    res.status(201).json(savedRecipe);
});

recipesRouter.put("/:id", async (req,res) => {
  const body = req.body;
  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  if(!decodedToken){
    return res.status(401).json({error: "Invalid token"})
  }
  const processIngredients = body.ingredients.map((ingredient) => {
    return {
      ingredient: ingredient.id,
      amount: ingredient.amount,
    };
  })
  const cost = await calcCost(body.ingredients)
  
  const recipe = {
    title: body.title,
    amount: body.amount,
    unit : body.unit,
    cost: String(cost),
    ingredients: processIngredients,
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
  const user = await User.findById(decodedToken.id);
  user.recipes = user.recipes.filter((recipe) => recipe.toString() !== req.params.id);
  await user.save();

  await Recipe.findByIdAndDelete(req.params.id)
  
  res.status(204).end()
})

export default recipesRouter
