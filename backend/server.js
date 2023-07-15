import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.route.js";

const app = express();
dotenv.config();
mongoose.set("strictQuery", true);

const allowedOrigins = ["http://127.0.0.1:5173"];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json())


const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");
  } catch (error) {
    console.log(error)
  }
}

app.get("/", (req, res) => {
  res.send("Hello, CHESSBuddy Server is running on port 4000!");
})

app.use("/api/auth", authRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).send(errorMessage);
})

app.listen(4000, () => {
  connect();
  console.log("Server is listening on the port 4000...");
})