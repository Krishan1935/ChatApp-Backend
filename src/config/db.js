import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

const connectDB =  async () => {
    await mongoose.connect(process.env.DB_URL)
    .then(()=>{
        console.log("Connected to DB");
    })
    .catch(error=>{
        console.log("Error in DB Connection: ");
        console.error(error);
    })
}

export default connectDB;