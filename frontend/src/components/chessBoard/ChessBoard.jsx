import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./ChessBoard.scss";
import getCurrentUser from "../../utils/getCurrentUser.js";
import {
  isPieceWhite,
  isPieceBlack,
  findKingPosition,
  isValidMove,
} from "../../utils/chessUtils.js";
import calculateAllowedSquaresForPawn from "../../utils/pieces/pawn.js";
import calculateAllowedSquaresForRook from "../../utils/pieces/rook.js";
import calculateAllowedSquaresForKnight from "../../utils/pieces/knight.js";
import calculateAllowedSquaresForBishop from "../../utils/pieces/bishop.js";
import calculateAllowedSquaresForQueen from "../../utils/pieces/queen.js";

const ChessBoard = ({
  id,
  code,
  boardState,
  whiteP,
  blackP,
  turnP,
  moves,
  cK,
}) => {
  const currentUser = getCurrentUser();
  const [highlighted, setHighlighted] = useState([]);
  const [board, setBoard] = useState(boardState);
  const [toMove, setToMove] = useState({});
  const [isCapture, setCapture] = useState(false);
  // const [danger, setDanger] = useState([]);
  const [checkedKing, setCheckedKing] = useState(cK);
  const [checkMate, setCheckMate] = useState(false);
  const [winner, setWinner] = useState(null);
  const [turn, setTurn] = useState(turnP);
  const [moveN, setMoveN] = useState(moves);
  const rows = ["8", "7", "6", "5", "4", "3", "2", "1"];
  const columns = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const socket = io("http://localhost:4000");

  const handleGameWin = (winningPlayer) => {
    setTimeout(() => {
      setWinner(winningPlayer);
    }, 4000);
  };

  const handleOver = () => {
    const data = {
      id: id,
      boardState: board,
      turn: "",
      winner: winner,
      status: "Finished",
    };
    socket.emit("move", data);
    handleNavigate();
  };

  useEffect(() => {
    const handleUpdated = (updatedData) => {
      console.log("Received updated match data:", updatedData);
      setBoard(updatedData.boardState);
      setTurn(updatedData.turn);
      setMoveN(updatedData.moves);
      setCheckedKing(updatedData.checkedKing)
      handleCheckAndCheckmate(board, turn, whiteP, blackP);
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
      checkedKing: checkedKing,
    };
    console.log("Data: ", data);
    if (moveN !== moves && !checkMate) {
      socket.emit("move", data);
      // handleCheckAndCheckmate(board, turn, whiteP, blackP);
    }
  }, [moveN]);

  const handleNavigate = () => {
    window.location.href = `/games?reload=true`;
  };

  const handleCheckAndCheckmate = () => {
    const checkedKingColor = turn === whiteP ? "white" : "black";
    const kingPosition = findKingPosition(board, checkedKingColor);
    if (isKingInCheck(board, kingPosition.row, kingPosition.col)) {
      if (isCheckmate(board, kingPosition)) {
        setCheckMate(true);
        const w = isPieceWhite(checkedKing) ? blackP : whiteP;
        setTurn(null);
        handleGameWin(w);
      }
    }
    console.log("Checked: ", checkedKing);
    console.log("CheckMate: ", checkMate);
    console.log("Winner: ", winner);
  };

  const handleHighlight = (r, c) => {
    const piece = board[r][c];
    setCapture(false);
    if (
      turn === currentUser?._id &&
      ((isPieceWhite(piece) && currentUser?._id === whiteP) ||
        (isPieceBlack(piece) && currentUser?._id === blackP))
    ) {
      const {allowed, capture} = calculateAllowedSquares(piece, r, c, board);
      setHighlighted(allowed);
      setCapture(capture);
      setToMove({ r: r, c: c });
    } else {
      setHighlighted([]);
      setCapture(false);
    }
  };

  const calculateAllowedSquares = (piece, r, c, board) => {
    const pieceMap = {
      "♙": calculateAllowedSquaresForPawn,
      "♖": calculateAllowedSquaresForRook,
      "♘": calculateAllowedSquaresForKnight,
      "♗": calculateAllowedSquaresForBishop,
      "♕": calculateAllowedSquaresForQueen,
      "♔": calculateAllowedSquaresForKing,
      "♟︎": calculateAllowedSquaresForPawn,
      "♜": calculateAllowedSquaresForRook,
      "♞": calculateAllowedSquaresForKnight,
      "♝": calculateAllowedSquaresForBishop,
      "♛": calculateAllowedSquaresForQueen,
      "♚": calculateAllowedSquaresForKing,
    };

    const allowedSquaresFn = pieceMap[piece];
    if (allowedSquaresFn) {
      return allowedSquaresFn(r, c, piece, board);
    } else {
      return {allowed: [], capture: false};
    }
  };

  const calculateAllowedSquaresForKing = (r, c, piece, board) => {
    let allowed = [];
    let capture = false;
    const checkSquare = (row, col) => {
      if (!isValidMove(row, col)) {
        return;
      }
      const target = board[row][col];
      if (
        (isPieceWhite(piece) && isPieceWhite(target)) ||
        (isPieceBlack(piece) && isPieceBlack(target))
      ) {
        return;
      }
      allowed.push({ row, col });
      if (
        (isPieceWhite(piece) && isPieceBlack(target)) ||
        (isPieceBlack(piece) && isPieceWhite(target))
      ) {
        capture = true;
      }
    };
    checkSquare(r - 1, c);
    checkSquare(r - 1, c - 1);
    checkSquare(r - 1, c + 1);
    checkSquare(r + 1, c);
    checkSquare(r + 1, c - 1);
    checkSquare(r + 1, c + 1);
    checkSquare(r, c - 1);
    checkSquare(r, c + 1);

    const king = board[r][c];
    for (let i = 0; i < allowed.length; i++) {
      const dangerous = dangerousPositions(
        board,
        king,
        allowed[i].row,
        allowed[i].col
      );
      allowed = allowed.filter(
        (pos) => !dangerous.some((d) => d.row === pos.row && d.col === pos.col)
      );
    }
    console.log(allowed);
    return {allowed, capture};
  };

  const isKingInCheck = (board, kingRow, kingCol) => {
    const king = board[kingRow][kingCol];
    console.log("KingToTest: ", king);
    const dangerous = dangerousPositions(board, king, kingRow, kingCol);
    if (dangerous.length == 0) {
      setCheckedKing(null);
      return false;
    } else return true;
  };

  const dangerousPositions = (board, king, kingRow, kingCol) => {
    let dangerous = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (
          ((isPieceWhite(king) && isPieceBlack(piece)) ||
          (isPieceBlack(king) && isPieceWhite(piece)))
        ) {
          const allowedSquares = calculateAllowedSquares(
            piece,
            row,
            col,
            board
          );
          for (let i = 0; i < allowedSquares.length; i++) {
            if (
              allowedSquares[i].row === kingRow &&
              allowedSquares[i].col === kingCol
            ) {
              setCheckedKing(king);
              dangerous.push({
                row: allowedSquares[i].row,
                col: allowedSquares[i].col,
              });
            }
          }
        }
      }
    }
    return dangerous;
  };

  const isCheckmate = (board, kingPosition) => {
    if (!kingPosition) {
      return false;
    }

    const { row, col } = kingPosition;
    
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) {
          continue;
        }

        const newRow = row + dx;
        const newCol = col + dy;

        if (
          isValidMove(newRow, newCol) &&
          !isKingInCheck(board, newRow, newCol)
        ) {
          return false;
        }
      }
    }

    return true;
  };

  const handleMovement = (row, col) => {
    if (!isSquareHighlighted(row, col)) {
      return;
    }
    if (board[toMove.r][toMove.c] === checkedKing) {
      setCheckedKing(null);
    }
    let tempBoard = board;
    tempBoard[row][col] = board[toMove.r][toMove.c];
    tempBoard[toMove.r][toMove.c] = "";
    setBoard(tempBoard);
    setToMove({});

    setMoveN(moveN + 1);
    turn === whiteP ? setTurn(blackP) : setTurn(whiteP);

    // handleCheckAndCheckmate(tempBoard, turn, whiteP, blackP);

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
              <span
                onClick={() => handleHighlight(rowIndex, columnIndex)}
                style={
                  checkedKing !== null &&
                  board[rowIndex][columnIndex] === checkedKing
                    ? { color: "yellow" }
                    : {}
                }
              >
                {board[rowIndex][columnIndex]}
              </span>
            </div>
          ))}
        </div>
      ))}

      {winner && (
        <div className="end">
          <span className="checkMate">CheckMate!</span>
          <span>Winner {winner === whiteP ? "White " : "Black"}</span>
          <button onClick={handleOver}>Game Over</button>
        </div>
      )}
    </div>
  );
};

export default ChessBoard;
