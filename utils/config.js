require("dotenv").config();

const PORT = process.env.PORT;
const mongoUrl = process.env.URL_MONGO_DB;

module.exports = {
  mongoUrl,
  PORT,
};
