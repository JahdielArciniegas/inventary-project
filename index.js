import express from "express";
const app = express();
import cors from "cors";
import { PORT, mongoUrl } from "./utils/config.js";
import mongoose from "mongoose";
import usersRouter from "./controllers/users.js";
import recipesRouter from "./controllers/recipes.js";
import ingredientsRouter from "./controllers/ingredients.js";
import loginRouter from "./controllers/login.js";

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
