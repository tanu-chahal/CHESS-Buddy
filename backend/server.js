import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import matchRoute from "./routes/match.route.js";
import {updateMatch} from "./controllers/match.controller.js"

const app = express();
const httpServer = createServer(app);
const allowedOrigins = ["http://127.0.0.1:5173"];
app.use(cors({ origin: allowedOrigins, credentials: true }));
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
dotenv.config();
mongoose.set("strictQuery", true);

app.use(express.json());
app.use(cookieParser());

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");
  } catch (error) {
    console.log(error);
  }
};

app.get("/", (req, res) => {
  res.send("Hello, CHESSBuddy Server is running on port 4000!");
});

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/match", matchRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).send(errorMessage);
});

// app.listen(4000, () => {
//   connect();
//   console.log("Server is listening on the port 4000...")
// })

io.on("connection", (socket) => {
  // console.log(socket.id);
  // console.log("A User Connected!");

  socket.on("joinMatch", (code) => {
    socket.join(code);
    console.log("Connected in room!");
    socket.emit("message", "You joined the match successfully!");
  });

  socket.on("move", async (data) => {
    console.log("Received move data:", data);
    const updatedData = await updateMatch(data);
    console.log(updatedData)
    io.to(updatedData.code).emit("updated", updatedData);
  });

});

// httpServer.listen(4000)
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  connect();
  console.log(`Server is listening on port ${PORT}...`);
});
