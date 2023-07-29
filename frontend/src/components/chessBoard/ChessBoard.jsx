import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./ChessBoard.scss";
import getCurrentUser from "../../utils/getCurrentUser.js";

const ChessBoard = ({ id, code, boardState, whiteP, blackP, turnP, moves }) => {
  const currentUser = getCurrentUser();
  const [highlighted, setHighlighted] = useState([]);
  const [board, setBoard] = useState(boardState);
  const [toMove, setToMove] = useState({});
  const [isCapture, setCapture] = useState(false);
  const [turn, setTurn] = useState(turnP);
  const [moveN, setMoveN] = useState(moves);
  const rows = ["8", "7", "6", "5", "4", "3", "2", "1"];
  const columns = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const white = ["♙", "♖", "♘", "♗", "♕", "♔"];
  const black = ["♛", "♚", "♝", "♞", "♜", "♟︎"];
  const socket = io("http://localhost:4000");
  useEffect(() => {
    const handleUpdated = (updatedData) => {
      console.log("Received updated match data:", updatedData);
      setBoard(updatedData.boardState);
      setTurn(updatedData.turn);
      setMoveN(updatedData.moves);
    };

    socket.on("connect", () => {
      // console.log(socket.id)
      // console.log("Connected to Socket.IO server!");
    });
    socket.emit("joinMatch", code);

    socket.on("message", (message) => {
      console.log(message);
    });

    socket.on("updated", handleUpdated);

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server!");
    });

    return () => {
      socket.off("updated", handleUpdated);
    };
  }, []);

  useEffect(() => {
    const data = {
      id: id,
      boardState: board,
      moves: moveN,
      turn: turn,
    };
    console.log("Data: ", data);
   moveN!==moves ? socket.emit("move", data) : console.log("No change so no emit");
  }, [moveN]);

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
    setCapture(false);
    if (turn === whiteP && currentUser?._id === whiteP) {
      if (piece === "♙") {
        const allowedSquares = calculateAllowedSquaresForPawn(
          r,
          c,
          piece,
          board
        );
        setHighlighted(allowedSquares);
        setToMove({ r: r, c: c });
      } else if (piece === "♖") {
        const allowedSquares = calculateAllowedSquaresForRook(
          r,
          c,
          piece,
          board
        );
        setHighlighted(allowedSquares);
        setToMove({ r: r, c: c });
      } else if (piece === "♘") {
      } else if (piece === "♗") {
      } else if (piece === "♕") {
      } else if (piece === "♔") {
      } else {
        setHighlighted([]);
        setCapture(false);
      }
    } else if (turn === blackP && currentUser?._id === blackP) {
      if (piece === "♟︎") {
        const allowedSquares = calculateAllowedSquaresForPawn(
          r,
          c,
          piece,
          board
        );
        setHighlighted(allowedSquares);
        setToMove({ r: r, c: c });
      } else if (piece === "♜") {
        const allowedSquares = calculateAllowedSquaresForRook(
          r,
          c,
          piece,
          board
        );
        console.log(allowedSquares);
        setHighlighted(allowedSquares);
        setToMove({ r: r, c: c });
      } else if (piece === "") {
      } else {
        setHighlighted([]);
        setCapture(false);
      }
    }
  };

  const calculateAllowedSquaresForPawn = (r, c, piece, board) => {
    if (isPieceWhite(piece)) {
      if (moveN === 0) {
        const allowed = [
          { row: r - 1, col: c },
          { row: r - 2, col: c },
        ];
        return allowed;
      } else {
        let allowed = [];
        if (isPieceBlack(board[r - 1][c + 1])) {
          allowed.push({ row: r - 1, col: c + 1 });
          setCapture(true);
        }
        if (isPieceBlack(board[r - 1][c - 1])) {
          allowed.push({ row: r - 1, col: c - 1 });
          setCapture(true);
        }
        if (!isPieceWhite(board[r - 1][c]) && !isPieceBlack(board[r - 1][c])) {
          allowed.push({ row: r - 1, col: c });
        }
        return allowed;
      }
    } else {
      if (moveN === 1) {
        const allowed = [
          { row: r + 1, col: c },
          { row: r + 2, col: c },
        ];
        return allowed;
      } else {
        let allowed = [];
        if (isPieceWhite(boardState[r + 1][c + 1])) {
          allowed.push({ row: r + 1, col: c + 1 });
          setCapture(true);
        }
        if (isPieceWhite(boardState[r + 1][c - 1])) {
          allowed.push({ row: r + 1, col: c - 1 });
          setCapture(true);
        }
        if (!isPieceWhite(board[r + 1][c]) && !isPieceBlack(board[r + 1][c])) {
          allowed.push({ row: r + 1, col: c });
        }
        return allowed;
      }
    }
  };

  const calculateAllowedSquaresForRook = (r, c, piece, board) => {
    let allowed = [];

    for (let j = c+1; j < 8; j++) {
      if (
        (isPieceWhite(piece) && isPieceWhite(board[r][j])) ||
        (isPieceBlack(piece) && isPieceBlack(board[r][j]))
      ){
        break;}
      else if (
        (isPieceWhite(piece) && isPieceBlack(board[r][j])) ||
        (isPieceBlack(piece) && isPieceWhite(board[r][j]))
      ) {
        allowed.push({ row: r, col: j });
        setCapture(true);
        break;
      } else {
        allowed.push({ row: r, col: j });
      }
    }
    for (let j = c-1; j >= 0; j--) {
      if (
        (isPieceWhite(piece) && isPieceWhite(board[r][j])) ||
        (isPieceBlack(piece) && isPieceBlack(board[r][j]))
      ){
        break;}
      else if (
        (isPieceWhite(piece) && isPieceBlack(board[r][j])) ||
        (isPieceBlack(piece) && isPieceWhite(board[r][j]))
      ) {
        allowed.push({ row: r, col: j });
        setCapture(true);
        break;
      } else {
        allowed.push({ row: r, col: j });
      }
    }

    for (let i = r+1; i < 8; i++) {
      if (
        (isPieceWhite(piece) && isPieceWhite(board[i][c])) ||
        (isPieceBlack(piece) && isPieceBlack(board[i][c]))
      ){
        break;}
      else if (
        (isPieceWhite(piece) && isPieceBlack(board[i][c])) ||
        (isPieceBlack(piece) && isPieceWhite(board[i][c]))
      ) {
        allowed.push({ row: i, col: c });
        setCapture(true);
        break;
      } else {
        allowed.push({ row: i, col: c });
      }
    }
    for (let i = r-1; i >= 0; i--) {
      if (
        (isPieceWhite(piece) && isPieceWhite(board[i][c])) ||
        (isPieceBlack(piece) && isPieceBlack(board[i][c]))
      ){
        break;}
      else if (
        (isPieceWhite(piece) && isPieceBlack(board[i][c])) ||
        (isPieceBlack(piece) && isPieceWhite(board[i][c]))
      ) {
        allowed.push({ row: i, col: c });
        setCapture(true);
        break;
      } else {
        allowed.push({ row: i, col: c });
      }
    }
    return allowed;
  };

  const calculateAllowedSquaresForKnight = (r, c, piece, board) => {
    if (isPieceWhite(piece)) {
    } else {
    }
  };

  const calculateAllowedSquaresForBishop = (r, c, piece, board) => {
    if (isPieceWhite(piece)) {
    } else {
    }
  };

  const calculateAllowedSquaresForQueen = (r, c, piece, board) => {
    if (isPieceWhite(piece)) {
    } else {
    }
  };

  const calculateAllowedSquaresForKing = (r, c, piece, board) => {
    if (isPieceWhite(piece)) {
    } else {
    }
  };

  const handleMovement = (row, col) => {
    if (!isSquareHighlighted(row, col)) {
      return;
    }
    let tempBoard = board;
    tempBoard[row][col] = board[toMove.r][toMove.c];
    tempBoard[toMove.r][toMove.c] = "";
    setBoard(tempBoard);
    setToMove({});
    setMoveN(moveN + 1);
    turn === whiteP ? setTurn(blackP) : setTurn(whiteP);

    setHighlighted([]);
    setCapture(false);
  };

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
                      border: isCapture ? "2px solid red" : "2px solid green",
                      backgroundColor: isCapture ? "#FF4500" : "#82ae61",
                    }
                  : {}
              }
              onClick={() => handleMovement(rowIndex, columnIndex)}
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
