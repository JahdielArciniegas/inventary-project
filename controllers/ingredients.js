const express = require("express")
const Ingredient = require("../models/ingredient")
const ingredientsRouter = express.Router()
const User = require("../models/user")

ingredientsRouter.get("/", async (req, res) => {
    const ingredient = await Ingredient.find({});
    res.json(ingredient);
});

ingredientsRouter.post("/", async (req, res) => {
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

module.exports = ingredientsRouter