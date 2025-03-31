const express = require("express");

const app = express();
const PORT = 3000;
const cors = require("cors");

app.use(cors());
app.use(express());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, (req, res) => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
