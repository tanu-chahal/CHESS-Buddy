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
import { updateMatch } from "./controllers/match.controller.js";

const app = express();
const httpServer = createServer(app);
const allowedOrigins = ["https://chessbuddy.vercel.app","http://localhost:5173","http://127.0.0.1:5173"];
app.use(cors({ origin: allowedOrigins, credentials: true }));
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH", "PUT"],
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
  res.send("Hello, CHESSBuddy API Server is running!");
});

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/match", matchRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).send(errorMessage);
});

const onlinePlayers = new Map();

io.on("connection", (socket) => {

  socket.on("joinMatch", (code) => {
    console.log("Connected in room!");
    if (!onlinePlayers.has(code)) {
      onlinePlayers.set(code, new Set());
    }
    onlinePlayers.get(code).add(socket.id);

    socket.join(code);
    const numberOfPlayers = onlinePlayers.get(code).size;
   if(numberOfPlayers===2) io.to(code).emit("OpponentStatus", true);
   else  socket.to(code).emit("OpponentStatus", false);

    socket.on("disconnect", () => {
      onlinePlayers.get(code).delete(socket.id);
      io.to(code).emit("OpponentStatus", false);
    });
  });

  socket.on("move", async (data) => {
    const updatedData = await updateMatch(data);
    io.to(updatedData.code).emit("updated", updatedData);
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  connect();
  console.log(`Server is listening on port ${PORT}...`);
});
