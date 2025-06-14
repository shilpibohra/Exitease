/*import mongoose from "mongoose";

// const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.zjels.mongodb.net/exitease`;
const uri = `mongodb+srv://shilpibohra:crioproject@cluster0.juw7s7h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

export default mongoose
  .connect(uri)
  .then(() => console.log("DB connection established"));*/
  import mongoose from "mongoose";
//import "dotenv/config";
import dotenv from 'dotenv';
dotenv.config();
const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.juw7s7h.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=Cluster0`;
console.log("Using MONGO_URI:", process.env.MONGO_URI);
console.log("Using username:", process.env.MONGO_USERNAME);
console.log("Using password:", process.env.MONGO_PASSWORD ? "******" : undefined);
console.log("Using DB name:", process.env.MONGO_DB);
export default mongoose 
  .connect(uri)
  .then(() => console.log("DB connection established"));