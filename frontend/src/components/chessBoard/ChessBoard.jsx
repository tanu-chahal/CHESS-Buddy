import React,{useEffect} from "react";
import { io } from "socket.io-client";
import "./ChessBoard.scss";

const ChessBoard = ({ boardState }) => {
  const rows = ["8", "7", "6", "5", "4", "3", "2", "1"];
  const columns = ["A", "B", "C", "D", "E", "F", "G", "H"];

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

  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("connect", () => {
      console.log(socket.id)
      console.log("Connected to Socket.IO server!");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server!");
    })

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="ChessBoard">
      {rows.map((row, rowIndex) => (
        <div key={row} className="row">
          {columns.map((column, columnIndex) => (
            <div key={`${column}${row}`} className="square">
              {boardState[rowIndex][columnIndex]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ChessBoard;
