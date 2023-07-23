import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./ChessBoard.scss";

const ChessBoard = ({ boardState }) => {
  const [highlighted, setHighlighted] = useState([]);
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
      // console.log(socket.id)
      // console.log("Connected to Socket.IO server!");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server!");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // useEffect(() => {
  //   console.log("highlighted:", highlighted);
  // }, [highlighted]);

  const handleHighlight = (r, c) => {
    const piece = boardState[r][c];
    // console.log(piece);
    if (piece === "♙") {
      const allowedSquares = calculateAllowedSquaresForPawn(r, c, boardState);
      setHighlighted(allowedSquares);
    } else if (piece === "") {
    } else if (piece === "") {
    } else {
      setHighlighted([]);
    }
  };

  const calculateAllowedSquaresForPawn = (r, c, boardState) => {
    // console.log("Current" + r + " " + c);
    const allowed = [
      { row: r, col: c },
      { row: r - 1, col: c },
      { row: r - 2, col: c },
    ];
    return allowed;
  };

  const isSquareHighlighted = (r, c) => {
    return highlighted.some((sq) => sq.row === r && sq.col === c);
  };

  return (
    <div className="ChessBoard">
      {rows.map((row, rowIndex) => (
        <div key={row} className="row">
          {columns.map((column, columnIndex) => (
            <div key={`${column}${row}`} className="square" style={isSquareHighlighted(rowIndex, columnIndex) ?  {backgroundColor: "rgb(255, 0,0)"}: {}}>
              <span onClick={()=>handleHighlight(rowIndex, columnIndex)}>{boardState[rowIndex][columnIndex]}</span>
            </div>
            
          ))}
        </div>
      ))}
    </div>
  );
};

export default ChessBoard;
