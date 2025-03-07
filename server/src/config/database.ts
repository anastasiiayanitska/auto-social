import mongoose from "mongoose";
import "dotenv/config"
import { log } from "console";

const MONGO_URI= process.env.MONGO_URI

const connectDB = async():Promise<void>=>{
    try{
        const conn = await mongoose.connect(MONGO_URI as string)
        console.log("Connected to MongoDB: ", conn.connection.host);
               
    }catch(error:any){
        console.error("Error connecting to MongoDB: ",error);
        process.exit(1)
        
    }
}

export default connectDB