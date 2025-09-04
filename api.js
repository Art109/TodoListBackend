import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = 3000;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected on MongoDB");
  } catch (error) {
    console.log("Error to connect to acess the database", error);
  }
};

app.get("/", (req, res) => {});

app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
