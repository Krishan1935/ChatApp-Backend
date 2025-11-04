// packages
import e from "express";

// config
import connectDB from "./config/db.js";
import { configDotenv } from "dotenv";
configDotenv();

// .env
const PORT = process.env.PORT || 4000;

const app = e();

connectDB();
app.listen(PORT, ()=>{
    console.log("Server started on PORT: ", PORT);
});