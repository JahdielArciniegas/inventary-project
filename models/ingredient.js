const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  name: String,
  amount: String,
  cost: String,
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

ingredientSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Ingredient", ingredientSchema);
