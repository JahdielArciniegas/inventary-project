const express = require("express");
const app = express();
const cors = require("cors");
const { PORT, mongoUrl } = require("./utils/config");
const mongoose = require("mongoose");
const usersRouter = require("./controllers/users");
const recipesRouter = require("./controllers/recipes");
const ingredientsRouter = require("./controllers/ingredients");
const loginRouter = require("./controllers/login");

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

app.use("/api/user", usersRouter)
app.use("/api/recipe", recipesRouter)
app.use("/api/ingredient", ingredientsRouter)
app.use("/api/login", loginRouter)



app.listen(PORT, (req, res) => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
