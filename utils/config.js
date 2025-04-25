import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT;
export const mongoUrl = process.env.URL_MONGO_DB;

