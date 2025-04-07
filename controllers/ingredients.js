const express = require("express")
const Ingredient = require("../models/ingredient")
const ingredientsRouter = express.Router()
const User = require("../models/user")
const jwt = require("jsonwebtoken")


ingredientsRouter.get("/", async (req, res) => {
    const ingredient = await Ingredient.find({});
    res.json(ingredient);
});

ingredientsRouter.get("/:idUser", async (req, res) => {
  const ingredients = await Ingredient.find({user: req.params.idUser})
  res.json(ingredients)
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if(authorization && authorization.startsWith('Bearer ')){
    return authorization.replace('Bearer ', '')
  }
  return null
}


ingredientsRouter.post("/", async (req, res) => {
    const { name, amount, cost } = req.body;
    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
    if(!decodedToken){
      return res.status(401).json({error: "Invalid token"})
    }

    const user = await User.findById(decodedToken.id);
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

ingredientsRouter.put("/:id", async(req,res) => {
  const body = req.body
  const ingredient = {
    name : body.name,
    amount : body.amount,
    cost : body.cost
  }

  const updatedIngredient = await Ingredient.findByIdAndUpdate(req.params.id, ingredient, { new:true})
  res.json(updatedIngredient)
})

ingredientsRouter.delete("/:id", async (req,res) =>{
  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
    if(!decodedToken){
      return res.status(401).json({error: "Invalid token"})
    }

  await Ingredient.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

module.exports = ingredientsRouter