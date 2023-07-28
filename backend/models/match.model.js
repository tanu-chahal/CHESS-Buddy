import mongoose from "mongoose";
const { Schema } = mongoose;

const initialBoardState = [
  ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
  ["♟︎", "♟︎", "♟︎", "♟︎", "♟︎", "♟︎", "♟︎", "♟︎"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
  ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
];

const matchSchema = new Schema(
  {
    white: {
      type: String,
      required: true,
    },
    black: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["Finished", "Paused", "Cancelled"],
      default: "Paused",
    },
    boardState: {
      type: [[String]],
      default: initialBoardState,
    },
    winner: {
      type: String,
    },
    turn: {
      type: String,
      required: true,
    },
    moves: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Match", matchSchema);
