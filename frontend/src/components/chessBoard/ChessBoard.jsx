import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./ChessBoard.scss";

const ChessBoard = ({ id, boardState, whiteP, blackP, turnP, moves }) => {
  const socket = io("http://localhost:4000");
  useEffect(() => {
    const handleUpdated = (updatedData) => {
      console.log("Received updated match data:", updatedData);
      setBoard(updatedData.boardState);
      setTurn(updatedData.turn);
      setMoveN(updatedData.moves);
    };

    socket.on("connect", () => {
      console.log(socket.id)
      console.log("Connected to Socket.IO server!");
    });

    socket.on("updated", handleUpdated);

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server!");
    });

    return () => {
      socket.off("updated", handleUpdated);
    };
  }, []);

  const [highlighted, setHighlighted] = useState([]);
  const [board, setBoard] = useState(boardState);
  const [toMove, setToMove] = useState({})
  const [isCapture, setCapture] = useState(false)
  const [capturedPiece, setCapturedPiece] = useState(null)
  const [turn, setTurn] = useState(turnP);
  const [moveN, setMoveN] = useState(moves);
  const rows = ["8", "7", "6", "5", "4", "3", "2", "1"];
  const columns = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const white = ["♙", "♖", "♘", "♗", "♕", "♔"];
  const black = ["♛", "♚", "♝", "♞", "♜", "♟︎"];

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

  const isPieceWhite = (piece) => {
    return white.some((e) => e === piece);
  };
  const isPieceBlack = (piece) => {
    return black.some((e) => e === piece);
  };

  const handleHighlight = (r, c) => {
    const piece = board[r][c];
    if (turn === whiteP) {
      if (piece === "♙") {
        const allowedSquares = calculateAllowedSquaresForPawn(
          r,
          c,
          piece,
          board
        );
        setHighlighted(allowedSquares);
        setToMove({r: r, c: c});
      } else if (piece === "") {
        const allowedSquares = calculateAllowedSquaresForPawn(
          r,
          c,
          piece,
          boardState
        );
        setHighlighted(allowedSquares);
      } else if (piece === "") {
      } else {
        setHighlighted([]);
      }
    } 
    else {
      if (piece === "♟︎") {
        const allowedSquares = calculateAllowedSquaresForPawn(
          r,
          c,
          piece,
          boardState
        );
        setHighlighted(allowedSquares);
      } else if (piece === "") {
        const allowedSquares = calculateAllowedSquaresForPawn(
          r,
          c,
          piece,
          boardState
        );
        setHighlighted(allowedSquares);
      } else if (piece === "") {
      } else {
        setHighlighted([]);
      }
    }
  };

  const calculateAllowedSquaresForPawn = (r, c, piece, board) => {
    if (isPieceWhite(piece)) {
      if (moveN === 0) {
        const allowed = [
          { row: r, col: c },
          { row: r - 1, col: c },
          { row: r - 2, col: c },
        ];
        return allowed;
      } else {
        let allowed =[{ row: r, col: c },];
        if(isPieceBlack(board[r-1][c+1])){
          allowed.push({ row: r - 1, col: c+1 });
          setCapture(true);
        }
        else if(isPieceBlack(board[r-1][c-1])){allowed.push({ row: r - 1, col: c-1 });}
        else{
          allowed.push({ row: r - 1, col: c });
        }
        return allowed;
      }
    } else {
      if (moveN === 1) {
        const allowed = [
          { row: r, col: c },
          { row: r + 1, col: c },
          { row: r + 2, col: c },
        ];
        return allowed;
      } else {
        let allowed =[{ row: r, col: c },];
        if(isPieceWhite(boardState[r+1][c+1])){
          allowed = [
            { row: r + 1, col: c+1 },
          ];
        }else{
          allowed = [
            { row: r + 1, col: c },
          ];
        }
        return allowed;
      }
    }
  };

  const handleMovement = (row, col)=>{
    if(!isSquareHighlighted(row,col)){return;}
    if(isCapture) {setCapturedPiece(board[row][col])}
    let tempBoard = board;
    tempBoard[row][col] = board[toMove.r][toMove.c];
    tempBoard[toMove.r][toMove.c] = ""
    setBoard(tempBoard);
    setToMove({});
    setMoveN(moveN+1)
    turn === whiteP ? setTurn(blackP) : setTurn(whiteP)
    if(isCapture){handleCapture(); setCapture(false); return;}

    const data = {id: id,
      boardState: board,
      moves: moveN,
      turn: turn,
    }
    socket.emit("move",data);
    setHighlighted([]);
    setCapturedPiece(null);
  }

  const handleCapture = () =>{
    const data = {id: id,
      boardState: board,
      moves: moveN,
      turn: turn,
      captured: capturedPiece
    }
    socket.emit("move","la la la");
    setHighlighted([]);
    setCapturedPiece(null);
  }

  const isSquareHighlighted = (r, c) => {
    return highlighted.some((sq) => sq.row === r && sq.col === c);
  };

  return (
    <div className="ChessBoard">
      {rows.map((row, rowIndex) => (
        <div key={row} className="row">
          {columns.map((column, columnIndex) => (
            <div
              key={`${column}${row}`}
              className="square"
              style={
                isSquareHighlighted(rowIndex, columnIndex)
                  ? {
                      boxSizing: "border-box",
                      border: "2px solid green",
                      backgroundColor: "#82ae61",
                    }
                  : {}
              }
              onClick={()=>handleMovement(rowIndex, columnIndex)}
            >
              <span onClick={() => handleHighlight(rowIndex, columnIndex)}>
                {board[rowIndex][columnIndex]}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ChessBoard;
