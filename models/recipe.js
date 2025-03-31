const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: String,
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
});

recipeSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Recipe", recipeSchema);
