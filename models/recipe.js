const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: String,
  unit : String,
  amount: String,
  cost: String,
  ingredients: [
    {
      ingredient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ingredient",
      },
      amount: String,
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

recipeSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    if(returnedObject.ingredients){
      returnedObject.ingredients.map((ingredient) => {
        ingredient.id = ingredient._id.toString();
        delete ingredient._id;
      });
    }
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Recipe", recipeSchema);
