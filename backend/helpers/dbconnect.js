/*import mongoose from "mongoose";

// const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.zjels.mongodb.net/exitease`;
const uri = `mongodb+srv://shilpibohra:crioproject@cluster0.juw7s7h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

export default mongoose
  .connect(uri)
  .then(() => console.log("DB connection established"));*/
  import mongoose from "mongoose";
import "dotenv/config";

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.juw7s7h.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=Cluster0`;

export default mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));