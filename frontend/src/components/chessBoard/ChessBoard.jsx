import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./ChessBoard.scss";
import getCurrentUser from "../../utils/getCurrentUser.js";
import { isPieceWhite, isPieceBlack } from "../../utils/chessUtils.js";
import {calculateAllowedSquares} from "../../utils/allowedSquares.js";

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
  const [checkedKing, setCheckedKing] = useState(cK);
  const [winner, setWinner] = useState(null);
  const [turn, setTurn] = useState(turnP);
  const [moveN, setMoveN] = useState(moves);
  const rows = ["8", "7", "6", "5", "4", "3", "2", "1"];
  const columns = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const socket = io("http://localhost:4000");

  const handleOver = () => {
    setTimeout(() => {
      handleNavigate();
    }, 4000);
  };

  useEffect(() => {
    const handleUpdated = (updatedData) => {
      setBoard(updatedData.boardState);
      setTurn(updatedData.turn);
      setMoveN(updatedData.moves);
      setCheckedKing(updatedData.checkedKing);
      setWinner(updatedData.winner);
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
    if (moveN !== moves) {
      socket.emit("move", data);
    }
  }, [moveN]);

  const handleNavigate = () => {
    window.location.href = `/games?reload=true`;
  };

  const handleHighlight = (r, c) => {
    const piece = board[r][c];
    setCapture(false);
    if (
      turn === currentUser?._id &&
      ((isPieceWhite(piece) && currentUser?._id === whiteP) ||
        (isPieceBlack(piece) && currentUser?._id === blackP))
    ) {
      const { allowed, capture } = calculateAllowedSquares(
        piece,
        r,
        c,
        board,
        turn,
        whiteP,
        blackP
      );
      setHighlighted(allowed);
      setCapture(capture);
      setToMove({ r: r, c: c });
    } else {
      setHighlighted([]);
      setCapture(false);
    }
  };

  const handleMovement = (row, col) => {
    if (!isSquareHighlighted(row, col)) {
      return;
    }
    if (board[toMove.r][toMove.c] === checkedKing) {
      setCheckedKing(null);
    }
    let tempBoard = JSON.parse(JSON.stringify(board));
    tempBoard[row][col] = board[toMove.r][toMove.c];
    tempBoard[toMove.r][toMove.c] = "";
    setBoard(tempBoard);
    setToMove({});
    turn === whiteP ? setTurn(blackP) : setTurn(whiteP);
    setMoveN(moveN + 1);

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
                  (checkedKing !== null) &&
                  (board[rowIndex][columnIndex] === checkedKing)
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
