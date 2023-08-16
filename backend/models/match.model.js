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
      enum: ["Finished", "Active", "Aborted"],
      default: "Active",
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
    checkedKing: {
      type: String,
      default: null,
    },
    lastMove: {
      type: [Number],
      default: [-1, -1, -1, -1],
    },
    castling: {
      type: [Boolean],
      default: [false, false, false, false, false, false],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Match", matchSchema);
