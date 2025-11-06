// packages
import e from "express";
import cookieParser from "cookie-parser";

// config
import connectDB from "./config/db.js";
import { configDotenv } from "dotenv";
configDotenv();

// routers
import authRouter from "./routes/AuthRoutes.js";

// .env
const PORT = process.env.PORT || 4000;

const app = e();
app.use(e.json());
app.use(cookieParser());

app.use('/auth', authRouter);

connectDB();
app.listen(PORT, ()=>{
    console.log("Server started on PORT: ", PORT);
});